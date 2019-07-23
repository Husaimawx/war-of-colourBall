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
        if (this.isMoving) {
            this.node.position = new cc.Vec2(
                this.speed * dt * this.direction.x,
                this.speed * dt * this.direction.y
            ).add(this.node.position);
        }
    },

    onBeginContact(contact, selfCollider, otherCollider) {
        cc.log(selfCollider.node);
        cc.log(otherCollider.node);
        switch (otherCollider.node.group) {
            case 'Enemy':
                this.game.dispatch({
                    type: 'GAME_OVER'
                })
                break;
            case 'Tool':
                if (otherCollider.node.name === 'BoomTool') {
                    this.game.bonusManager.dispatch({
                        type: 'BOOM',
                    })
                }
                break;
            default: break;
        }
    },

});
