
const Player = require('Player');
const Rocker = require('Rocker');
const Score = require('Score');
const BonusManager = require('BonusManager');
// const BulletManager = require('BulletManager');
const EnemyManager = require('EnemyManager');

cc.Class({
    extends: cc.Component,
    properties: {
        rocker: Rocker,
        player: Player,
        score: Score,
        bonusManager: BonusManager,
        // bulletManager: BulletManager,
        enemyManager: EnemyManager,

        maxBullet: 50,
        maxEnemy: 50,
        maxTool: 10,
        // bulletCD: 1,
        enemyCD: 4,
        toolCD: 5,
    },

    onLoad() {
        if (!cc.find('GameManager')) {
            cc.director.loadScene('login');
            return;
        }
        this.gameManager = cc.find('GameManager').getComponent('GameManager');

        this.player.init();
        this.score.init();
        this.rocker.init();
        this.bonusManager.init();
        this.enemyManager.init();

        this.schedule(() => {
            if (this.enemyManager.enemyNumb < this.maxEnemy) {
                this.enemyManager.dispatch({
                    type: 'CREATE_ENEMY'
                });
            }
        }, this.enemyCD);
        this.schedule(() => {
            if (this.bonusManager.toolNumb < this.maxTool) {
                this.bonusManager.dispatch({
                    type: 'BOOM_TOOL'
                });
            }
        }, this.toolCD);

        // 物理系统启动
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = cc.v2();
        let Bits = cc.PhysicsManager.DrawBits;

    },

    dispatch(action) {
        switch (action.type) {
            case 'GAME_OVER':
                this.gameOver();
                break;
            default: break;
        }
    },

    randomPos() {
        let top = cc.find('Canvas/Border/Top').y;
        let bottom = cc.find('Canvas/Border/Bottom').y;
        let left = cc.find('Canvas/Border/Left').x;
        let right = cc.find('Canvas/Border/Right').x;
        let pos = cc.v2(
            left + (right - left) * Math.random(),
            bottom + (top - bottom) * Math.random()
        )
        // let playerNode = this.player.node;
        // if (avoidPlayer && pos.sub(playerNode.position).mag() < playerNode.height * 2) {
        //     return this.randomPos();
        // }
        return pos;
    },

    gameOver() {
        this.gameManager.dispatch({
            type: 'GAME_OVER',
            score: this.score.scoreNow
        })
    },

});
