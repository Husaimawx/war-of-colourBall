
cc.Class({
    extends: cc.Component,
    properties: {
        background: cc.Node,
        dot: cc.Node,
        bgRaduis: 0,
    },

    onLoad() {
        this.bgRaduis = this.background.width * this.background.scaleX / 2;
        this.node.active = false;
        this.player = this.node.parent.getComponent('Game').player;

        //事件注册
        this.node.parent.on('touchstart', this.handleTouchStart, this);
        this.node.parent.on('touchmove', this.handleTouchMove, this);
        this.node.parent.on('touchend', this.handleTouchEnd, this);
        this.node.parent.once('gameOver', this.destroy, this);
    },

    onDestroy() {
        this.node.active = false;

        //事件反注册
        this.node.parent.off('touchstart', this.handleTouchStart, this);
        this.node.parent.off('touchmove', this.handleTouchMove, this);
        this.node.parent.off('touchend', this.handleTouchEnd, this);
        this.node.parent.off('gameOver', this.destroy, this);
    },

    touchAtCanvas(touchAtGlobal) {
        return new cc.Vec2(
            touchAtGlobal.x - this.node.parent.width / 2,
            touchAtGlobal.y - this.node.parent.height / 2
        )
    },

    handleTouchStart(eventTouch) {
        let touchAt = this.touchAtCanvas(eventTouch.getLocation());
        this.node.setPosition(touchAt); //受父亲node.parent的anchor影响，相对于屏幕中心
        this.dot.setPosition(0, 0);
        this.node.active = true;

        // 设置player方向
        // let playerPos = this.player.node.position;
        // let distance = touchAt.sub(playerPos);
        // if (!distance.equals(cc.Vec2.ZERO)) {
        //     cc.log(this.player.direction);
        //     this.player.direction = distance.normalizeSelf();
        //     cc.log(this.player.direction);
        // }
    },

    handleTouchMove(eventTouch) {
        let touchAt = this.touchAtCanvas(eventTouch.getLocation());
        let rockerAt = this.node.position; //rocker中心的位置，相对于node.parent's anchor 
        let distance = touchAt.sub(rockerAt);

        // 设置摇杆
        if (distance.mag() < this.bgRaduis) {
            this.dot.position = distance;
        } else {
            let dotPosition = new cc.Vec2(
                distance.x * (this.bgRaduis / distance.mag()),
                distance.y * (this.bgRaduis / distance.mag())
            );
            this.dot.position = dotPosition;
            this.dot.setPosition(dotPosition);
        }

        // 设置player方向
        if (!distance.equals(cc.Vec2.ZERO)) {
            this.player.direction = distance.normalizeSelf();
        }

        this.node.active = true;
        this.player.isMoving = true;
    },

    handleTouchEnd() {
        this.node.active = false;
        this.player.isMoving = false;
    },

});
