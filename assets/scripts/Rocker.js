
cc.Class({
    extends: cc.Component,

    properties: {
        background: cc.Node,
        // {
        // default: null,
        // type: cc.Node
        // },
        dot: cc.Node,
        // {
        // default: null,
        // type: cc.Node
        // },
        bgRaduis: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    init(player) {
        this.bgRaduis = this.background.width * this.background.scaleX / 2;
        this.node.active = false;
        this.player = player;

        // this.parentNode = cc.find('Canvas');
        this.parentNode = this.node.parent;
        this.parentNode.on('touchstart', this.handleTouchStart, this);
        this.parentNode.on('touchmove', this.handleTouchMove, this);
        this.parentNode.on('touchend', this.handleTouchEnd, this);
        this.parentNode.once('gameOver', this.destroy, this);
    },

    onDestroy() {
        this.node.active = false;
        this.parentNode.off('touchstart', this.handleTouchStart, this);
        this.parentNode.off('touchmove', this.handleTouchMove, this);
        this.parentNode.off('touchend', this.handleTouchEnd, this);
    },

    touchAtCanvas(touchAtGlobal) {
        //将世界坐标系转到parentNode坐标系
        return new cc.Vec2(
            touchAtGlobal.x - this.parentNode.width / 2,
            touchAtGlobal.y - this.parentNode.height / 2
        )
    },

    handleTouchStart(eventTouch) {
        //eventTouch.getLocation()相对于世界坐标系，相对于左下角
        let touchAt = this.touchAtCanvas(eventTouch.getLocation());
        this.node.setPosition(touchAt); //受父亲parentNode的anchor影响，相对于屏幕中心
        this.dot.setPosition(0, 0);
        this.node.active = true;
    },

    handleTouchMove(eventTouch) {
        let touchAt = this.touchAtCanvas(eventTouch.getLocation());
        let rockerAt = this.node.position; //rocker中心的位置，相对于parentNode's anchor 
        let distance = touchAt.sub(rockerAt);

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

        //传递方向给player
        this.player.isMoving = true;
        if (!distance.equals(cc.Vec2.ZERO)) {
            this.player.direction = distance.normalizeSelf();
        }
    },

    handleTouchEnd() {
        this.node.active = false;

        //设置方向
        this.player.isMoving = false;
    },

});
