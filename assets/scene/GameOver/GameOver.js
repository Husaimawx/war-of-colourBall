cc.Class({
    extends: cc.Component,
    properties: {
        scoreDisplay: cc.Label,
        gameOverAudio: {
            type: cc.AudioClip,
            default: null,
        },
    },

    onLoad() {
        if (!cc.find('GameManager')) {
            cc.director.loadScene('login');
            return;
        }
        this.gm = cc.find('GameManager').getComponent('GameManager');
        let score = this.gm.finalScore;
        this.scoreDisplay.string = `最终得分: ${score}`;

        cc.audioEngine.stopMusic();
        cc.audioEngine.playEffect(this.gameOverAudio);
    },

    clicked() {
        this.gm.dispatch({
            type: 'GAME_START'
        })
    },

});
