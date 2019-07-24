
cc.Class({
    extends: cc.Component,

    properties: {
        text1: cc.Label,
        text2: cc.Label,
        medalRoot: cc.Node,
        medalBaseLine: 0,
        pic: cc.SpriteAtlas,
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

    dispatch(action) {
        switch (action.type) {
            case 'ADD':
                this.addScore(action.score);
                break;
        }
    },

    addScore(score = 1) {
        this.scoreNow += score;
        if (Math.floor(this.oldScore / 5) !== Math.floor(this.scoreNow / 5)) {
            this.game.bonusManager.dispatch({
                type: 'FIRE/RANDOM_TOOL'
            });
        }
    },

    update(dt) {
        if (this.oldScore === this.scoreNow) {
            return;
        }
        this.node.stopAllActions();

        this.text2.string = `           ${this.scoreNow}`;
        if (this.scoreNow - this.oldScore > 10) {
            this.text2.node.runAction(this.action);
        }
        // this.recycleAllMedals();
        // this.renderMedals();
        this.oldScore = this.scoreNow;
    },

    medalNode() {
        if (!this.medalPool.size()) {
            let node = new cc.Node();
            node.addComponent('Medal');
            node.addComponent(cc.Sprite);
            this.medalPool.put(node);
        }
        return this.medalPool.get();
    },

    renderMedals() {
        // count
        // 十个敌人一个星星
        // 5个星星一个月亮 50
        // 5个月亮1个太阳 250
        let medalNumb = Math.floor(this.scoreNow / this.medalBaseLine);
        let sunNumb = Math.floor(medalNumb / 25);
        let moonNumb = Math.floor((medalNumb - sunNumb * 25) / 5);
        let starNumb = Math.floor(medalNumb - sunNumb * 25 - moonNumb * 5);

        // render
        let cnt = 0; //50px medal gap;
        const render = (type, numb) => {
            for (let i = 0; i < numb; i++) {
                let node = this.medalNode();
                node.getComponent(cc.Sprite).spriteFrame = this.pic.getSpriteFrame(type);
                node.parent = this.medalRoot;
                node.position = cc.v2(
                    node.parent.position.x + cnt * this.medalGap,
                    node.parent.position.y
                );
                cnt++;
            }
        }
        render('sun', sunNumb);
        render('moon', moonNumb);
        render('star', starNumb);
    },

    recycleAllMedals() {
        for (let r of this.medalRoot.children) {
            this.medalPool.put(r);
        }
    },

});
