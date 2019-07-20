
cc.Class({
    extends: cc.Component,

    properties: {
        text: cc.Label,
        medalRoot: cc.Node,
        medalBaseLine: 0,
        pic: cc.SpriteAtlas,
    },

    onLoad() {
        this.scoreNow = 0,
        this.oldScore = 0;
        this.text.string = `Score: ${this.scoreNow}`;
        this.medalPool = new cc.NodePool('Medal');
        this.medalGap = 50;
    },

    update(dt) {
        if (this.oldScore === this.scoreNow) {
            return;
        }
        this.text.string = `Score: ${this.scoreNow}`;
        this.recycleAllMedals();
        this.renderMedals();
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
        cc.log('recycle medalPool size: ' + this.medalPool.size());
        cc.log('medalRoot.children: ' + this.medalRoot.children.length);
        cc.log(this.medalRoot.children);
        for (let r of this.medalRoot.children) {
            this.medalPool.put(r);
        }
        cc.log('after recycle medalRoot.children: ' + this.medalRoot.children.length);
        cc.log('after recycle: ' + this.medalPool.size());
    },

});
