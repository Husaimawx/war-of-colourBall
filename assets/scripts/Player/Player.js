let Player = cc.Class({
    extends: cc.Component,
    properties: {
        isMoving: false,
        speed: 0,
        direction: new cc.Vec2(),
    },

    init() {
        this.canvas = cc.find('Canvas');
        this.game = this.canvas.getComponent('Game');
        this.direction = cc.Vec2.UP;
        this.node.position = cc.v2(0, -1000);
        let action =  cc.moveTo(0.6, cc.v2(0, -150));
        this.node.runAction(action);
    },

    dispatch(action) {
        switch (action.type) {
            case 'SET_DIRECTION':
                this.direction = action.direction;
                break;
            case 'SET_IS_MOVING':
                this.isMoving = action.isMoving;
                break;
            default: break;
        }
    },

    update(dt) {
        // 转头和移动
        this.node.rotation = this.direction.signAngle(cc.Vec2.RIGHT) / Math.PI * 180 + 90;
        let rigiBody = this.node.getComponent(cc.RigidBody);
        if (this.isMoving) {
            rigiBody.linearVelocity = this.direction.mul(this.speed);
        } else {
            rigiBody.linearVelocity = cc.Vec2.ZERO;
        }
    },

    onBeginContact(contact, selfCollider, otherCollider) {
        switch (otherCollider.node.group) {
            case 'Enemy':
                this.game.dispatch({
                    type: 'GAME_OVER'
                })
                break;
            default: break;
        }
    },

});
