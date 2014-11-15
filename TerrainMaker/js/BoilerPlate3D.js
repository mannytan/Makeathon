/**
 * Created by unctrl.com
 * User: mannytan
 */


TERRAIN.BoilerPlate3D = function(name) {
	var scope = this;

	UNCTRL.BoilerPlate.call(this);

	this.name = 'BoilerPlate3D';

	// 3d vars
	this.container = null;
	this.camera = null;
	this.scene = null;
	this.raycaster = null;
	this.intersected = null;
	this.controls = null;
	this.innerCube = null;
	this.outerCube = null;

	this.stageWidth = 0;
	this.stageHeight = 0;
	this.stageOffsetX = 0;
	this.stageOffsetY = 0;

	this.sideBottom = null;
	this.sideTop = null;
	this.sideLeft = null;
	this.sideRight = null;
	this.sideFront = null;
	this.sideBack = null;

	this.sideBox = null;

	this.createBlankArray = function() {
		var str = "";
		str = str.concat("this.yHeight = [\n");

		for (var i = 0; i<this.totalZIncrements; i++){
			str = str.concat("\t");
			for (var j = 0; j<this.totalXIncrements; j++){
				str = str.concat("0.0, ");
			}
			str = str.concat("\n");
		}

		str = str.concat("];");
		console.log(str);
	}

	// ---------------------------------------------------------
	// instantiation
	// ---------------------------------------------------------
	this.init = function() {
		this.traceFunction("this");

		this.mouse = new THREE.Vector2();
		this.offset = new THREE.Vector3();
		this.count = 0;

		this.blockHeight = 4;
		this.blockWidth = 120;
		this.blockDepth = 100;

		this.createEnvironment();
		this.createLights();
		this.createElements();
		this.createListeners();


		return this;
	}

	this.createEnvironment = function() {
		// this.traceFunction("createEnvironment");

		this.scene = new THREE.Scene();
		this.base = new THREE.Object3D();
		this.scene.add(this.base);

		this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
		this.camera.position.x = 100;
		this.camera.position.y = 100;
		this.camera.position.z = 100;

		this.controls = new THREE.TrackballControls( this.camera, document.getElementById('container3D'));
		this.controls.rotateSpeed = 2.0;
		this.controls.zoomSpeed = 1.2;
		this.controls.panSpeed = 0.8;
		this.controls.noZoom = false;
		this.controls.noPan = false;
		this.controls.staticMoving = true;
		this.controls.dynamicDampingFactor = 0.3;
		this.controls.keys = [ 65, 83, 68 ];

		this.renderer = new THREE.WebGLRenderer({
			antialias: true
		});

		this.renderer.setClearColor(0xEEEEEE, 1);
		this.renderer.setSize(this.stageWidth, this.stageHeight);

		this.renderer.gammaInput = true;
		this.renderer.gammaOutput = true;
		this.renderer.physicallyBasedShading = true;

		this.renderer.shadowMapEnabled = true;
		this.renderer.shadowMapCullFace = THREE.CullFaceBack;

		this.container = document.getElementById('container3D');
		this.container.appendChild(this.renderer.domElement);

		return this;
	};

	this.createLights = function() {
		this.traceFunction("createLights");
		// this.scene.add( new THREE.AmbientLight( 0xCCCCCC ) );

		var light	= new THREE.AmbientLight(  0x000000 );
		this.scene.add( light );

		this.light	= new THREE.DirectionalLight(  0xffffff );
		this.light.position.set( 0.25, 0.25, 1.0 ).normalize();
		this.scene.add( this.light );

		// this.light	= new THREE.DirectionalLight(  0xffffff );
		// this.light.position.set( -0.25, -0.25, -2.0 ).normalize();
		// this.scene.add( this.light );

		return this;
	};

	// ---------------------------------------------------------
	// create elements
	// ---------------------------------------------------------

	this.createElements = function() {
		this.traceFunction("createElements");
		this.createBackgroundElements();
		this.createPrimaryElements();
		this.parsePrimaryElements();

		return this;
	};

	this.createBackgroundElements = function() {
		
		var color = 0x000000;
		var geometry;
		var material;
		var margin =  TERRAIN.Params.plateMargin;

		//  -------------------------------------
		//  draw cube
		//  -------------------------------------
		
		material = new THREE.MeshBasicMaterial({
			color: color,
 			transparent: true,
 			opacity: 0.05,
			wireframe:true
		});

		geometry = new THREE.BoxGeometry(500, 500, 500);
		this.base.remove(this.outerCube);
		this.outerCube = new THREE.Mesh(geometry, material);
		this.base.add(this.outerCube);

		geometry = new THREE.BoxGeometry(50, 50, 50);
		this.base.remove(this.innerCube);
		this.innerCube = new THREE.Mesh(geometry, material);
		// this.base.add(this.innerCube);

		return this;
	};

	this.createPrimaryElements = function() {
		var material;
		var geometry;


		material = new THREE.MeshPhongMaterial({
 			ambient: 0xFF6600, 
			color: 0xFF6600, 
			shading:THREE.FlatShading,
			vertexColors:THREE.FaceColors,
			side:THREE.FrontSide,
			wireframe:false,
		});

		this.scene.remove(this.sideTop);
		geometry = new THREE.PlaneGeometry( this.blockWidth, this.blockDepth, this.totalXIncrements-1, this.totalZIncrements-1 );
		this.sideTop = new THREE.Mesh( geometry, material );
		this.scene.add( this.sideTop );

		this.scene.remove(this.sideBottom);
		geometry = new THREE.PlaneGeometry( this.blockWidth, this.blockDepth, this.totalXIncrements-1, this.totalZIncrements-1 );
		this.sideBottom = new THREE.Mesh( geometry, material );
		this.scene.add( this.sideBottom );


		this.scene.remove(this.sideFront);
		geometry = new THREE.PlaneGeometry( 200, 10, this.totalXIncrements-1, 1 );
		this.sideFront = new THREE.Mesh( geometry, material );
		this.scene.add( this.sideFront );


		this.scene.remove(this.sideBack);
		geometry = new THREE.PlaneGeometry( 200, 10, this.totalXIncrements-1, 1 );
		this.sideBack = new THREE.Mesh( geometry, material );
		this.scene.add( this.sideBack );


		this.scene.remove(this.sideLeft);
		geometry = new THREE.PlaneGeometry( 10, 200, this.totalZIncrements-1, 1 );
		this.sideLeft = new THREE.Mesh( geometry, material );
		this.scene.add( this.sideLeft );


		this.scene.remove(this.sideRight);
		geometry = new THREE.PlaneGeometry( 10, 200, this.totalZIncrements-1, 1 );
		this.sideRight = new THREE.Mesh( geometry, material );
		this.scene.add( this.sideRight );

		
		this.sideBox = [ this.sideBottom, this.sideTop, this.sideLeft, this.sideRight, this.sideFront, this.sideBack ];

		return this;
	};


	// ---------------------------------------------------------
	// parse elements
	// ---------------------------------------------------------

	this.update = function() {

		this.parse();
		this.draw();

		return this;
	};

	this.parse = function() {

		this.base.rotation.y += TERRAIN.Params.orbitSpeed;
		this.parsePrimaryElements();

		this.count+=TERRAIN.Params.perlinSpeed;

		return this;
	};

	this.parsePrimaryElements = function() {
		
		var i;
		var total;
		var x, y, z;
		var id;
		var seed;

		var totalX = this.totalXIncrements;
		var totalZ = this.totalZIncrements;

		var speed = this.count * 0.05;
		var boxHeight = TERRAIN.Params.boxHeight;
		var boxWidth = TERRAIN.Params.boxWidth;
		var boxDepth = TERRAIN.Params.boxDepth;
		// var perlinResolution = TERRAIN.Params.perlinResolution;

		total = this.sideTop.geometry.vertices.length;
		for(i = 0; i < total; i++) {
			z = parseInt(i/totalX);
			x = i%totalX;


			y = this.yHeight[i];
			y *= boxHeight;
			// y += boxHeight;
			y += this.blockHeight;
			this.sideTop.geometry.vertices[i].x = x/(totalX-1)*boxWidth-boxWidth*0.5;
			this.sideTop.geometry.vertices[i].z = z/(totalZ-1)*boxDepth-boxDepth*0.5;
			this.sideTop.geometry.vertices[i].y = y;
		}

		// ------------------------------------------------------------------

		total = this.sideBottom.geometry.vertices.length;
		for(i = 0; i < total; i++) {
			z = parseInt(i/totalX);
			x = i%totalX;
			y = 0;

			// z = this.perlin.noise((x*(perlinResolution) +speed),(y*(perlinResolution)+speed));
			// z *= boxHeight;
			// z -= boxHeight;

			this.sideBottom.geometry.vertices[i].x = x/(totalX-1)*boxWidth-boxWidth*0.5;
			this.sideBottom.geometry.vertices[i].z = (1-z/(totalZ-1))*boxDepth-boxDepth*0.5;
			this.sideBottom.geometry.vertices[i].y = y;
		}

		// ------------------------------------------------------------------
		// FRONT
		// ------------------------------------------------------------------

		total = totalX;
		for(i = 0; i < total; i++) {

			// top 
			id = i
			seed = (totalZ-1)*(totalX) + i; 
			this.sideFront.geometry.vertices[id].x = this.sideTop.geometry.vertices[seed].x;
			this.sideFront.geometry.vertices[id].y = this.sideTop.geometry.vertices[seed].y;
			this.sideFront.geometry.vertices[id].z = this.sideTop.geometry.vertices[seed].z;

			// bottom
			id = i+totalX;
			seed = i; 
			this.sideFront.geometry.vertices[id].x = this.sideBottom.geometry.vertices[seed].x;
			this.sideFront.geometry.vertices[id].y = this.sideBottom.geometry.vertices[seed].y;
			this.sideFront.geometry.vertices[id].z = this.sideBottom.geometry.vertices[seed].z;
		}

		// ------------------------------------------------------------------
		// BACK
		// ------------------------------------------------------------------

		total = totalX;
		for(i = 0; i < total; i++) {

			// top 
			id = i
			seed = totalX - 1 - i; 
			this.sideBack.geometry.vertices[id].x = this.sideTop.geometry.vertices[seed].x;
			this.sideBack.geometry.vertices[id].y = this.sideTop.geometry.vertices[seed].y;
			this.sideBack.geometry.vertices[id].z = this.sideTop.geometry.vertices[seed].z;

			// bottom
			id = i+totalX;
			seed = (totalZ)*(totalX) - 1 - i;
			this.sideBack.geometry.vertices[id].x = this.sideBottom.geometry.vertices[seed].x;
			this.sideBack.geometry.vertices[id].y = this.sideBottom.geometry.vertices[seed].y;
			this.sideBack.geometry.vertices[id].z = this.sideBottom.geometry.vertices[seed].z;
		}


		// ------------------------------------------------------------------
		// LEFT
		// ------------------------------------------------------------------
		total = totalZ;
		for(i = 0; i < total; i++) {

			z = parseInt(i/totalX);
			x = i%totalX;

			// top 
			id = i
			seed = (totalX)*i; 
			this.sideLeft.geometry.vertices[id].x = this.sideTop.geometry.vertices[seed].x;
			this.sideLeft.geometry.vertices[id].y = this.sideTop.geometry.vertices[seed].y;
			this.sideLeft.geometry.vertices[id].z = this.sideTop.geometry.vertices[seed].z;

			// bottom 
			id = i+totalZ
			seed = (totalX)*(total-i) - totalX; 
			this.sideLeft.geometry.vertices[id].x = this.sideBottom.geometry.vertices[seed].x;
			this.sideLeft.geometry.vertices[id].y = this.sideBottom.geometry.vertices[seed].y;
			this.sideLeft.geometry.vertices[id].z = this.sideBottom.geometry.vertices[seed].z;

		}

		// ------------------------------------------------------------------
		// RIGHT
		// ------------------------------------------------------------------
		total = totalZ;
		for(i = 0; i < total; i++) {

			z = parseInt(i/totalX);
			x = i%totalX;

			// top 
			id = i
			seed = (totalX)*(totalZ-i-1) + totalX - 1; 

			this.sideRight.geometry.vertices[id].x = this.sideTop.geometry.vertices[seed].x;
			this.sideRight.geometry.vertices[id].y = this.sideTop.geometry.vertices[seed].y;
			this.sideRight.geometry.vertices[id].z = this.sideTop.geometry.vertices[seed].z;

			// bottom 
			id = i+totalZ
			seed = (totalX)*( i+1 ) - 1; 
			this.sideRight.geometry.vertices[id].x = this.sideBottom.geometry.vertices[seed].x;
			this.sideRight.geometry.vertices[id].y = this.sideBottom.geometry.vertices[seed].y;
			this.sideRight.geometry.vertices[id].z = this.sideBottom.geometry.vertices[seed].z;

		}



		total = this.sideBox.length;
		for(i = 0; i < total; i++) {
			this.sideBox[i].geometry.computeVertexNormals();
			this.sideBox[i].geometry.computeFaceNormals();
			this.sideBox[i].geometry.normalsNeedUpdate = true;
			this.sideBox[i].geometry.verticesNeedUpdate = true;
		}







		// debugger
		if(this.wHelper) { this.scene.remove(this.wHelper) };
		if(this.aHelper) { this.scene.remove(this.aHelper) };

		if(TERRAIN.Params.isDebugging) {
			// helpers
			this.wHelper = new THREE.WireframeHelper( this.sideTop );
			this.scene.add( this.wHelper );

			this.aHelper = new THREE.FaceNormalsHelper( this.sideTop,20);
			this.scene.add( this.aHelper );
		}
		

	};

	// ---------------------------------------------------------
	// draw elements
	// ---------------------------------------------------------

	this.draw = function() {
		// this.traceFunction("draw");

		this.controls.update();
		this.renderer.render( this.scene , this.camera );

		return this;
	};

	// ---------------------------------------------------------
	// listeners
	// ---------------------------------------------------------
	this.createListeners = function() {
		return this;
	};


	// ---------------------------------------------------------
	// public function
	// ---------------------------------------------------------
	this.reset = function(){
		this.traceFunction("reset");

		return this;
	};

	// ---------------------------------------------------------
	// public functions
	// ---------------------------------------------------------

	this.updateValues = function(){
		this.parsePrimaryElements();
	};
	this.convertMesh = function(){
		this.traceFunction("convertMesh");

		// var geometry = this.customPlanes[1].geometry;
		// saveSTL(geometry,"test_01");
		saveSTLFromCustom(this.sideBox,"sideBox");
	};

	this.enableTrackBall = function() {
		this.controls.enabled = true;
	};

	this.disableTrackBall = function() {
		this.controls.enabled = false;
	};

	this.setDimensions = function(w, h) {
		this.stageWidth = w || 600;
		this.stageHeight = h || 600;
	};

	this.resize = function() {

		this.camera.aspect = this.stageWidth / this.stageHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( this.stageWidth, this.stageHeight );
		this.controls.handleResize();

	};

};

TERRAIN.BoilerPlate3D.prototype = Object.create(UNCTRL.BoilerPlate.prototype);
TERRAIN.BoilerPlate3D.prototype.constructor = TERRAIN.BoilerPlate3D;
TERRAIN.BoilerPlate3D.prototype.parent = UNCTRL.BoilerPlate.prototype;
