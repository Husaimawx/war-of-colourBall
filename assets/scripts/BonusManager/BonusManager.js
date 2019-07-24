
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
            this.randomTool();
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

    randomTool() {
        if (this.toolNumb < this.maxTool) {
            let numb = Math.floor((Math.random() * this.bonus.length));
            this.dispatch({ type: `FIRE/${this.bonus[numb]}_TOOL` });
        }
    },

    fire(action) {
        switch (action.type.split('/')[1]) {
            case 'BOOM':
                this.fireBoom();
                break;
            case 'AIM':
                this.fireAim();
                break;
            case 'BOOM_TOOL':
                this.createTool(this.boomToolPool, this.boomTool);
                break;
            case 'AIM_TOOL':
                this.createTool(this.aimToolPool, this.aimTool);
                break;
            case 'RANDOM_TOOL':
                this.randomTool();
                break;
            default: cc.error('UNCLEAR ACTION: ' + aciton.type);
        }
    },

    fireBoom() {
        let node = this.create(
            this.boomPool,
            this.boom,
            this.game.player.node
        );
        this.schedule(() => {
            let node = this.create(
                this.boomPool,
                this.boom,
                this.canvas
            );
            node.position = this.game.randomPos();
        }, 0.5, 4, 0.5);
    },

    fireAim() {
        for (let eNode of this.game.enemyManager.enemys) {
            let e = eNode.getComponent('Enemy');
            if (e.invincible) {
                return;
            }
            e.invincible = true;
            let aimNode = this.create(this.aimPool, this.aim, eNode);
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

    create(pool, prefab, ...args) {
        if (!pool.size()) {
            pool.put(cc.instantiate(prefab));
        }
        return pool.get(this, ...args);
    },

    createTool(pool, prefab) {
        let node = this.create(pool, prefab);
        node.position = this.game.randomPos();
        node.setParent(this.canvas);
        this.toolNumb++;
    },

});
