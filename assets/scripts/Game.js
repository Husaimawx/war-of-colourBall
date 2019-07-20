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
const Bullet = require('Bullet');
const Enemy = require('Enemy');

cc.Class({
    extends: cc.Component,

    properties: {
        rocker: Rocker,
        player: Player,
        bulletPrefab: cc.Prefab,
        enemyPrefab: cc.Prefab,
        
        maxBullet: 0,
        maxEnemy: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.player.init();
        this.rocker.init(this.player);
        this.bulletPool = new cc.NodePool();
        for (let i = 0; i < this.maxBullet; i++) {
            let bullet = cc.instantiate(this.bulletPrefab);
            this.bulletPool.put(bullet);
        }
        this.enemyPool = new cc.NodePool();
        for (let i = 0; i < this.maxBullet; i++) {
            let enemy = cc.instantiate(this.enemyPrefab);
            this.enemyPool.put(enemy);
        }

        cc.director.setScheduler()

        this.collisionManager = cc.director.getCollisionManager();
        this.collisionManager.enabled = true;
        this.collisionManager.enabledDebugDraw = true;
    },

    posCheck(node) {
        if (node.x < - this.node.width / 2) {
            // cc.log('meet at left');
            node.x = - this.node.width / 2;
        }
        if (node.x > this.node.width / 2) {
            // cc.log('meet at right');
            node.x = this.node.width / 2;
        }
        if (node.y < - this.node.height / 2) {
            // cc.log('meet at bottom');
            node.y = - this.node.height / 2;
        }
        if (node.y > this.node.height / 2) {
            // cc.log('meet at top');
            node.y = this.node.height / 2;
        }
    },

    onCollisionExit(other, self) {
        switch (other.node.group) {
            case 'Bullet':
                // cc.log('collision bullet');
                this.killBullet(other.node);
        }
    },

    createBullet() {
        let bullet = this.bulletPool.get();
        if (!bullet) {
            cc.log('no avaliable bullet. new one.')
            bullet = cc.instantiate(this.bulletPrefab);
        }
        // cc.log(bullet.getComponent('Bullet').direction);
        bullet.getComponent('Bullet').init(this);
        // cc.log(bullet.getComponent('Bullet').direction);
    },

    killBullet(node) {
        // cc.log('killbullet')
        cc.log("Running Action Count: " + node.getNumberOfRunningActions());
        node.stopAllActions();
        this.bulletPool.put(node);
    },

    createEnemy() {
        let enemy = this.enemyPool.get();
        if (!enemy) {
            enemy = cc.instantiate(this.enemyPrefab);
        }
        enemy.getComponent('Enemy').init(this);
    },

    killEnemy(node) {
        // cc.log('killenemy')
        cc.log("Running Action Count: " + node.getNumberOfRunningActions());
        node.stopAllActions();
        this.enemyNode.put(node);
    },



});
