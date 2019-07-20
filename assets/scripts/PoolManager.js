// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    onLoad: function () {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onSelect, this.node);
    },

    // init(parentNode) {
        // this.node.parent = parentNode;
        // this.node.parent.on('gameOver', this.gameOver, this.node);
    // },
    // reuse() {
    //     cc.log('bullet on get call reuse');
    //     this.node.parent.on('gameOver', () => {
    //         this.node.stopAllActions();
    //         this.enabled = false;
    //     }, this)
    // },
    reuse(bulletPool, parentNode) {
        this.bulletPool = bulletPool;
        this.node.parent = parentNode;
        this.node.parent.on('gameOver', this.gameOver, this.node);
    },

    unuse() {
        this.node.parent.off('gameOver', this.gameOver, this.node);
    },

    gameOver() {
        cc.log('gameOver');
        this.enabled = false;
        this.node.stopAllActions();
    },
});