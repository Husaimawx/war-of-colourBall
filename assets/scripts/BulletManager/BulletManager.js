
cc.Class({
    extends: cc.Component,

    properties: {
        // bulletPrefab: cc.Prefab,
    },
    
    init() {
        this.canvas = cc.find('Canvas');
        this.game = this.canvas.getComponent('Game');
        this.bulletPool = new cc.NodePool('BulletPrefab');
    },

    dispatch(action) {
        switch (action.type) {
            case 'FIRE':
                this.fire();
                break;
            case 'RECYCLE':
                this.bulletPool.put(action.node);
                break;
            default: break;
        }
    },

    fire() {
        let node = this.createBullet();
        // node.position = 
    },

    createBullet() {
        if (!this.bulletPool.size()) {
            this.bulletPool.put(cc.instantiate(this.boomPrefab));
        }
        return this.bulletPool.get();
    },

});
