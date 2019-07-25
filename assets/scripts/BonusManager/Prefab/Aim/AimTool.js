
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
    },

    unuse() {
        this.enabled = false;
        this.node.stopAllActions();
    },

    onBeginContact(contact, selfCollider, otherCollider) {
        switch (otherCollider.node.group) {
            case 'Player':
                this.manager.dispatch({
                    type: 'RECYCLE/AIM_TOOL',
                    node: selfCollider.node
                })
                this.manager.dispatch({
                    type: 'FIRE/AIM',
                })
                break;
            default: break;
        }
    },

});
