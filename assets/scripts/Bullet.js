
cc.Class({
    extends: cc.Component,

    properties: {
        speed: 0, // 100 px per second
        // direction: new cc.Vec2(),
    },

    init(game) {
        let player = game.player;
        this.node.parent = game.node;
        this.radius = this.node.width / 2;
        this.direction = player.direction.clone();

        this.node.position = cc.v2(
            player.node.width * player.node.scaleX / 2 * this.direction.x + 10,
            player.node.height * player.node.scaleY / 2 * this.direction.y + 10
        ).add(player.node.position)

        let action = cc.repeatForever(cc.moveBy(1, this.direction.mulSelf(this.speed)));
        this.node.runAction(action);
    },

});
