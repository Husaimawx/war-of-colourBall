
cc.Class({
    extends: cc.Component,

    properties: {
        boom: cc.Prefab,
        boomTool: cc.Prefab,
        boomAudio: {
            type: cc.AudioClip,
            default: null,
        },

        aim: cc.Prefab,
        aimTool: cc.Prefab,
        aimAudio1: {
            type: cc.AudioClip,
            default: null,
        },
        aimAudio2: {
            type: cc.AudioClip,
            default: null,
        },

        arrow: cc.Prefab,
        arrowTool: cc.Prefab,
        arrowAudio: {
            type: cc.AudioClip,
            default: null,
        },


        toolSpeed: 20,
        toolAngleSpeed: 25,
        toolNumb: 0,
        maxTool: 5,
        toolCD: 6,
    },

    init() {
        this.canvas = cc.find('Canvas');
        this.game = this.canvas.getComponent('Game');
        this.boomPool = new cc.NodePool('Boom'); //control-js-component
        this.boomToolPool = new cc.NodePool('BoomTool');
        this.aimPool = new cc.NodePool('Aim');
        this.aimToolPool = new cc.NodePool('AimTool');
        this.arrowPool = new cc.NodePool('Arrow');
        this.arrowToolPool = new cc.NodePool('ArrowTool');
        this.bonus = ['BOOM', 'AIM', 'ARROW'];

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
            case 'ARROW':
                this.fireArrow();
                break;
            case 'BOOM_TOOL':
                this.createTool(this.boomToolPool, this.boomTool);
                break;
            case 'AIM_TOOL':
                this.createTool(this.aimToolPool, this.aimTool);
                break;
            case 'ARROW_TOOL':
                this.createTool(this.arrowToolPool, this.arrowTool);
                break;
            case 'RANDOM_TOOL':
                this.randomTool();
                break;
            default: cc.error('UNCLEAR ACTION: ' + aciton.type);
        }
    },

    fireBoom() {
        this.schedule(() => {
            let node = this.create(
                this.boomPool,
                this.boom,
                this.game.player.node
            );
            cc.audioEngine.playEffect(this.boomAudio);
        }, 0.8, 2, 0);
        this.schedule(() => {
            let node = this.create(
                this.boomPool,
                this.boom,
                this.canvas
            );
            node.position = this.game.randomPos();
            cc.audioEngine.playEffect(this.boomAudio);
        }, 0.5, 4, 0.5);
    },

    fireAim() {
        for (let eNode of this.game.enemyManager.enemys) {
            // if (Math.random() > 0.5) {
            //     return;
            // }
            let e = eNode.getComponent('Enemy');
            e.invincible = true;
            e.unscheduleAllCallbacks();
            let aimNode = this.create(this.aimPool, this.aim, eNode);
            cc.audioEngine.playEffect(this.aimAudio1);
            cc.director.getScheduler().pauseTarget(this.game.enemyManager);
            this.scheduleOnce(() => {
                cc.director.getScheduler().resumeTarget(this.game.enemyManager);
            }, 3);
            this.scheduleOnce(() => {
                cc.audioEngine.playEffect(this.aimAudio2);
            }, 1.5);
        }
    },

    fireArrow() {
        let i = 0;
        const f = (delay) => {
            this.schedule(() => {
                let direction = cc.v2(
                    Math.sin(i * 45 / 180 * Math.PI),
                    Math.cos(i * 45 / 180 * Math.PI),
                )
                let arrowNode = this.create(
                    this.arrowPool,
                    this.arrow,
                    parent = this.canvas,
                    direction = direction,
                )
                i++;
            }, 0.03, 7, delay);
            this.scheduleOnce(() => {
                cc.audioEngine.playEffect(this.arrowAudio);
            }, 1 + 0.03 * 8);
        }
        f(0);
        // f(1.5);
        // f(3);
    },

    recycle(action) {
        switch (action.type.split('/')[1]) {
            case 'BOOM':
                this.boomPool.put(action.node);
                break;
            case 'AIM':
                this.aimPool.put(action.node);
                break;
            case 'ARROW':
                this.arrowPool.put(action.node);
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
            case 'ARROW_TOOL': {
                this.arrowToolPool.put(action.node);
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
