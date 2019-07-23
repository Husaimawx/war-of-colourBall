
cc.Class({
    extends: cc.Component,

    reuse() {
        this.node.active = true;
    },

    unuse() {
        this.node.active = false;
        this.node.removeFromParent();
    },
});
