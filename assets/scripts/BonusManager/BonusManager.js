//道具管理员，其node是一个挂在canvas下的空节点
// const BoomPrefab = require('BoomPrefab');

cc.Class({
    extends: cc.Component,

    properties: {
        boom: cc.Prefab,
        boomTool: cc.Prefab,
        toolSpeed: 20,
        toolAngleSpeed: 25,
        toolNumb: 0,
    },

    init() {
        // this.toolSpeed = 20;
        // this.toolNumb = 0;

        this.canvas = cc.find('Canvas');
        this.game = this.canvas.getComponent('Game');
        this.boomPool = new cc.NodePool('Boom'); //control-js-component
        this.boomToolPool = new cc.NodePool('BoomTool');
    },

    dispatch(action) {
        switch (action.type) {
            case 'BOOM':
                let node = this.create(this.boomPool, this.boom);
                node.setParent(this.game.player.node);
                break;
            case 'BOOM_TOOL':
                this.createTool(this.boomToolPool, this.boomTool);
                break;
            case 'RECYCLE_BOOM':
                this.boomPool.put(action.node);
                break;
            case 'RECYCLE_BOOM_TOOL':
                this.boomToolPool.put(action.node);
                // if (action.node.name === 'BoomTool') {
                //     this.boomToolPool.put(action.node);
                // }
                this.toolNumb--;
                break;
            default: cc.error('UNCLEAR ACTION: ' + aciton.type);
        }
    },

    create(pool, prefab) {
        if (!pool.size()) {
            pool.put(cc.instantiate(prefab));
        }
        return pool.get(this);
    },

    createTool(pool, prefab) {
        let node = this.create(pool, prefab);
        // node.position = this.game.randomPos();
        node.setParent(this.canvas);
        this.toolNumb++;
    },

});
