
cc.Class({
    extends: cc.Component,

    properties: {
        speed: 0, // __ px per second
    },

    update(dt) {
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



    reuse(game, pool) {
        cc.log('enemy reuse');
        this.enabled = true;
        this.game = game;
        this.pool = pool;
        this.player = game.player;
        this.node.parent = game.node;
        this.node.parent.once('gameOver', this.amnesia, this);

        //set position
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
    },

    unuse() {
        cc.log('enemy unuse');
        this.amnesia();
    },

    amnesia() {
        // 失忆  回炉重造之孟婆汤
        this.node.stopAllActions();
        this.enabled = false;
    },

    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.group === 'Bullet') {
            this.game.score.totalScore += 1;
            this.pool.put(selfCollider.node);
        }
    },




    // extends: cc.Component,

    // properties: {
    //     speed: 0, // __ px per second
    // },

    // // LIFE-CYCLE CALLBACKS:

    // init(game) {
    //     const randomPos = (playerPos) => {
    //         let pos = cc.v2(
    //             game.node.width * Math.random() - game.node.width / 2,
    //             game.node.height * Math.random() - game.node.height / 2
    //         )
    //         if (pos.sub(playerPos).mag() < this.playerRadius) {
    //             return randomPos(playerPos);
    //         }
    //         return pos;
    //     }

    //     this.game = game;
    //     this.player = game.player;
    //     this.node.parent = game.node;
    //     this.node.position = randomPos(game.player.node.position);

    //     this.dt = 0;

    //     this.node.parent.once('gameOver', () => {
    //         cc.log('enemy on gameOver call');
    //         this.enabled = false;
    //         this.node.stopAllActions();
    //     }, this)
    // },

    // start() {

    // },

    // onDestroy() {
    //     // this.node.parent.off('gameOver');
    // },

    // update(dt) {
    //     this.dt += dt;
    //     // 
    //     // cc.log(playerPos);
    //     let playerPos = this.player.node.position;
    //     let direction = playerPos.sub(this.node.position).normalizeSelf();
    //     let moveVec = direction.mul(this.speed * dt);
    //     this.node.position = this.node.position.add(moveVec);
    //     // cc.log(direction);
    //     // if (this.dt > 1) {
    //     //     cc.log(direction.mul(this.speed));
    //     //     this.dt = 0;
    //     // }
    //     // cc.log(this.node.position);
    //     // cc.log(this.node.position.add(direction.mul(this.speed)));
    //     // cc.log(this.node.position);
    //     // cc.log("Running Action Count on enemy: " + this.node.getNumberOfRunningActions());
    //     // cc.log("Running Action1 : ");
    //     // cc.log(this.node.getActionByTag(100));
    //     // cc.log("Running Action2 : ");
    //     // cc.log(this.node.getActionByTag(200).isDone());
    // },

    // onBeginContact(contact, selfCollider, otherCollider) {
    //     if (otherCollider.node.group === 'Bullet') {
    //         this.pool.put(selfCollider.node);
    //     }
    //     // switch (otherCollider.node.group) {
    //     //     case 'Bullet':
    //     //         this.pool.put(selfCollider.node);
    //     //         break;
    //     // }
    //     // cc.log('contact bullet');
    //     // cc.log(selfCollider);
    //     // cc.log(otherCollider);
    //     // this.game.killBullet(selfCollider.node);
    //     // selfCollider.node.parent.killBullet(selfCollider.node);
    // },
});
