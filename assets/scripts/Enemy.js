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
                game.node.width * Math.random() - game.node.width / 2,
                game.node.height * Math.random() - game.node.height / 2
            )
            if (pos.sub(playerPos).mag() < this.playerRadius) {
                return randomPos(playerPos);
            }
            return pos;
        }

        this.game = game;
        this.player = game.player;
        this.node.parent = game.node;
        this.node.position = randomPos(game.player.node.position);

        this.dt = 0;

        this.node.parent.once('gameOver', () => {
            cc.log('enemy on gameOver call');
            this.enabled = false;
            this.node.stopAllActions();
        }, this)
    },

    start() {

    },

    onDestroy() {
        // this.node.parent.off('gameOver');
    },

    update(dt) {
        this.dt += dt;
        // 
        // cc.log(playerPos);
        let playerPos = this.player.node.position;
        let direction = playerPos.sub(this.node.position).normalizeSelf();
        let moveVec = direction.mul(this.speed * dt);
        this.node.position = this.node.position.add(moveVec);
        // cc.log(direction);
        // if (this.dt > 1) {
        //     cc.log(direction.mul(this.speed));
        //     this.dt = 0;
        // }
        // cc.log(this.node.position);
        // cc.log(this.node.position.add(direction.mul(this.speed)));
        // cc.log(this.node.position);
        // cc.log("Running Action Count on enemy: " + this.node.getNumberOfRunningActions());
        // cc.log("Running Action1 : ");
        // cc.log(this.node.getActionByTag(100));
        // cc.log("Running Action2 : ");
        // cc.log(this.node.getActionByTag(200).isDone());
    },
});
