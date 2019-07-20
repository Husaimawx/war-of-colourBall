// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const Player = require('Player');
const Rocker = require('Rocker');
const Score = require('Score');
// const Bullet = require('Bullet');
// const Enemy = require('Enemy');

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

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.player.init();
        this.rocker.init(this.player);
        this.bulletPool = new cc.NodePool('Bullet');
        this.enemyPool = new cc.NodePool('Enemy');

        this.schedule(() => {
            if (this.bulletPool.size() < this.maxBullet) {
                this.createBullet();
            }
        }, this.bulletCD);

        this.schedule(() => {
            if (this.enemyPool.size() < this.maxEnemy) {
                this.createEnemy();
            }
        }, this.enemyCD);

        this.physicsManager = cc.director.getPhysicsManager();
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = cc.v2();
        let Bits = cc.PhysicsManager.DrawBits;
        this.physicsManager.debugDrawFlags = Bits.e_aabbBit |
            Bits.e_pairBit |
            Bits.e_centerOfMassBit |
            Bits.e_jointBit |
            Bits.e_shapeBit;

        this.node.once('gameOver', this.gameOver, this);


        // cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true;
    },

    // update(dt) {
    //     this.bulletDT += dt;
    //     this.enemyDT += dt;
    //     if (this.enemyDT > this.enemyCD) {
    //         // cc.log(this.enemyDT);
    //         this.createEnemy();
    //         this.enemyDT = 0;
    //     }
    //     if (this.bulletDT > this.bulletCD) {
    //         this.createBullet();
    //         this.bulletDT = 0;
    //     }
    // },

    // onCollisionExit(other, self) {
    //     switch (other.node.group) {
    //         case 'Bullet':
    //             // cc.log('collision bullet');
    //             this.bulletPool.put(node);
    //             // this.killBullet(other.node);
    //     }
    // },

    // reuse() {
    //     cc.log('bullet or enemy on get call reuse');
    //     this.node.on('gameOver', this.gameOver, this)
    // },

    // unuse() {
    //     cc.log('bullet or enemy on put call unuse');
    //     this.node.off('gameOver', () => {
    //         this.node.stopAllActions();
    //         this.enabled = false;
    //     }, this)
    // },

    createBullet() {
        cc.log('createBullet');
        if (!this.bulletPool.size()) {
            // cc.log('no avaliable bullet. new one.')
            this.bulletPool.put(cc.instantiate(this.bulletPrefab));
        }
        return this.bulletPool.get(this, this.bulletPool);
        // bulletNode.getComponent('Bullet').init(this, this.bulletPool);
        // return bulletNode;
    },

    createEnemy() {
        cc.log('createEnemy');
        if (!this.enemyPool.size()) {
            this.enemyPool.put(cc.instantiate(this.enemyPrefab));
        }
        return this.enemyPool.get(this, this.enemyPool);
        // return bulletNode;
        // let enemy = this.enemyPool.get();
        // if (!enemy) {
        //     enemy = cc.instantiate(this.enemyPrefab);
        // }
        // // cc.log('create enemy');
        // // cc.log(enemy);
        // enemy.getComponent('Enemy').init(this);
    },

    gameOver() {
        cc.log('game over call')
        this.unscheduleAllCallbacks();
    },

});
