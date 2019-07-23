
cc.Class({
    extends: cc.Component,
    properties: {

    },

    onLoad() {
        this.gameManager = cc.find('GameManager').getComponent('GameManager');
    },

    clicked() {
        this.gameManager.dispatch({
            type: 'GAME_START'
        })
    },
});
