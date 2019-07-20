
let Player = cc.Class({
    extends: cc.Component,
    properties: {
        isMoving: false,
        speed: 0,
        maxBullet: 0,
        fireCD: 0,
        direction: cc.Vec2,
    },

    onLoad() {
        this.game = this.node.parent.getComponent('Game');
        this.direction = cc.Vec2.UP;
        this.fireDT = 0;

        // 事件注册
        this.node.parent.once('gameOver', this.gameOver, this);
    },

    update(dt) {
        // 转头
        this.node.rotation = this.direction.signAngle(cc.Vec2.RIGHT) / Math.PI * 180 + 90;

        // 移动
        if (this.isMoving) {
            let moveVec = new cc.Vec2(
                this.speed * dt * this.direction.x,
                this.speed * dt * this.direction.y
            )
            this.node.position = moveVec.add(this.node.position);
        }
    },

    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.group === 'Enemy') {
            this.game.node.emit('gameOver');
        }
    },

    gameOver() {
        this.enabled = false;
        this.node.stopAllActions();
    },

});
