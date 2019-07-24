
cc.Class({
    extends: cc.Component,

    properties: {
        inTime: 1.5,
    },

    reuse(manager) {
        this.enabled = true;
        this.manager = manager;
        this.collider = this.node.getComponent(cc.PhysicsCircleCollider);
        this.collider.enabled = false;
        let action = cc.sequence(
            cc.place(cc.v2(-100, -100)),
            cc.moveTo(this.inTime, cc.Vec2.ZERO).easing(cc.easeCubicActionOut())
        )
        this.node.runAction(action);
        this.scheduleOnce(() => {
            this.manager.dispatch({
                type: 'RECYCLE/AIM',
                node: this.node
            });
        }, this.inTime)
    },

    unuse() {
        this.enabled = false;
        this.node.stopAllActions();
        this.unscheduleAllCallbacks();
    },

    onBeginContact(contact, selfCollider, otherCollider) {
        switch (otherCollider.node.group) {
            case 'Enemy':
                this.manager.game.score.dispatch({
                    type: 'ADD',
                    score: otherCollider.node.getComponent('Enemy').level
                })
                break;
        }
    },

});
