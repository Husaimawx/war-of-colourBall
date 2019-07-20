
cc.Class({
    extends: cc.Component,
    properties: {
        speed: 0, // __ px per second
        level: 0,
    },

    update(dt) {
        let playerPos = this.player.node.position;
        let direction = playerPos.sub(this.node.position).normalizeSelf();
        let moveVec = direction.mul(this.speed * dt);
        this.node.position = this.node.position.add(moveVec);
    },

    reuse(game, pool, level = 1, pos = null) {
        this.enabled = true;
        this.game = game;
        this.pool = pool;
        this.player = game.player;
        this.node.parent = game.node;
        this.level = level;
        this.node.setScale(1 + 0.1 * level);
        // cc.log(this.node.uuid + ' scale: ' + this.node.getScale());

        // 设置position
        if (pos instanceof cc.Vec2) {
            this.position = pos;
        } else {
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
            this.node.position = randomPos(game.player.node.position);
        }

        // 事件注册
        this.node.parent.once('gameOver', this.amnesia, this);
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
        if (otherCollider.node.group === 'Bullet') {
            cc.log(selfCollider.node.getComponent('Enemy').level);
            this.game.score.scoreNow += selfCollider.node.getComponent('Enemy').level;
            this.pool.put(selfCollider.node);
        } else if (otherCollider.node.group === 'Enemy') {
            // cc.log(selfCollider.node.uuid + 'want to emit');
            if (selfCollider.node.uuid > otherCollider.node.uuid) {
                // cc.log('can emit');
                this.game.node.emit('mergeEnemy', selfCollider.node, otherCollider.node);
            }
            // this.game.mergeEnemy(selfCollider.node, otherCollider.node);
            //在那边特判一下是undefined吗
        }
    },

});
