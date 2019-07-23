cc.Class({
    extends: cc.Component,

    properties: {
        prefab: cc.Prefab,
        enemyInvincible: cc.SpriteFrame,
        enemyNumb: 0,
    },

    init() {
        this.canvas = cc.find('Canvas');
        this.game = this.canvas.getComponent('Game');
        this.target = this.game.player;
        this.enemyPool = new cc.NodePool('Enemy');
        this.enemyColor = [ //https://www.sohu.com/a/125413399_101278
            cc.color(250, 202, 46),
            cc.color(255, 44, 14),
            cc.color(117, 207, 219),
            cc.color(240, 195, 186),
            cc.color(123, 177, 55),
            cc.color(216, 0, 102),
            cc.color(202, 160, 102),
        ]
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
            default: break;
        }
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
            let pos1 = this.game.randomPos();
            node.position = pos1;
            // node.position = this.game.randomPos();
        }
        this.enemyNumb++;

        return node;
    },

    killEnemy(node) {
        this.enemyPool.put(node);
        this.enemyNumb--;
    },

    mergeEnemy(node1, node2) {
        if (!node1 || !node2 || node1.uuid < node2.uuid) {
            return;
        }
        let level1 = node1.getComponent('Enemy').level;
        let level2 = node1.getComponent('Enemy').level;
        let pos = level1 > level2 ? node1.position : node1.position;
        this.killEnemy(node1);
        this.killEnemy(node1);
        this.createEnemy(level1 + level2, pos, false);

    },

    randomColor() {
        let randomNumb = Math.floor(Math.random() * this.enemyColor.length);
        return this.enemyColor[randomNumb];
    },
});
