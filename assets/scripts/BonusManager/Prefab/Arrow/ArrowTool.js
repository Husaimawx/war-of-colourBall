
cc.Class({
    extends: cc.Component,

    reuse(manager) {
        this.enabled = true;
        this.manager = manager;
        this.rigiBody = this.node.getComponent(cc.RigidBody);
        let direction = cc.v2(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
        ).normalizeSelf();
        this.rigiBody.linearVelocity = direction.mul(manager.toolSpeed);
        this.rigiBody.angularVelocity = manager.toolAngleSpeed;
        this.scheduleOnce(() => {
            this.node.runAction(cc.fadeTo(10, 127));
            this.scheduleOnce(() => {
                // manager.arrowToolPool.put(this.node);
                manager.dispatch({
                    type: 'RECYCLE/ARROW_TOOL',
                    node: this.node
                })
            }, 10)
        }, 15)
    },

    unuse() {
        this.enabled = false;
        this.node.stopAllActions();
        this.unscheduleAllCallbacks();
    },

    onBeginContact(contact, selfCollider, otherCollider) {
        switch (otherCollider.node.group) {
            case 'Player':
                this.manager.dispatch({
                    type: 'RECYCLE/ARROW_TOOL',
                    node: selfCollider.node
                })
                this.manager.dispatch({
                    type: 'FIRE/ARROW',
                })
                break;
            default: break;
        }
    },

});
