
cc.Class({
    extends: cc.Component,
    properties: {
        background: cc.Node,
        dot: cc.Node,
    },

    init() {
        this.canvas = cc.find('Canvas');
        this.game = this.canvas.getComponent('Game');
        this.player = this.game.player;

        this.node.parent = this.canvas;
        this.node.active = false;
        this.bgRaduis = this.background.width * this.background.scaleX / 2;

        //事件注册
        this.canvas.on('touchstart', this.handleTouchStart, this);
        this.canvas.on('touchmove', this.handleTouchMove, this);
        this.canvas.on('touchend', this.handleTouchEnd, this);
    },

    touchAtCanvas(touchAtGlobal) {
        return new cc.Vec2(
            touchAtGlobal.x - this.node.parent.width / 2,
            touchAtGlobal.y - this.node.parent.height / 2
        );
    },

    handleTouchStart(eventTouch) {
        let touchAt = this.touchAtCanvas(eventTouch.getLocation());
        this.node.setPosition(touchAt); //受父亲node.parent的anchor影响，相对于屏幕中心
        this.dot.setPosition(0, 0);
        this.node.active = true;
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
            this.player.dispatch({
                type: 'SET_DIRECTION',
                direction: distance.normalizeSelf()
            });
        }

        this.node.active = true;
        this.player.dispatch({
            type: 'SET_IS_MOVING',
            isMoving: true
        });
    },

    handleTouchEnd() {
        this.node.active = false;
        this.player.dispatch({
            type: 'SET_IS_MOVING',
            isMoving: false
        });
    },

});
