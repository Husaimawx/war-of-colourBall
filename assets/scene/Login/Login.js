cc.Class({
    extends: cc.Component,
    properties: {
        title1: cc.Node,
        title2: cc.Node,
        title3: cc.Node,
        title4: cc.Node,
        finger: cc.Node,
    },

    onLoad() {
        this.canvas = cc.find('Canvas');
        this.gm = cc.find('GameManager').getComponent('GameManager');
        this.canvas.on('touchstart', this.handleTouchStart, this);
        this.canvas.on('touchmove', this.handleTouchMove, this);
        this.startAt = cc.v2();
        let titles = [this.title1, this.title2, this.title3, this.title4];
        let i = 0;
        this.schedule(() => {
            let titleAction = cc.sequence(
                cc.moveBy(0.25, cc.v2(0, 80)).easing(cc.easeCubicActionIn()),
                cc.moveBy(0.25, cc.v2(0, -80)).easing(cc.easeCubicActionOut())
            )
            titles[i].runAction(titleAction);
            i++;
        }, 0.2, 3, 0.2);
        let fingerAction = cc.repeatForever(cc.sequence(
            cc.place(200, -360),
            cc.moveBy(1, cc.v2(0, 80)).easing(cc.easeCubicActionOut())
        ))
        this.finger.runAction(fingerAction);

        // 启动背景音乐
        if (!cc.audioEngine.isMusicPlaying()) {
            this.gm.bgmID = cc.audioEngine.playMusic(this.gm.bgm.clip, true);
        }

        cc.director.preloadScene("game");
    },

    touchAtCanvas(touchAtGlobal) {
        return new cc.Vec2(
            touchAtGlobal.x - this.node.parent.width / 2,
            touchAtGlobal.y - this.node.parent.height / 2
        );
    },

    handleTouchStart(eventTouch) {
        this.startAt = this.touchAtCanvas(eventTouch.getLocation());
    },

    handleTouchMove(eventTouch) {
        let touchAt = this.touchAtCanvas(eventTouch.getLocation());
        if (touchAt.y - this.startAt.y > 50) {
            this.gm.dispatch({
                type: 'GAME_START'
            })
        }
    },

    clicked() {
        this.gm.dispatch({
            type: 'GAME_START'
        })
    },
});
