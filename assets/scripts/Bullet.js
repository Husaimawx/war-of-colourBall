
cc.Class({
    extends: cc.Component,
    properties: {
        speed: 0, // __ px per second
    },

    reuse(game, pool) {
        this.enabled = true;
        this.game = game;
        this.pool = pool;
        this.node.parent = game.node;

        //事件注册
        this.node.parent.once('gameOver', this.amnesia, this);

        //设置position
        let playerNode = game.player.node;
        let direction = game.player.direction.clone();
        let action = cc.repeatForever(cc.moveBy(1, direction.mul(this.speed)));
        this.node.runAction(action);
        this.node.position = cc.v2(
            playerNode.width * playerNode.scaleX / 2 * direction.x + 10,
            playerNode.height * playerNode.scaleY / 2 * direction.y + 10
        ).add(playerNode.position)
    },

    unuse() {
        if (!!this.node.parent) {
            this.node.parent.off('gameOver', this.amnesia, this);
        }
        this.amnesia();
    },

    amnesia() {
        // 失忆  回炉重造之孟婆汤
        this.node.stopAllActions();
        this.enabled = false;
    },

    onBeginContact(contact, selfCollider, otherCollider) {
        this.pool.put(selfCollider.node);
    },

});
