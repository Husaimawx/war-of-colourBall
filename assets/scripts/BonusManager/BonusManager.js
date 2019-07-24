
cc.Class({
    extends: cc.Component,

    properties: {
        boom: cc.Prefab,
        boomTool: cc.Prefab,
        aim: cc.Prefab,
        aimTool: cc.Prefab,
        toolSpeed: 20,
        toolAngleSpeed: 25,
        toolNumb: 0,
        maxTool: 5,
        toolCD: 5,
    },

    init() {
        this.canvas = cc.find('Canvas');
        this.game = this.canvas.getComponent('Game');
        this.boomPool = new cc.NodePool('Boom'); //control-js-component
        this.boomToolPool = new cc.NodePool('BoomTool');
        this.aimPool = new cc.NodePool('Aim');
        this.aimToolPool = new cc.NodePool('AimTool');
        this.bonus = ['BOOM', 'AIM'];

        this.schedule(() => {
            if (this.toolNumb < this.maxTool) {
                let numb = Math.floor((Math.random() * this.bonus.length));
                this.dispatch({ type: `FIRE/${this.bonus[numb]}_TOOL` });
            }
        }, this.toolCD);
    },

    dispatch(action) {
        switch (action.type.split('/')[0]) {
            case 'FIRE':
                this.fire(action);
                break;
            case 'RECYCLE':
                this.recycle(action);
                break;
            default: cc.error('UNCLEAR ACTION: ' + aciton.type);
        }
    },

    fire(action) {
        switch (action.type.split('/')[1]) {
            case 'BOOM': {
                let node = this.create(this.boomPool, this.boom);
                node.setParent(this.game.player.node);
                break;
            }
            case 'AIM': {
                for (let e of this.game.enemyManager.enemys) {
                    let aimNode = this.create(this.aimPool, this.aim);
                    aimNode.setParent(e);
                }
                break;
            }
            case 'BOOM_TOOL': { }
                this.createTool(this.boomToolPool, this.boomTool);
                break;
            case 'AIM_TOOL':
                this.createTool(this.aimToolPool, this.aimTool);
                break;
            default: cc.error('UNCLEAR ACTION: ' + aciton.type);
        }
    },

    recycle(action) {
        switch (action.type.split('/')[1]) {
            case 'BOOM':
                this.boomPool.put(action.node);
                break;
            case 'AIM':
                this.aimPool.put(action.node);
                break;
            case 'BOOM_TOOL': {
                this.boomToolPool.put(action.node);
                this.toolNumb--;
                break;
            }
            case 'AIM_TOOL': {
                this.aimToolPool.put(action.node);
                this.toolNumb--;
                break;
            }
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
        node.position = this.game.randomPos();
        node.setParent(this.canvas);
        this.toolNumb++;
    },

});
