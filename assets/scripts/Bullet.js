
cc.Class({
    extends: cc.Component,

    properties: {
        speed: 0, // __ px per second
    },

    reuse(game, pool) {
        cc.log('bullet reuse');
        this.enabled = true;
        this.game = game;
        this.pool = pool;
        this.node.parent = game.node;
        this.node.parent.once('gameOver', this.amnesia, this);

        //set direction and position 
        let playerNode = game.player.node;
        let direction = game.player.direction.clone();
        let action = cc.repeatForever(cc.moveBy(1, direction.mul(this.speed)));
        this.node.runAction(action);
        // cc.log('direction');
        // cc.log(direction);
        // cc.log('game.player.direction');
        // cc.log(game.player.direction);
        // cc.log(this.node);
        this.node.position = cc.v2(
            playerNode.width * playerNode.scaleX / 2 * direction.x + 10,
            playerNode.height * playerNode.scaleY / 2 * direction.y + 10
        ).add(playerNode.position)
        // cc.log(playerNode);
        // cc.log(this.node);
    },

    unuse() {
        cc.log('bullet unuse');
        this.amnesia();
        // this.node.parent.off('gameOver', this.amnesia, this.node);
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
