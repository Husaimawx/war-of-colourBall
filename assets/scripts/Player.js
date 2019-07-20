// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

let Player = cc.Class({
    extends: cc.Component,

    properties: {
        isMoving: false,
        speed: 0,
        // direction: new cc.Vec2(),
        // prePos: new cc.Vec2(),

        // accel: 0,
        // maxAccel: 0,

        maxBullet: 0,
        fireCD: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    init() {
        this.game = this.node.parent.getComponent('Game');
        this.direction = cc.Vec2.UP;
        this.prePos = this.node.position;

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
        this.prePos = this.node.position.clone();
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

        //fire
        // this.fireDT += dt;
        // if (this.fireDT >= this.fireCD) {
        //     // cc.log(this.fireDT);
        //     this.game.createBullet();
        //     this.fireDT = 0;
        // }

        // this.game.posCheck(this.node);
    },

    onBeginContact(contact, selfCollider, otherCollider) {
        cc.log('contact player');
        cc.log(selfCollider);
        cc.log(otherCollider);
        // if (otherCollider.node.group === 'Border') {
        if (otherCollider.node.group === 'Enemy') {
            this.game.node.emit('gameOver');
            // this.game.gameOver();
        }
    },

});
