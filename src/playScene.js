/**
 * Created by kk on 2015/5/11.
 */

var g_msg;
var g_msg2;

var options = {
    size: 10,
    height: 5,
    weight: 'normal',
    font: 'heiti',
    //font: 'helvetiker',
    bevelThickness: 1,
    bevelSize: 0.2,
    bevelSegments: 1,
    bevelEnabled: true,
    curveSegments: 12,
    steps: 2
}

var PlayScene = kk.Class.extend({
    step:0,
    step2:0,
    stats:null,
    control:null,
    ctor:function(){
        var scope = this;
        this.step = 0;
        this.step2 = 0;
        this.init();

        this.isCombined = false;
        this.pressToggleTime = 0;

        this.sceneControl = new kk.OrbitControls(camera);
        this.sceneControl.center.x = 0;
        this.sceneControl.center.y = 100;
        this.sceneControl.userPan = false;
        this.sceneControl.setEnabled(false);
        //this.sceneControl.fixedUpDown = true;
        //this.sceneControl.autoRotate = true;
        //this.sceneControl.setEnabled(false);
        kk.director.getScheduler().scheduleUpdate(this.sceneControl, 0, false);
        this.control = "obj1";
        this.objControl = new kk.RotateControl(this.obj1, camera);

        /*
        var listener1 = kk.EventListener.create({
            event: kk.EventListener.TOUCH,
            swallowTouches: true,
            onTap: function (e) {
                scope.onTap({x:e.center.x, y:e.center.y});
            }
        });
        kk.eventManager.addListener(listener1);*/
        kk.director.getScheduler().scheduleUpdate(this, 0, false);

    },
    init:function() {
        this.initStats();

        // create a scene, that will hold all our elements such as objects, cameras and lights.
        scene = new THREE.Scene();
        //scene.fog=new THREE.FogExp2( 0xffffff, 0.015 );
        //scene.fog = new THREE.Fog(0xddbbaa, 0.005, 300);
        //scene.overrideMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});

        // create a camera, which defines where we're looking at.
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

        // create a render and set the size
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setClearColor(new THREE.Color(0xaaaaaa));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMapEnabled = true;
        //renderer.shadowMapType = THREE.PCFShadowMap;
        renderer.autoClear = false; // To allow render overlay on top of sprited sphere

        // add the output of the renderer to the html element
        document.getElementById("WebGL-output").appendChild(renderer.domElement);

        // position and point the camera to the center of the scene
        camera.position.x = 0;
        camera.position.y = 250;
        camera.position.z = 150;

        // show axes in the screen
        /*
        var axes = new THREE.AxisHelper(20);
        scene.add(axes);*/

        this.initLight();

        this.initObjs();

        this.initMenu();
    },
    initLight:function() {
        var ambientLight = new THREE.AmbientLight(0x555555);
        scene.add(ambientLight);

        //小球光
        var pointColor = "#ccffcc";
        this.pointLight = new THREE.PointLight(pointColor);
        this.pointLight.distance = 30;
        this.pointLight.position.set(20, 15, 20);
        scene.add(this.pointLight);
        //this.pointLight.visible = false;
        // add a small sphere simulating the pointlight
        var sphereLight = new THREE.SphereGeometry(0.2);
        var sphereLightMaterial = new THREE.MeshBasicMaterial({color: 0xac6c25});
        this.sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
        this.sphereLightMesh.castShadow = true;
        this.sphereLightMesh.position.set(20, 15, 20);
        scene.add(this.sphereLightMesh);

        var target = new THREE.Object3D();
        target.position = new THREE.Vector3(0, 0, 0);
        //远光
        var pointColor = "#ff5808";
        var directionalLight = new THREE.DirectionalLight(pointColor);
        directionalLight.position.set(0, 180, 0);
        directionalLight.castShadow = true;
        directionalLight.shadowCameraNear = 2;
        directionalLight.shadowCameraFar = 300;
        directionalLight.shadowCameraLeft = -150;
        directionalLight.shadowCameraRight = 150;
        directionalLight.shadowCameraTop = 150;
        directionalLight.shadowCameraBottom = -150;

        directionalLight.distance = 0;
        directionalLight.intensity = 0.5;
        directionalLight.shadowMapHeight = 1024;
        directionalLight.shadowMapWidth = 1024;
        directionalLight.target = target;
        //directionalLight.shadowCameraVisible = true;
        scene.add(directionalLight);
    },
    createWords:function(){
        //this.obj1 = TextManager.getWords("一个人吃饭旅行\n走走停停。",false)
        /*
         this.obj1 = TextManager.getWords("在我不记得的梦里，\n曾经和你有过\n一段愉快的时光。",false)
         this.obj1.position.x = -20;
         this.obj1.position.y = 50;
         scene.add(this.obj1)*/
        var objs = TextManager.getWords("在我不记得的梦里，\n曾经和你有过\n一段愉快的时光。",true)
        this.obj1 = objs[0];
        this.obj1.position.x = 0;
        this.obj1.position.y = 63;
        this.obj1.position.z = -35;
        this.obj1.rotation.x = Math.random();//-2.1;
        this.obj1.rotation.y = Math.random();
        this.obj1.rotation.z = Math.random();
        scene.add(this.obj1);
        this.obj2 = objs[1];
        this.obj2.position.x = 0;
        this.obj2.position.y = 126;
        this.obj2.position.z = -70;
        this.obj2.rotation.x = Math.random();
        this.obj2.rotation.y = Math.random();
        this.obj2.rotation.z = Math.random();
        scene.add(this.obj2);
    },
    initMenu:function(){
        this.sceneOrtho = new THREE.Scene();
        this.cameraOrtho = new THREE.OrthographicCamera(-window.innerWidth*0.5, window.innerWidth*0.5, window.innerHeight*0.5, -window.innerHeight*0.5, -1, 10);
        this.cameraOrtho.position.z = 10;
        this.cameraOrtho.lookAt(new THREE.Vector3(0, 0, 0));
        var scope = this;

        var t = THREE.ImageUtils.loadTexture( 'res/switchButton.png',undefined, createHudSprite);
        function createHudSprite(texture){
            var material = new THREE.SpriteMaterial( { map: texture } );
            var imageWidth = texture.image.width / 2;
            var imageHeight = texture.image.height / 2;
            var sprite = new THREE.Sprite( material );
            sprite.scale.set( imageWidth, imageHeight, 1 );
            sprite.position.set( 0,-window.innerHeight*0.3, 1 );
            scope.toggle = new kk.Menu(sprite, scope.sceneOrtho, scope.cameraOrtho, function(){
                scope.switchControl();
            });
            //scope.sceneOrtho.add( sprite );
            /*
            var sprite2 = new THREE.Sprite( material );
            sprite2.scale.set( imageWidth, imageHeight, 1 );
            sprite2.position.set( window.innerWidth*0.3, -window.innerHeight*0.3, 1 );
            scope.toggle2 = new kk.Menu(sprite2, scope.sceneOrtho, scope.cameraOrtho, function(){
                g_msg.setString("obj1:"+scope.obj1.rotation.x.toFixed(2)+","+
                    scope.obj1.rotation.y.toFixed(2)+","+
                    scope.obj1.rotation.z.toFixed(2));
                g_msg2.setString("obj2:"+scope.obj2.rotation.x.toFixed(2)+","+
                scope.obj2.rotation.y.toFixed(2)+","+
                scope.obj2.rotation.z.toFixed(2));
            });*/
        }

        /*
        var m2 = new THREE.SpriteMaterial( { map: t, useScreenCoordinates: false, color: 0xff0000 } );
        var sprite2 = new THREE.Sprite( m2 );
        sprite2.position.set( -5, 10, 5 );
        sprite2.scale.set( 6, 6, 1.0 ); // imageWidth, imageHeight
        scene.add( sprite2 );*/

        g_msg = new d.Label("",{ fontsize: 32} );
        g_msg.sprite.position.set(0,0,0);
        this.sceneOrtho.add( g_msg.sprite );

        g_msg2 = new d.Label("",{ fontsize: 32} );
        g_msg2.sprite.position.set(0,-window.innerHeight*0.2,0);
        this.sceneOrtho.add( g_msg2.sprite );
    },
    switchControl:function(){
        //g_msg.setString("");
        if(this.isCombined){
            this.uncombineObjects();
        }
        if(this.control === "obj2"){
            this.sceneControl.setEnabled(false);
            this.objControl.removeSelf();
            this.objControl = new kk.RotateControl(this.obj1, camera);
            this.control = "obj1";
            kk.log("control obj1");
        }
        else if(this.control === "obj1"){
            this.sceneControl.setEnabled(false);
            this.objControl.removeSelf();
            this.objControl = new kk.RotateControl(this.obj2, camera);
            this.control = "obj2";
            kk.log("control obj2");
        }
        /*
        else if(this.control === "obj2"){
            this.sceneControl.setEnabled(true);
            this.objControl.removeSelf();
            this.control = "camera";
            kk.log("control camera");
        }*/
    },
    combineObjects:function(){
        this.isCombined = true;
        this.sceneControl.setEnabled(false);
        this.objControl.removeSelf();

        scene.remove(this.obj1);
        scene.remove(this.obj2);
        this.objCombined = new THREE.Object3D();
        this.objCombined.add(this.obj1);
        this.objCombined.add(this.obj2);
        scene.add(this.objCombined);
        this.objControl = new kk.RotateControl(this.objCombined, camera);
        kk.log("combineObjects");
    },
    uncombineObjects:function(){
        this.isCombined = false;
        this.objCombined.remove(this.obj1);
        this.objCombined.remove(this.obj2);
        scene.remove(this.objCombined);
        scene.add(this.obj1);
        scene.add(this.obj2);
        kk.log("uncombineObjects");
    },
    initObjs:function(){
        //平地
        var floorTex = THREE.ImageUtils.loadTexture("res/brick-wall.jpg");
        floorTex.wrapT = THREE.RepeatWrapping;
        floorTex.wrapS = THREE.RepeatWrapping;
        var mat = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: floorTex
        });
        var geom = new THREE.BoxGeometry(500, 500, 1, 30);
        geom.computeVertexNormals();
        var plane = new THREE.Mesh(geom, mat);
        plane.rotation.x = -0.5 * Math.PI;
        plane.receiveShadow = true;
        plane.material.map.repeat.set(10,10);
        plane.material.map.needUpdate = true;
        plane.position.y = -5;
        scene.add(plane);

        //this.createControlObj2();
        this.createWords();
    },
    createMesh:function(geom) {
        // assign two materials
    //            var meshMaterial = new THREE.MeshLambertMaterial({color: 0xff5555});
    //            var meshMaterial = new THREE.MeshNormalMaterial();
        var meshMaterial = new THREE.MeshPhongMaterial({
            specular: 0xffffff,
            color: 0xeeffff,
            shininess: 100,
            metal: true
        });
    //            meshMaterial.side=THREE.DoubleSide;
        // create a multimaterial
        var plane = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial]);

        return plane;
    },
    createControlObj:function(){
        var cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
        var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xaaaadd});
        this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        this.cube.castShadow = true;
        // position the cube
        this.cube.position.x = 0;
        this.cube.position.z = 0;
        this.cube.position.y = 15;
        scene.add(this.cube);

        //this.objControl = new kk.RotateControl(cube, camera);
    },
    createControlObj2:function(){
        var loader = new THREE.OBJMTLLoader();
        var scope = this;
        loader.load('res/1.obj', 'res/1.mtl', function (object) {
            object.traverse(function(child)
            {
                if (child instanceof THREE.Mesh)
                {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            object.scale.set(0.3, 0.3, 0.3);
            object.position.set(0,15,0)
            object.castShadow = true;
            object.receiveShadow = true;

            scope.cube = object;
            scene.add(scope.cube);
        });
    },
    update:function(dt){
        this.stats.update();

        this.step+=0.02;
        if(this.step > Math.PI*2) this.step -= Math.PI*2;

        this.sphereLightMesh.position.x = 20 * (Math.cos(this.step));
        this.sphereLightMesh.position.z = 20 * (Math.sin(this.step));
        this.pointLight.position.x = 20 * (Math.cos(this.step));
        this.pointLight.position.z = 20 * (Math.sin(this.step));

        //按住使两个物体结合。
        if(this.toggle) {
            if (this.toggle.isPressed && this.toggle.isSelected) {
                if (!this.isCombined) {
                    this.pressToggleTime += dt;
                    if (this.pressToggleTime >= 1) {
                        this.combineObjects();
                    }
                }
            }
            else {
                this.pressToggleTime = 0;
            }
        }

        renderer.clear();
        renderer.render(scene, camera);
        renderer.clearDepth();
        renderer.render(this.sceneOrtho, this.cameraOrtho);
    },
    onTap:function(event){
    },
    initStats:function() {
        this.stats = new Stats();
        this.stats.setMode(0); // 0: fps, 1: ms
        // Align top-left
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '0px';
        this.stats.domElement.style.top = '0px';

        document.getElementById("Stats-output").appendChild(this.stats.domElement);
    }
});