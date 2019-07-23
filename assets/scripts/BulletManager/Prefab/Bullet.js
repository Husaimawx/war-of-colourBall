
cc.Class({
    extends: cc.Component,
    properties: {
        speed: 0, // __ px per second
    },

    reuse() {
        this.canvas = cc.find('Canvas');
        this.game = this.canvas.getComponent('Game');
        this.enabled = true;
        // this.node.parent = this.canvas;

        //设置position
        let playerNode = this.game.player.node;
        let direction = this.game.player.direction.clone();
        let action = cc.repeatForever(cc.moveBy(1, direction.mul(this.speed)));
        // this.node.runAction(action);
        this.node.position = cc.v2(
            playerNode.width * playerNode.scaleX / 2 * direction.x + 10,
            playerNode.height * playerNode.scaleY / 2 * direction.y + 10
        ).add(playerNode.position)
    },

    unuse() {
        // this.amnesia();
        this.node.stopAllActions();
        this.enabled = false;
    },

    // amnesia() {
    //     // 失忆  回炉重造之孟婆汤
    //     this.node.stopAllActions();
    //     this.enabled = false;
    // },

    onBeginContact(contact, selfCollider, otherCollider) {
        this.game.bulletManager.dispatch({
            type: 'RECYCLE',
            node: selfCollider.node,
        })
            // put(selfCollider.node);
    },

});
