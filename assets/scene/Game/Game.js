const Player = require('Player');
const Rocker = require('Rocker');
const Score = require('Score');
const BonusManager = require('BonusManager');
const EnemyManager = require('EnemyManager');

cc.Class({
    extends: cc.Component,
    properties: {
        rocker: Rocker,
        player: Player,
        score: Score,
        bonusManager: BonusManager,
        enemyManager: EnemyManager,
    },

    onLoad() {
        if (!cc.find('GameManager')) {
            cc.director.loadScene('login');
            return;
        }
        this.gm = cc.find('GameManager').getComponent('GameManager');
        this.pluginInit([
            this.player,
            this.enemyManager,
            this.bonusManager,
            this.score,
            this.rocker,
        ])

        // 物理系统启动
        let pm = cc.director.getPhysicsManager();
        pm.enabled = true;
        pm.gravity = cc.v2();
        pm.enabledAccumulator = true;
        pm.FIXED_TIME_STEP = 1 / 30;
        pm.VELOCITY_ITERATIONS = 8;
        pm.POSITION_ITERATIONS = 8;

        // 启动背景音乐
        if (!cc.audioEngine.isMusicPlaying()) {
            this.gm.bgmID = cc.audioEngine.playMusic(this.gm.bgm.clip, true);
        }
    },

    pluginInit(plugins) {
        for (let plugin of plugins) {
            plugin.init();
        }
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
        return pos;
    },

    gameOver() {
        this.gm.dispatch({
            type: 'GAME_OVER',
            score: this.score.scoreNow
        })
    },

});
