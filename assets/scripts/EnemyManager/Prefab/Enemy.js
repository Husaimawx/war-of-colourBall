
cc.Class({
    extends: cc.Component,
    properties: {
        speed: 80,
        level: 1,
        maxLevel: 20,
        baseRadius: 8,
        invincibleTime: 2,
    },

    update(dt) {
        if (this.invincible) {
            this.rigiBody.linearVelocity = cc.Vec2.ZERO;
            return;
        }
        let targetNode = this.manager.target.node;
        let distance = targetNode.position.sub(this.node.position);
        let direction = distance.normalize();
        let realSpeed = this.speed;
        let shouldDamping = distance.mag() / (targetNode.height * 4);
        if (shouldDamping < 1) {
            realSpeed *= 0.8 * shouldDamping + 0.2;
        }
        this.rigiBody.linearVelocity = direction.mul(realSpeed);
    },

    reuse(manager, level, invincible) {
        this.collider = this.node.getComponent(cc.PhysicsCircleCollider);
        this.graphics = this.node.addComponent(cc.Graphics);
        this.rigiBody = this.node.getComponent(cc.RigidBody);
        this.enabled = true;
        this.node.active = true;
        this.manager = manager;
        this.level = level;
        this.invincible = invincible;
        this.rigiBody.linearVelocity = cc.Vec2.ZERO;
        this.color = this.manager.randomColor();
        this.radius = this.baseRadius + this.level;

        if (invincible) {
            this.setInitAction();
        }
    },

    unuse() {
        this.enabled = false;
        this.node.active = false;
        this.node.stopAllActions();
        this.unscheduleAllCallbacks();
    },

    setInitAction() {
        this.invincible = true;
        this.collider.enabled = false;
        let sprite = this.node.addComponent(cc.Sprite);
        sprite.spriteFrame = this.manager.enemyInvincible;

        this.scheduleOnce(() => {
            this.invincible = false;
            this.collider.enabled = true;
            this.collider.radius = this.radius;
            this.collider.apply();

            this.node.removeComponent(cc.Sprite);
            this.graphics = this.node.addComponent(cc.Graphics);
            this.graphics.circle(0, 0, this.radius);
            this.graphics.fillColor = this.color;
            this.graphics.fill();
        }, this.invincibleTime)
    },

    onBeginContact(contact, selfCollider, otherCollider) {
        switch (otherCollider.node.group) {
            case 'Bonus':
            case 'BonusHasContact':
                this.manager.dispatch({
                    type: 'KILL_ENEMY',
                    node: selfCollider.node
                });
                break;
            // case 'Enemy':
            //     if (selfCollider.node.getComponent('Enemy').level > this.maxLevel ||
            //         otherCollider.node.getComponent('Enemy').level > this.maxLevel) {
            //         return;
            //     }
            //     this.manager.dispatch({
            //         type: 'MERGE_ENEMY',
            //         node1: selfCollider.node,
            //         node2: otherCollider.node,
            //     });
            //     break;
            default: break;
        }
    },

});
