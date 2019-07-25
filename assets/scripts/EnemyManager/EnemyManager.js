cc.Class({
    extends: cc.Component,

    properties: {
        prefab: cc.Prefab,
        enemyInvincible: cc.SpriteFrame,
        maxEnemy: 40,
        enemySpeed: 80,
        maxEnemySpeed: 200,
        enemyCD: 2,
        minEnemyCD: 0.6,
    },

    set enemyCD(cd) {
    },

    init() {
        this.canvas = cc.find('Canvas');
        this.game = this.canvas.getComponent('Game');
        this.target = this.game.player;
        this.enemyPool = new cc.NodePool('Enemy');
        this.enemys = [];
        this.enemyColor = [ //https://www.sohu.com/a/125413399_101278
            cc.color(250, 202, 46),
            cc.color(255, 44, 14),
            cc.color(117, 207, 219),
            cc.color(240, 195, 186),
            cc.color(123, 177, 55),
            cc.color(216, 0, 102),
            cc.color(202, 160, 102),
        ]
        this.scheduleRenderEnemy();
    },

    dispatch(action) {
        switch (action.type) {
            case 'CREATE_ENEMY':
                this.createEnemy(action.level, action.pos);
                break;
            case 'KILL_ENEMY':
                this.killEnemy(action.node);
                break;
            case 'MERGE_ENEMY':
                this.mergeEnemy(action.node1, action.node2);
                break;
            case 'CHANGE_CD':
                this.changeCD(action.enemyCD);
                this.scheduleRenderEnemy();
                break;
            case 'CHANGE_SPEED':
                this.changeSpeed(action.enemySpeed);
                break;
            default: break;
        }
    },

    render() {
        if (this.enemys.length < this.maxEnemy) {
            this.dispatch({ type: 'CREATE_ENEMY' });
        }
    },

    scheduleRenderEnemy() {
        this.unscheduleAllCallbacks();
        this.schedule(this.render, this.enemyCD);
    },

    createEnemy(level = 1, pos = null, invincible = true) {
        if (!this.enemyPool.size()) {
            this.enemyPool.put(cc.instantiate(this.prefab));
        }
        let node = this.enemyPool.get(this, level, invincible);
        node.setParent(this.canvas);

        // set position
        if (pos instanceof cc.Vec2) {
            node.position = pos;
        } else {
            node.position = this.game.randomPos();
        }

        this.totalEnemys++;
        return this.enemys.push(node);
    },

    killEnemy(node) {
        this.enemys = this.enemys.filter(e => {
            return e.uuid !== node.uuid;
        })
        this.enemyPool.put(node);
        this.game.score.dispatch({
            type: 'ADD',
            score: node.getComponent('Enemy').level
        })
    },

    randomColor() {
        let randomNumb = Math.floor(Math.random() * this.enemyColor.length);
        return this.enemyColor[randomNumb];
    },

    changeCD(cd) {
        if (cd < this.minEnemyCD) {
            return;
        }
        this.enemyCD = cd;
    },

    changeSpeed(value) {
        if (value > this.maxEnemySpeed) {
            return;
        }
        this.enemySpeed = value;
    },
});
