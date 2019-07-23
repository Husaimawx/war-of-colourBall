
cc.Class({
    extends: cc.Component,
    properties: {
        scoreDisplay: cc.Label,
    },

    onLoad() {
        this.gameManager = cc.find('GameManager').getComponent('GameManager');
        if (!this.gameManager) {
            cc.director.loadScene('login');
        }
        let score = this.gameManager.finalScore;
        this.scoreDisplay.string = `Score: ${score}`;
    },

    clicked() {
        this.gameManager.dispatch({
            type: 'GAME_START'
        })
    },
    
});
