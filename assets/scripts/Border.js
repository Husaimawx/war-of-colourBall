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
        this.canvas = cc.find('Canvas');
        // cc.log(this.rigidbody);
        // cc.log(this.node);
        // cc.log(this.node.getComponent(cc.Graphics));
        // cc.log(this.graphics);
        // this.graphics = this.node.getComponent(cc.Graphics);
        // let height = this.node.parent.height;
        // let width = this.node.parent.width;
        // this.graphics.moveTo(20, 20);
        // this.graphics.lineTo(20, height);
        // this.graphics.lineTo(width, height);
        // this.graphics.lineTo(width, 20);
        // this.graphics.lineTo(20, 20);
        // this.graphics.strokeColor = cc.Color.RED;
        // this.graphics.stroke();
    },

    start() {

    },

    // // onCollisionEnter: function (other, self) {
    // onCollisionStay(other, self) {
    //     console.log('on collision border');
    //     let otherNode = other.node;
    //     switch (other.node.name) {
    //         case 'Player':
    //             let transform = new cc.v2(
    //                 other.world.aabb.x - this.canvas.width / 2,
    //                 other.world.aabb.y - this.canvas.height / 2
    //             )
    //             cc.log(transform);
    //             other.node.setPosition(transform);
    //             // cc.log(self);
    //             // cc.log(other);
    //             // other.node.position = other.world.preAabb.origin;
    //             break;
    //     }
    //     // cc.warn('other');
    //     // cc.log(other);
    //     // cc.log(self);
    //     // // 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
    //     var world = self.world;
    //     // cc.warn('world');
    //     // cc.log(world);

    //     // // 碰撞组件的 aabb 碰撞框
    //     // var aabb = world.aabb;
    //     // cc.log('aabb');
    //     // cc.log(aabb);

    //     // // 节点碰撞前上一帧 aabb 碰撞框的位置
    //     // var preAabb = world.preAabb;
    //     // cc.log('preAabb');
    //     // cc.log(preAabb);

    //     // // 碰撞框的世界矩阵
    //     // var t = world.transform;
    //     // cc.log('transform');
    //     // cc.log(transform);

    //     // // 以下属性为圆形碰撞组件特有属性
    //     // var r = world.radius;
    //     // var p = world.position;

    //     // // 以下属性为 矩形 和 多边形 碰撞组件特有属性
    //     // var ps = world.points;
    //     // cc.log('points');
    //     // cc.log(points);
    // },

    // update (dt) {},
});
