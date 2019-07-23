
cc.Class({
    extends: cc.Component,
    properties: {
        finalScore: 0,
    },

    onLoad() {
        cc.game.addPersistRootNode(this.node);
    },

    dispatch(action) {
        switch (action.type) {
            case 'LOG_IN':
                this.login();
                break;
            case 'GAME_START':
                this.game();
                break;
            case 'GAME_OVER':
                this.gameOver(action.score);
                break;
            default: cc.error('UNCLEAR ACTION: ' + aciton.type)
        }
    },

    login() {
        cc.director.loadScene('login');
        cc.director.preloadScene("game");
    },

    game() {
        cc.director.loadScene('game');
        cc.director.preloadScene("gameOver");
    },

    gameOver(score) {
        this.finalScore = score;
        cc.director.loadScene('gameOver');
        cc.director.preloadScene("game");
    },

});
