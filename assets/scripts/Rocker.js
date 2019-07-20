// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

//anchor表示的是自己和children的position相对的一个参照位置。
//相当于设置了一个Pic的质点。

let Rocker = cc.Class({
    extends: cc.Component,

    properties: {
        background: {
            default: null,
            type: cc.Node
        },
        dot: {
            default: null,
            type: cc.Node
        },
        bgRaduis: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    init(player) {
        this.bgRaduis = this.background.width * this.background.scaleX / 2;
        this.node.active = false;
        this.player = player;

        // this.canvas = cc.find('Canvas');
        this.canvas = this.node.parent;
        this.canvas.on('touchstart', this.handleTouchStart, this);
        this.canvas.on('touchmove', this.handleTouchMove, this);
        this.canvas.on('touchend', this.handleTouchEnd, this);

    },

    onDestroy() {
        this.canvas.off('touchstart', this.handleTouchStart, this);
        this.canvas.off('touchmove', this.handleTouchMove, this);
        this.canvas.off('touchend', this.handleTouchEnd, this);
    },

    touchAtCanvas(touchAtGlobal) {
        //将世界坐标系转到canvas坐标系
        return new cc.Vec2(
            touchAtGlobal.x - this.canvas.width / 2,
            touchAtGlobal.y - this.canvas.height / 2
        )
    },

    handleTouchStart(eventTouch) {
        //eventTouch.getLocation()相对于世界坐标系，相对于左下角
        let touchAt = this.touchAtCanvas(eventTouch.getLocation());
        this.node.setPosition(touchAt); //受父亲canvas的anchor影响，相对于屏幕中心
        this.dot.setPosition(0, 0);
        this.node.active = true;

        //设置方向备Player用
        // this.player.direction = cc.Vec2.ZERO;
    },

    handleTouchMove(eventTouch) {
        let touchAt = this.touchAtCanvas(eventTouch.getLocation());
        let rockerAt = this.node.position; //rocker中心的位置，相对于canvas's anchor 
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

        //设置方向
        this.player.isMoving = true;
        if (!distance.equals(cc.Vec2.ZERO)) {
            this.player.direction = distance.normalizeSelf();
            // cc.log('rocker player direciton')
            // cc.log(this.player.direction);
        }
    },

    handleTouchEnd() {
        this.node.active = false;

        //设置方向
        this.player.isMoving = false;
        // this.player.direction = cc.Vec2.ZERO;
    },

});
