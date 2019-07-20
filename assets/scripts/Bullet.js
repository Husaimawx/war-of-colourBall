
cc.Class({
    extends: cc.Component,

    properties: {
        speed: 0, // 100 px per second
        // direction: new cc.Vec2(),
    },

    init(game, bulletPool) {
        this.game = game;
        this.bulletPool = bulletPool;
        this.player = game.player;
        this.node.parent = game.node;
        this.radius = this.node.width / 2;
        this.direction = this.player.direction.clone();

        this.node.position = cc.v2(
            this.player.node.width * this.player.node.scaleX / 2 * this.direction.x + 10,
            this.player.node.height * this.player.node.scaleY / 2 * this.direction.y + 10
        ).add(this.player.node.position)

        let action = cc.repeatForever(cc.moveBy(1, this.direction.mulSelf(this.speed)));
        this.node.runAction(action);

        this.node.parent.once('gameOver', () => {
            cc.log('bullet on gameOver call');
            this.node.stopAllActions();
            this.enabled = false;
        }, this)
    },

    onDestroy() {
        // this.node.parent.off('gameOver');
    },

    reuse(bulletPool, parentNode) {
        this.enabled = true;
        this.bulletPool = bulletPool;
        this.node.parent = parentNode;
        this.node.parent.once('gameOver', this.amnesia, this.node);
    },

    unuse() {
        this.amnesia();
        // this.bulletPool.put(this.node);
        // this.node.parent.off('gameOver', this.amnesia, this.node);
    },

    amnesia() {
        // 失忆  回炉重造之孟婆汤
        this.node.stopAllActions();
        this.enabled = false;
    },

    // unuse() {
    //     cc.log('bullet on put call unuse');
    //     this.node.parent.off('gameOver', () => {
    //         this.node.stopAllActions();
    //         this.enabled = false;
    //     }, this)
    // },

    onKilled(node) {
        // node.parent.off('gameOver');
    },

    onBeginContact(contact, selfCollider, otherCollider) {
        switch (otherCollider.node.group) {
            case 'Enemy':
                this.game.killEnemy(otherCollider.node);
                break;
        }
        // cc.log('contact bullet');
        // cc.log(selfCollider);
        // cc.log(otherCollider);
        this.bulletPool.put(selfCollider.node);
        // this.game.killBullet(selfCollider.node);
        // selfCollider.node.parent.killBullet(selfCollider.node);
    },

});
