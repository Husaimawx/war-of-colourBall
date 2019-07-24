
cc.Class({
    extends: cc.Component,
    properties: {
        speed: 100,
        level: 1,
        maxLevel: 20,
        baseRadius: 8,
        invincibleTime: 2,
    },

    update(dt) {
        if (this.invincible) {
            return;
        }
        let targetNode = this.manager.target.node;
        let rigiBody = this.node.getComponent(cc.RigidBody);
        let distance = targetNode.position.sub(this.node.position);
        let direction = distance.clone().normalizeSelf();
        let realSpeed = this.speed;
        let shouldDamping = distance.mag() / (targetNode.height * 3);
        if (shouldDamping < 1) {
            realSpeed *= 0.7 * shouldDamping + 0.3;
        }
        rigiBody.linearVelocity = direction.mul(realSpeed);
    },

    onDestroy() {
        this.unscheduleAllCallbacks();
    },

    reuse(manager, level, invincible) {
        this.enabled = true;
        this.node.active = true;
        this.manager = manager;
        this.level = level;
        this.invincible = invincible;
        this.color = this.manager.randomColor();
        this.collider = this.node.getComponent(cc.PhysicsCircleCollider);
        this.graphics = this.node.addComponent(cc.Graphics);
        this.radius = this.baseRadius + this.level;

        if (invincible) {
            this.setInitAction();
        }
    },

    unuse() {
        this.enabled = false;
        this.node.active = false;
        this.node.stopAllActions();
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
