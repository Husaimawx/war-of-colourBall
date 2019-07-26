cc.Class({
    extends: cc.Component,
    properties: {
        inTime: 1,
        speed: 400,
        fire: false,
        direction: new cc.Vec2(),
    },

    update(dt) {
        if (!this.fire) {
            this.node.position = this.direction.mul(40).add(
                this.manager.game.player.node.position
            )
        }
    },

    reuse(manager, parent, direction) {
        this.enabled = true;
        this.manager = manager;
        this.node.parent = parent;
        this.node.position = cc.v2(2000, 2000);
        this.direction = direction;
        this.fire = false;
        this.rigiBody = this.node.getComponent(cc.RigidBody);
        this.node.rotation = direction.signAngle(cc.Vec2.RIGHT) / Math.PI * 180 + 90;
        
        this.scheduleOnce(() => {
            this.fire = true;
            let d = this.direction.normalize();
            this.rigiBody.linearVelocity = d.mul(this.speed);
        }, this.inTime)
        this.scheduleOnce(() => {
            this.manager.dispatch({
                type: 'RECYCLE/ARROW',
                node: this.node
            })
        }, 4)
    },

    unuse() {
        this.enabled = false;
        this.node.stopAllActions();
        this.unscheduleAllCallbacks();
        this.fire = false;
    },

    onBeginContact(contact, selfCollider, otherCollider) {
        switch (otherCollider.node.group) {
            case 'Border':
                this.manager.dispatch({
                    type: 'RECYCLE/ARROW',
                    node: selfCollider.node
                })
                break;
        }
    },
});
