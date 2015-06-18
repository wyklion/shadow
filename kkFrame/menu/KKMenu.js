/**
 * Created by kk on 2015/6/15.
 */

kk.Menu = kk.Class.extend({
    menuItem:null,
    listener:null,
    callback:null,
    camera:null,
    scope:null,
    ctor: function (sprite, scope, camera, callback) {
        this.menuItem = sprite;
        this.scope = scope;
        this.camera = camera;
        this.callback = callback;

        this.scope.add(this.menuItem);
        this.init();
    },
    init:function(){
        this.registerListener();
    },
    onTap:function(event){
        var centerX = this.menuItem.position.x-this.camera.left;
        var centerY = this.camera.top-this.menuItem.position.y;
        if(event.x >= centerX-this.menuItem.scale.x*0.5
            && event.x <= centerX+this.menuItem.scale.x*0.5
            && event.y >= centerY-this.menuItem.scale.y*0.5
            && event.y <= centerY+this.menuItem.scale.y*0.5)
            this.callback();
        /*
        var vector = new THREE.Vector3(( event.x / window.innerWidth ) * 2 - 1, -( event.y / window.innerHeight ) * 2 + 1, 0.5);
        vector = vector.unproject(this.camera);
        vector.sub(this.camera.position).normalize()
        var raycaster = new THREE.Raycaster(this.camera.position, vector);
        kk.log(this.camera.position, vector)
        var intersects = raycaster.intersectObjects([this.menuItem]);

        if (intersects.length > 0) {
            this.callback();
        }*/
    },
    registerListener:function(){
        var scope = this;
        this.listener = kk.EventListener.create({
            event: kk.EventListener.TOUCH,
            swallowTouches: false,
            onTap: function (e) {
                scope.onTap({x: e.center.x,y: e.center.y});
            }
        });
        kk.eventManager.addListener(this.listener);
    },
    removeSelf:function(){
        if(this.listener != null)
            kk.eventManager.removeListener(this.listener);
        this.scope.remove(this.menuItem);
    }
});