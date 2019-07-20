
const Player = require('Player');
const Rocker = require('Rocker');
const Score = require('Score');

cc.Class({
    extends: cc.Component,
    properties: {
        rocker: Rocker,
        player: Player,
        score: Score,
        bulletPrefab: cc.Prefab,
        enemyPrefab: cc.Prefab,

        maxBullet: 0,
        maxEnemy: 0,

        enemyCD: 0,
        bulletCD: 0,
    },

    onLoad() {
        this.bulletPool = new cc.NodePool('Bullet');
        this.enemyPool = new cc.NodePool('Enemy');
        cc.log(this.node);
        // 定时器注册
        this.schedule(() => {
            if (this.bulletPool.size() < this.maxBullet) {
                this.createBullet();
            }
        }, this.bulletCD);
        this.schedule(() => {
            if (this.enemyPool.size() < this.maxEnemy) {
                // this.createEnemy();
            }
        }, this.enemyCD);
        this.scheduleOnce(function () {
            for (let i = 0; i < 10; i++) {
                if (this.enemyPool.size() < this.maxEnemy) {
                    this.createEnemy(1, cc.Vec2.UP);
                }
            }
        }, 2);

        // 物理系统启动
        this.physicsManager = cc.director.getPhysicsManager();
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = cc.v2();
        let Bits = cc.PhysicsManager.DrawBits;
        this.physicsManager.debugDrawFlags = Bits.e_aabbBit |
            Bits.e_pairBit |
            Bits.e_centerOfMassBit |
            Bits.e_jointBit |
            Bits.e_shapeBit;

        // 事件注册
        this.node.on('mergeEnemy', this.mergeEnemy, this);
        this.node.once('gameOver', this.gameOver, this);

    },

    onDestroy() {
        this.node.off('mergeEnemy', this.mergeEnemy, this);
        this.node.off('gameOver', this.gameOver, this);
    },

    createBullet() {
        if (!this.bulletPool.size()) {
            this.bulletPool.put(cc.instantiate(this.bulletPrefab));
        }
        return this.bulletPool.get(this, this.bulletPool);
    },

    createEnemy(level = 1, pos = null) {
        if (!this.enemyPool.size()) {
            this.enemyPool.put(cc.instantiate(this.enemyPrefab));
        }
        return this.enemyPool.get(this, this.enemyPool, level, pos);
    },

    mergeEnemy(a, b) {
        // cc.log(a.uuid + 'want to merge');
        if (!a || !b) {
            return;
        }
        let enemyA = a.getComponent('Enemy');
        let enemyB = b.getComponent('Enemy');
        cc.log('can merge');
        // cc.log(a);
        // cc.log(b);
        // let level = a.getComponent('Enemy').level + b.getComponent('Enemy').level;
        // level = level === 0 ? 1 : level;
        // this.enemyPool.put(a);
        if(a.getScale() < b.getScale()) {
            a.position = b.position;
        }
        a.setScale(a.getScale() + b.getScale());
        enemyA.level += enemyB.level;
        this.enemyPool.put(b);
        // this.createEnemy(level, pos);
    },

    gameOver() {
        cc.log('game over call')
        this.unscheduleAllCallbacks();
    },

});
