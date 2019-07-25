
cc.Class({
    extends: cc.Component,

    properties: {
        text1: cc.Label,
        text2: cc.Label,
        scoreNow: 0,
        oldScore: 0,
    },

    init() {
        this.canvas = cc.find('Canvas');
        this.game = this.canvas.getComponent('Game');
        this.text1.string = `Score: `;
        this.text2.string = `           ${this.scoreNow}`;
        this.action = cc.sequence(
            cc.scaleTo(0.15, 1.25),
            cc.scaleTo(0.35, 1)
        );
    },

    update(dt) {
        if (this.oldScore === this.scoreNow) {
            return;
        }
        this.node.stopAllActions();

        this.text2.string = `           ${this.scoreNow}`;
        // if (this.scoreNow - this.oldScore > 10) {
        //     this.text2.node.runAction(this.action);
        // }
        this.oldScore = this.scoreNow;
    },

    dispatch(action) {
        switch (action.type) {
            case 'ADD':
                this.addScore(action.score);
                break;
            case 'BONUS_TIP':
                this.bonusTip();
        }
    },

    addScore(score = 1) {
        if ((this.scoreNow + score) / 5 % 1 === 0) {
            this.text2.node.runAction(this.action);
        }
        if (Math.floor(this.scoreNow / 5) < Math.floor((this.scoreNow + score) / 5)) {
            this.game.bonusManager.dispatch({
                type: 'FIRE/RANDOM_TOOL'
            });
            this.dispatch({
                type: 'BONUS_TIP'
            });
            let cd = this.game.enemyManager.enemyCD;
            this.game.enemyManager.dispatch({
                type: 'CHANGE_CD',
                enemyCD: cd * 0.9
            })
        }
        // if (Math.floor(this.oldScore / 20) !== Math.floor(this.scoreNow / 20)) {
        //     this.game.bonusManager.dispatch({
        //         type: 'FIRE/RANDOM_TOOL'
        //     });
        //     this.dispatch({
        //         type: 'BONUS_TIP'
        //     });
        //     let cd = this.game.enemyManager.enemyCD;

        //     this.game.enemyManager.dispatch({
        //         type: 'CHANGE_CD',
        //         enemyCD: 
        //     })
        // }
        this.scoreNow += score;
    },

    bonusTip() {

    },

});
