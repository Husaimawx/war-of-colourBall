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
        isMoving: false,
        speed: 0,
        CD: 0,
        prePos: new cc.Vec2(),
        playerRadius: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    init(game) {
        const randomPos = (playerPos) => {
            let pos = cc.v2(
                game.node.width * Math.random(),
                game.node.ight * Math.random()
            )
            if (pos.sub(playerPos).mag() < playerRadius) {
                return randomPos(playerPos);
            }
        }

        // Math.floor(
        // Math.random() * (upperValue - lowerValue + 1) + lowerValue
        // )
        // let randomX = game.node.width * Math.random();
        // let randomY = game.node.height * Math.random();
        // let randomX = randomValue();
        this.node.parent = game.node;
        this.node.position = randomPos(game.player.node.position);
    },

    randomFrom(lowerValue, upperValue) {
    },

    start() {

    },

    update (dt) {},
});
