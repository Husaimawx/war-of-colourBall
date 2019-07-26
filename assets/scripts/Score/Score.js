cc.Class({
    extends: cc.Component,
    properties: {
        text1: cc.Label,
        text2: cc.Label,
        tip: cc.Node,
        scoreNow: 0,
        oldScore: 0,
    },

    init() {
        this.canvas = cc.find('Canvas');
        this.game = this.canvas.getComponent('Game');
        this.text1.string = `Score: `;
        this.text2.string = `           ${this.scoreNow}`;
        this.tip.runAction(cc.hide());
    },

    update(dt) {
        if (this.oldScore === this.scoreNow) {
            return;
        }
        this.node.stopAllActions();
        this.text2.string = `           ${this.scoreNow}`;
        this.oldScore = this.scoreNow;
    },

    dispatch(action) {
        switch (action.type) {
            case 'ADD':
                this.addScore(action.score);
                break;
            case 'TIP':
                this.showTip();
        }
    },

    addScore(score = 1) {
        if ((this.scoreNow + score) / 5 % 1 === 0) {
            this.text2.node.runAction(cc.sequence(
                cc.scaleTo(0.15, 1.25),
                cc.scaleTo(0.35, 1)
            ));
        }
        if (Math.floor(this.scoreNow / 5) < Math.floor((this.scoreNow + score) / 5)) {
            let em = this.game.enemyManager;
            this.dispatch({
                type: 'TIP'
            });
            em.dispatch({
                type: 'CHANGE_CD',
                enemyCD: em.enemyCD * 0.9
            })
            em.dispatch({
                type: 'CHANGE_SPEED',
                enemySpeed: em.enemySpeed * 1.1
            })
        }
        this.scoreNow += score;
    },

    showTip() {
        let action = cc.sequence(
            cc.show(),
            cc.fadeIn(2),
            cc.hide()
        )
        this.tip.runAction(action);
    },
});

