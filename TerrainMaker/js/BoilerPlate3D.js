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

	// ---------------------------------------------------------
	// instantiation
	// ---------------------------------------------------------
	this.init = function() {
		this.traceFunction("this");
		// this.perlin = new ClassicalNoise();
		this.perlin = new SimplexNoise();
		this.mouse = new THREE.Vector2();
		this.offset = new THREE.Vector3();
		this.count = 0;

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

		this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 3000 );
		this.camera.position.x = 000;
		this.camera.position.y = 000;
		this.camera.position.z = 300;

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

		// var light	= new THREE.AmbientLight(  0x000000 );
		// this.scene.add( light );

		this.light	= new THREE.DirectionalLight(  0xffffff );
		this.light.position.set( 0.75, 0.75, 1.0 ).normalize();
		this.scene.add( this.light );

		// var light	= new THREE.PointLight(  0xffffff );
		// light.position.set( 0,0,1 ).normalize();
		// this.scene.add( light );

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

		this.scene.remove(this.sideFront);
		material = new THREE.MeshPhongMaterial({
			color:0xFF0000,
			shading:THREE.FlatShading,
			vertexColors:THREE.FaceColors
		});
		// material = new THREE.MeshNormalMaterial();

		material.side = THREE.sideFront;
		// material.shading = THREE.FlatShading;
		material.wireframe = false;
		geometry = new THREE.PlaneGeometry( 300, 300, this.totalXIncrements, this.totalYIncrements );
		this.sideFront = new THREE.Mesh( geometry, material );
		this.sideFront.receiveShadow = true;

		this.scene.add( this.sideFront );


		return this;
	};

	this.removeFacets = function(){
		for(i = 0; i < this.totalFacets; i++) {
			this.base.remove(this.cachedFacets[i]);
			this.base.remove(this.facets[i]);
			this.base.remove(this.facetWires[i]);
		}
		return this;
	};

	// ---------------------------------------------------------
	// parse elements
	// ---------------------------------------------------------

	this.parse = function() {

		this.base.rotation.y += TERRAIN.Params.orbitSpeed;
		this.parsePrimaryElements();

		this.count+=TERRAIN.Params.perlinSpeed;

		return this;
	};

	this.parsePrimaryElements = function() {

		this.createPrimaryElements();
		
		var i;
		var total;

		total = this.sideFront.geometry.vertices.length;

		var totalX = this.totalXIncrements+1;
		var totalY = this.totalYIncrements+1;

		var x,y;
		var speed = this.count * 0.05;
		var perlinHeight = TERRAIN.Params.perlinHeight;
		var perlinResolution = TERRAIN.Params.perlinResolution;

		for(i = 0; i < total; i++) {
			y = parseInt(i/totalX);
			x = i%totalX;
			this.sideFront.geometry.vertices[i].z = this.perlin.noise((x*perlinResolution+speed),(y*perlinResolution+speed));
			this.sideFront.geometry.vertices[i].z *= perlinHeight;
		}

		this.sideFront.geometry.computeVertexNormals();
		this.sideFront.geometry.computeFaceNormals();
		// this.sideFront.geometry.dynamic = true;

		this.sideFront.geometry.verticesNeedUpdate = true;
		this.sideFront.geometry.tangentsNeedUpdate = true;
		this.sideFront.geometry.colorsNeedUpdate = true;
		this.sideFront.geometry.elementsNeedUpdate = true;
	


		if(this.wHelper) { this.scene.remove(this.wHelper) };
		if(this.aHelper) { this.scene.remove(this.aHelper) };

		if(TERRAIN.Params.isDebugging) {
			// helpers
			this.wHelper = new THREE.WireframeHelper( this.sideFront );
			this.scene.add( this.wHelper );

			this.aHelper = new THREE.FaceNormalsHelper( this.sideFront,20);
			this.scene.add( this.aHelper );
		}


	};

	this.computeNormals = function() {
		// this.traceFunction("computeNormals");
		var i;
		var total = this.totalFacets;

		// for ( i = 0; i < total; i ++ ) {
		// 	this.facets[i].geometry.computeFaceNormals(); 
		// 	this.facets[i].geometry.computeVertexNormals(); 
		// }
	};
	// ---------------------------------------------------------
	// draw elements
	// ---------------------------------------------------------

	this.draw = function() {
		// this.traceFunction("draw");

		/*
		// update particles
		this.particles.geometry.verticesNeedUpdate = true;
		this.particles.geometry.elementsNeedUpdate = true;
		this.particles.geometry.dynamic = true;

		var total = this.totalFacets;
		for(i = 0; i < total; i++) {
			this.cachedFacets[i].geometry.verticesNeedUpdate = true;
			this.facets[i].geometry.verticesNeedUpdate = true;
			this.facetWires[i].geometry.verticesNeedUpdate = true;
		}
		*/

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
		saveSTLFromArray(this.facets,"facets");
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
