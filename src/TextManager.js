/**
 * Created by kk on 2015/6/30.
 */
function toUnicode(theString) {
    var unicodeString = '';
    for (var i = 0; i < theString.length; i++) {
        var theUnicode = theString.charCodeAt(i).toString(16).toUpperCase();
        while (theUnicode.length < 4) {
            theUnicode = '0' + theUnicode;
        }
        theUnicode = '\\u' + theUnicode;
        unicodeString += theUnicode;
    }
    return unicodeString;
}

var TextManager = {
    options:{
        size: 9,
        height: 9,
        weight: 'normal',
        font: 'heiti',
        //font: 'helvetiker',
        bevelThickness: 1,
        bevelSize: 0.2,
        bevelSegments: 1,
        bevelEnabled: false,
        curveSegments: 12,
        steps: 2
    },
    getWords:function(words, twoPieces){
        var geomWords = TextManager.getWordsGeom(words, twoPieces);
        if(twoPieces){
            var mesh1 = TextManager.createMesh(geomWords[0]);
            var mesh2 = TextManager.createMesh(geomWords[1]);
            var obj = new Array();
            obj[0] = new THREE.Object3D();
            obj[0].add(mesh1);
            obj[1] = new THREE.Object3D();
            obj[1].add(mesh2);
            return obj;

        }
        else{
            var mesh = TextManager.createMesh(geomWords);
            var obj = new THREE.Object3D();
            obj.add(mesh);
            return obj;
        }
    },
    getWordsGeom:function(words, twoPieces){
        var wordsArray=words.split("\n");
        var longLenth = 0; //取最长的行方便定坐标。
        for(var i=0;i<wordsArray.length;i++)
            if(wordsArray[i].length>longLenth)
                longLenth = wordsArray[i].length;

        var geomAll = new Array();
        geomAll[0] = new THREE.Geometry();
        geomAll[1] = new THREE.Geometry();
        for(var i=0;i<wordsArray.length;i++){ //好几行
            for(var j=0;j<wordsArray[i].length;j++){ //一行字
                var word = wordsArray[i][j];
                var midCol = (wordsArray[i].length-1)/2;
                //kk.log(word,j-midCol,i);
                var geoms = this.getOneWordGeom(word);
                for(var k=0;k<geoms.length;k++){ //一个字里拆出来的东西
                    geoms[k].applyMatrix( new THREE.Matrix4().setPosition( {
                        x:(j-midCol)*this.options.size*1.4,
                        y:-i*this.options.size*1.6,
                        z:-4*this.options.height+Math.random()*8*this.options.height} ) );
                    var random = Math.random();
                    if(!twoPieces || random<0.5)
                        geomAll[0].merge(geoms[k]);
                    else
                        geomAll[1].merge(geoms[k]);
                }
            }
        }
        geomAll[0].computeBoundingBox();
        var center1 = geomAll[0].boundingBox.center();
        geomAll[1].computeBoundingBox();
        var center2 = geomAll[1].boundingBox.center();
        var center = center1.clone().add(center2).multiplyScalar(0.5);
        var offset = center.negate();
        geomAll[0].applyMatrix( new THREE.Matrix4().setPosition( offset ) );
        geomAll[1].applyMatrix( new THREE.Matrix4().setPosition( offset ) );
        return twoPieces ? geomAll : geomAll[0];
        /*
        var geomWords = new Array();
        geomWords[0] = new Array();
        if(twoPieces)
            geomWords[1] = new Array();
        var row = 0;
        var rowWords = "";
        for(var i=0;i<words.length;i++){
            var word = words[i];
            if(word === "\n"){
                if(rowWords !== ""){
                    var geoms = this.getRowWordsGeom(rowWords, twoPieces);
                    geomWords[0][row] = geoms[0];
                    if(twoPieces)
                        geomWords[1][row] = geoms[1];
                    rowWords = "";
                }
                row++;
            }
            else{
                rowWords = rowWords + word;
            }
        }
        //最后一行。
        if(rowWords!=="") {
            geomWords[0][row] = this.getRowWordsGeom(rowWords);
            row++;
        }
        var geomAll = new Array();
        var num = twoPieces ? 2 : 1;
        for(var k=0;k<num;k++){
            //几行叠起来
            geomAll[k] = new THREE.Geometry();
            for(var i=0;i<row;i++){
                var geom = geomWords[k][i];
                if(geom!==undefined){
                    geom.applyMatrix( new THREE.Matrix4().setPosition( {
                        x:0,
                        y:i*this.options.size*1.4,z:0} ) );
                    geomAll.merge(geom);
                }
            }
            geomAll[k].center();
        }
        return twoPieces ? geomAll : geomAll[0];*/
    },
    getRowWordsGeom:function(rowWords, twoPieces){
        var geomWords = new Array();
        geomWords[0] = new THREE.Geometry();
        if(twoPieces)
            geomWords[1] = new THREE.Geometry();
        for(var i=0;i<rowWords.length;i++){
            var word = rowWords[i];
            var geom = this.getOneWordGeom(word);
            geom.applyMatrix( new THREE.Matrix4().setPosition( {
                x:i*this.options.size*1.2,
                y:0,z:-2*this.options.height+Math.random()*4*this.options.height} ) );
            geomWords[0].merge(geom);
        }
        geomWords.center();
        return geomWords;
    },
    getOneWord:function(word){
        var geom = TextManager.getOneWordGeomCombined(word);
        var mesh = TextManager.createMesh(geom);
        var obj = new THREE.Object3D();
        obj.add(mesh);
        return obj;
    },
    getOneWordGeom:function(word){
        var table = text_info.table[word];
        var geoms = new Array();
        if(table){
            for(var i=0;i<table.length;i++){
                var subGeom = new THREE.TextGeometry(table[i], this.options);
                geoms.push(subGeom)
            }
        }
        else
            geoms.push(new THREE.TextGeometry(word, this.options));
        return geoms;
    },
    getOneWordGeomCombined:function(word){
        var geoms = this.getOneWordGeom(word);
        var geomsCombine = new THREE.Geometry();
        for(var i=0;i<geoms.length;i++){
            geomsCombine.merge(geoms[i]);
        }
        geomsCombine.center();
        return geomsCombine;
    },
    createMesh:function(geom){
        // assign two materials
        //            var meshMaterial = new THREE.MeshLambertMaterial({color: 0xff5555});
        //            var meshMaterial = new THREE.MeshNormalMaterial();
        var meshMaterial = new THREE.MeshPhongMaterial({
            specular: 0xffffff,
            color: 0xeeffff,
            shininess: 100,
            metal: true
        });
        var floorTex = THREE.ImageUtils.loadTexture("res/brick-wall.jpg");
        floorTex.wrapT = THREE.RepeatWrapping;
        floorTex.wrapS = THREE.RepeatWrapping;
        var mat = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            map: floorTex
        });
        //            meshMaterial.side=THREE.DoubleSide;
        // create a multimaterial
        var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial]);

        mesh.children[0].castShadow = true;
        return mesh;
    }
};

TextManager.textTable = {
    "在":["\ue000","\ue001"],
    "我":["\ue002","\ue003"],
    "不":["\ue004","\ue005"],
    "记":["\ue006","\ue007"],
    "得":["\ue008","\ue009"],
    "的":["\ue00A","\ue00B"],
    "梦":["\ue00C","\ue00D"],
    "里":["\ue00E","\ue00F"],
    "曾":["\ue010","\ue011"],
    "经":["\ue012","\ue013"],
    "和":["\ue014","\ue015"],
    "你":["\ue016","\ue017"],
    "有":["\ue018","\ue019"],
    "过":["\ue01A","\ue01B"],
    "段":["\ue01C","\ue01D"],
    "愉":["\ue01E","\ue01F"],
    "快":["\ue020","\ue021"],
    "时":["\ue022","\ue023"]
};