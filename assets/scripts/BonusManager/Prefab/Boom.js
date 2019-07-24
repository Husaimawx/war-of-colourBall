
cc.Class({
    extends: cc.Component,
    properties: {
        inTime: 0.15,
        outTime: 0.75,
    },

    update(dt) {
        this.node.position = cc.Vec2.ZERO;
    },

    reuse(manager, parent) {
        this.enabled = true;
        this.manager = manager;
        this.node.parent = parent;
        let fadein = cc.fadeIn(this.inTime);
        let fadeout = cc.fadeOut(this.outTime);
        let action = cc.sequence(fadein, fadeout);
        this.node.runAction(action);
        this.scheduleOnce(() => {
            this.manager.dispatch({
                type: 'RECYCLE/BOOM',
                node: this.node
            });
        }, this.inTime + this.outTime)
    },

    unuse() {
        this.enabled = false;
        this.node.stopAllActions();
        this.unscheduleAllCallbacks();
    },

});
