
let Player = cc.Class({
    extends: cc.Component,

    properties: {
        isMoving: false,
        speed: 0,

        maxBullet: 0,
        fireCD: 0,

        direction: cc.Vec2,
    },

    // LIFE-CYCLE CALLBACKS:

    init() {
        this.game = this.node.parent.getComponent('Game');
        this.direction = cc.Vec2.UP;
        
        // cc.log('palyer direction');
        // cc.log(this.direction);

        //bullet
        this.fireDT = 0;

        this.node.parent.once('gameOver', () => {
            cc.log('player on gameOver call');
            this.enabled = false;
            this.node.stopAllActions();
        }, this);
    },

    onDestroy() {
        // this.node.parent.off('gameOver');
    },

    update(dt) {
        if (this.isMoving) {
            //rotate
            // cc.log(this.direction);
            let rotate = this.direction.signAngle(cc.Vec2.RIGHT) / Math.PI * 180 + 90;
            this.node.rotation = rotate;
            //move
            let moveVec = new cc.Vec2(
                this.speed * dt * this.direction.x,
                this.speed * dt * this.direction.y
            )
            this.node.position = moveVec.add(this.node.position);
        }

        // fire

        // this.game.posCheck(this.node);
    },

    onBeginContact(contact, selfCollider, otherCollider) {
        // cc.log('contact player');
        // cc.log(selfCollider);
        // cc.log(otherCollider);
        // if (otherCollider.node.group === 'Border') {
        if (otherCollider.node.group === 'Enemy') {
            this.game.node.emit('gameOver');
            // this.game.gameOver();
        }
    },

});
