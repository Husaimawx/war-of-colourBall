
cc.Class({
    extends: cc.Component,

    reuse(manager) {
        this.enabled = true;
        this.manager = manager;
        this.rigiBody = this.node.getComponent(cc.RigidBody);
        this.direction = cc.v2(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
        ).normalizeSelf().mul(manager.toolSpeed);
        this.rigiBody.linearVelocity = this.direction;
        this.rigiBody.angularVelocity = this.manager.toolAngleSpeed;
    },

    unuse() {
        this.enabled = false;
        this.node.stopAllActions();
    },

    onBeginContact(contact, selfCollider, otherCollider) {
        switch (otherCollider.node.group) {
            case 'Player':
                this.manager.dispatch({
                    type: 'RECYCLE_BOOM_TOOL',
                    node: selfCollider.node
                })
                break;
            default: break;
        }
    },

});
