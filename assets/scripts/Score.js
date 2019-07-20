// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        totalScore: 0,
        text: cc.Label,
        rankRoot: cc.Node,
        pic: cc.SpriteAtlas,

        rankSpace: 0,
        // sun: cc.Sprite,
        // moon: cc.Sprite,
        // star: cc.Sprite,

        //图像资源挂在score上，也就是atlas,然后下面nodePool设置new node, node.addComponent(cc.Sprite)
        // node.sprite.spriteFrame
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.text.string = `Score: ${this.totalScore}`;
        // this.sunPool = new cc.NodePool();
        // this.moonPool = new cc.NodePool();
        // this.starPool = new cc.NodePool();
        this.rankPool = new cc.NodePool();
        for (let i = 0; i < 10; i++) {
            let node = new cc.Node();
            node.addComponent(cc.Sprite);
            // this.sunPool.put(cc.instantiate(this.sunPrefab));
            // this.moonPool.put(cc.instantiate(this.moonPrefab));
            // this.starPool.put(cc.instantiate(this.starPrefab));
            this.rankPool.put(node);
        }
        // this.sprite.spriteFrame = this.atlas.getSpriteFrame('sun0');
        // cc.loader.loadRes("test assets/sheep", cc.SpriteAtlas, function (err, atlas) {
        //     var frame = atlas.getSpriteFrame('sheep_down_0');
        //     sprite.spriteFrame = frame;
        // });
        this.olds = 0;
    },

    start() {

    },

    update(dt) {
        if (this.olds === this.totalScore) {
            return;
        }

        this.text.string = `Score: ${this.totalScore}`;
        this.recycleAllRanks();
        this.renderRank();
        this.olds = this.totalScore;
    },

    rankNode() {
        let node = this.rankPool.get();
        if (!node) {
            node = new cc.Node();
            node.addComponent(cc.Sprite);
        }
        return node;
    },

    renderRank() {
        // 十个敌人一个星星
        // 5个星星一个月亮 50
        // 5个月亮1个太阳 250
        let rankNumb = Math.floor(this.totalScore / 1);
        let sunNumb = Math.floor(rankNumb / 25);
        let moonNumb = Math.floor((rankNumb - sunNumb * 25) / 5);
        let starNumb = Math.floor(rankNumb - sunNumb * 25 - moonNumb * 5);
        starNumb = rankNumb;
        for (let i = 0; i < sunNumb; i++) {
            let sunNode = this.rankNode();
            sunNode.getComponent(cc.Sprite).spriteFrame = this.pic.getSpriteFrame('sun');
            sunNode.parent = this.rankRoot;
            // sun.node.position = ???
        }
        for (let i = 0; i < moonNumb; i++) {
            let moonNode = this.rankNode();
            // moon.sprite.spriteFrame = this.pic.getSpriteFrame('moon');
            moonNode.getComponent(cc.Sprite).spriteFrame = this.pic.getSpriteFrame('moon');
            moonNode.parent = this.rankRoot;
            // moon.node.position = ???
        }
        for (let i = 0; i < starNumb; i++) {
            let starNode = this.rankNode();
            // starNode.sprite.spriteFrame = this.pic.getSpriteFrame('star');
            starNode.getComponent(cc.Sprite).spriteFrame = this.pic.getSpriteFrame('star');
            starNode.parent = this.rankRoot;
            starNode.position = cc.v2(0, 0);
            // cc.log(starNode);
            // cc.log(starNode.getComponent(cc.Sprite));
        }
    },

    recycleAllRanks() {
        for (let r of this.rankRoot.children) {
            this.rankPool.put(r);
        }
    },

});
