/**
 * Created by unctrl.com
 * User: mannytan
 * Date: 8/22/11
 */


FACETER.Faceter3D = function(name) {
	var scope = this;

	UNCTRL.BoilerPlate.call(this);

	this.name = 'Faceter3D';

	// 3d vars
	this.container = null;
	this.projector = null;
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

	this.pointLightA = null;

	this.particles = null;
	this.facets = null;
	this.facetWires = null;

	this.totalParticles = null;
	this.totalFacets = null;

	this.cachedParticles = null;
	this.cachedFacets = null;

	// ---------------------------------------------------------
	// instantiation
	// ---------------------------------------------------------

	this.init = function() {
		this.traceFunction("init");

		// this.perlin = new ClassicalNoise();
		this.perlin = new SimplexNoise();
		this.mouse = new THREE.Vector2();
		this.offset = new THREE.Vector3();
		this.count = 0;

		this.totalParticles = FACETER.Params.startTotal;

		return this;
	}

	this.createEnvironment = function() {
		// this.traceFunction("createEnvironment");

		this.projector = new THREE.Projector(); // used for mouse position in 3d space
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

		projector = new THREE.Projector();

		return this;
	};

	this.createLights = function() {
		this.traceFunction("createLights");
		this.scene.add( new THREE.AmbientLight( 0xCCCCCC ) );

		var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
		hemiLight.color.setHSL( 0.6, 1, 0.6 );
		hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
		hemiLight.position.set( 0, 300, 0 );
		this.scene.add( hemiLight );

		this.dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
		// this.dirLight.color.setHSL( 0.1, 1, 0.95 );
		this.dirLight.position.set( -2.5, 2.5, 2.5 );
		this.dirLight.position.multiplyScalar( 100 );
		this.scene.add( this.dirLight );

		this.dirLight.castShadow = true;
		this.dirLight.shadowMapWidth = 3500;
		this.dirLight.shadowMapHeight = 3500;

		var d = 800;

		this.dirLight.shadowCameraLeft = -d;
		this.dirLight.shadowCameraRight = d;
		this.dirLight.shadowCameraTop = d;
		this.dirLight.shadowCameraBottom = -d;

		this.dirLight.shadowCameraFar = 3500;
		this.dirLight.shadowBias = -0.0001;
		this.dirLight.shadowDarkness = 0.35;
		// this.dirLight.shadowCameraVisible = true;

		return this;
	};

	// ---------------------------------------------------------
	// create elements
	// ---------------------------------------------------------

	this.createElements = function() {
		this.traceFunction("createElements");
		this.createBackgroundElements();
		this.randomizeDiamond();
		this.createPrimaryElements();

		return this;
	};

	this.randomizeElements = function() {
		this.traceFunction("randomizeElements");
		this.removeFacets();
		this.randomizeDiamond();
		this.createPrimaryElements();

		return this;
	};

	this.orderizeElements = function() {
		this.removeFacets();
		this.orderizeDiamond();
		this.createPrimaryElements();

		return this;
	};

	this.markize = function() {
		this.removeFacets();
		this.markizeDiamond();
		this.createPrimaryElements();

		return this;
	};

	this.createBackgroundElements = function() {
		
		var color = 0x000000;
		var geometry, 
			material;
		var margin =  FACETER.Params.plateMargin;

		//  -------------------------------------
		//  draw cube
		//  -------------------------------------
		
		material = new THREE.MeshBasicMaterial({
			color: color,
 			transparent: true,
 			opacity: 0.05,
			wireframe:true
		});

		geometry = new THREE.CubeGeometry(500, 500, 500);
		this.base.remove(this.outerCube);
		this.outerCube = new THREE.Mesh(geometry, material);
		this.base.add(this.outerCube);

		geometry = new THREE.CubeGeometry(50, 50, 50);
		this.base.remove(this.innerCube);
		this.innerCube = new THREE.Mesh(geometry, material);
		// this.base.add(this.innerCube);

		return this;
	};

	this.randomizeDiamond = function(){
		// this.totalParticles = FACETER.Params.startTotal;

		this.cachedParticles = [];
	
		var total = this.totalParticles - 8;

		// create mesh
		for ( i = 0; i < total; i ++ ) {
			vertex = new THREE.Vector3();
			vertex.x = Math.random();
			vertex.y = Math.random();
			vertex.z = Math.random();
			this.cachedParticles.push( vertex );
		}

		// add bounding vertices
		this.cachedParticles.push( new THREE.Vector3( 0, 0, 0) );
		this.cachedParticles.push( new THREE.Vector3( 1, 0, 0) );
		this.cachedParticles.push( new THREE.Vector3( 1, 1, 0) );
		this.cachedParticles.push( new THREE.Vector3( 0, 1, 0) );

		this.cachedParticles.push( new THREE.Vector3( 0.5, 0, 0) );
		this.cachedParticles.push( new THREE.Vector3( 1, .5, 0) );
		this.cachedParticles.push( new THREE.Vector3( .5, 1, 0) );
		this.cachedParticles.push( new THREE.Vector3( 0, .5, 0) );

		return this;
	};

	// even spaces out cachedParticles
	this.orderizeDiamond = function(){
		// this.totalParticles = FACETER.Params.startTotal;

		this.cachedParticles = [];
	
		var total = this.totalParticles - 8;

		var seed = (Math.sqrt(total) | 0) + 1;

		// create mesh
		for ( i = 0; i < total; i ++ ) {
			vertex = new THREE.Vector3();
			vertex.x = (i%seed) / seed + 1/seed*.5;
			vertex.y = 1-((i/seed)|0)  / seed - 1/seed*.5;
			vertex.z = Math.random();
			this.cachedParticles.push( vertex );
		}

		// add bounding vertices
		this.cachedParticles.push( new THREE.Vector3( 0, 0, 0) );
		this.cachedParticles.push( new THREE.Vector3( 1, 0, 0) );
		this.cachedParticles.push( new THREE.Vector3( 1, 1, 0) );
		this.cachedParticles.push( new THREE.Vector3( 0, 1, 0) );

		this.cachedParticles.push( new THREE.Vector3( 0.5, 0, 0) );
		this.cachedParticles.push( new THREE.Vector3( 1, .5, 0) );
		this.cachedParticles.push( new THREE.Vector3( .5, 1, 0) );
		this.cachedParticles.push( new THREE.Vector3( 0, .5, 0) );

		return this;
	};

	// even spaces out cachedParticles
	this.markizeDiamond = function(){
		// this.traceFunction("orderizeMDiamond");
		// this.totalParticles = FACETER.Params.startTotal;

		var mLogo = [ 0.04162562679083096, 0, 0.1647452542979943, 0.053989805116587034, 0.3216780085959886, 0.2658088499246153, 0.1444584974928367, 0.235423630112399, 0.04162562679083096, 0.1682793940505915, 0.05701558022922638, 0.5050376125784761, 0.06191238359598856, 0.3118054835390127, 0.18316842765042984, 0.4651515272382079, 0.027981733524355384, 0.6760691465175461, 0.1759379477077364, 0.6983415365715516, 0.3776414756446992, 0.39202437837535997, 0.44852480300859604, 0.6079835988417082, 0.48350196991404015, 0.7429501344161075, 0.5394654369627507, 0.6889603292995207, 0.5954289040114613, 0.39202437837535997, 0.6674818678366763, 0.23203331285847634, 0.7458307217048712, 0.10797961023317407, 0.8297759222779371, 0.1619694153497611, 0.8904067424785098, 0.2658088499246153, 0.8894777489255012, 0.39373150282792346, 0.9869437231375356, 0.7018594892985631, 0.910458452722063, 0.7699450369744011, 1, 0.8779246472075752, 0.8969320827363898, 0.5618034892347457, 0.9869437231375356, 0.5219174038944775, 0.9692200931232091, 0.23203331285847634, 0.8969320827363898, 0.08098470767488067, 0.8279123388252149, 0.02699490255829363, 0.5301419233524356, 0.5539937937251213, 0, 1, 0.13921472063037246, 0.892020389766826, 0.5114837034383954, 0.8509297446492815 ];

		this.cachedParticles = [];
	
		var total = this.totalParticles - 8 - 32;

		// create mesh
		for ( i = 0; i < total; i ++ ) {
			vertex = new THREE.Vector3();
			vertex.x = Math.random();
			vertex.y = Math.random();
			vertex.z = 0;
			this.cachedParticles.push( vertex );
		}

		// add bounding vertices
		this.cachedParticles.push( new THREE.Vector3( 0, 0, 0) );
		this.cachedParticles.push( new THREE.Vector3( 1, 0, 0) );
		this.cachedParticles.push( new THREE.Vector3( 1, 1, 0) );
		this.cachedParticles.push( new THREE.Vector3( 0, 1, 0) );

		this.cachedParticles.push( new THREE.Vector3( 0.5, 0, 0) );
		this.cachedParticles.push( new THREE.Vector3( 1, .5, 0) );
		this.cachedParticles.push( new THREE.Vector3( .5, 1, 0) );
		this.cachedParticles.push( new THREE.Vector3( 0, .5, 0) );

		for ( i = 0; i < 64; i +=2 ) {
			this.cachedParticles.push( new THREE.Vector3( 
				mLogo[i]*.25+.375, 
				-mLogo[i+1]*.25+.625, 	
				Math.random()
			) );
		};


		return this;
	};

	this.createPrimaryElements = function() {

		// create particle Mesh
		var i, id, x, y, z, percentage; 								// generic
		var particle, geometry, material, vertex, facet, triangles; 	// custom
		var total = this.totalParticles;
		var scalar = 100;
		this.base.remove( this.particles );
		geometry = new THREE.Geometry();
		material = new THREE.ParticleBasicMaterial( { 
			color:0xFF0000, 
			size: 4
		} );

		for ( i = 0; i < total; i ++ ) {

			vertex = this.cachedParticles[i].clone();
			geometry.vertices.push( vertex );

		}

		this.particles = new THREE.ParticleSystem( geometry, material );
		this.base.add( this.particles );
		this.particles.scale.set(scalar,scalar,1);
		this.particles.position.z = -200;
		this.particles.position.x = scalar*-.5;
		this.particles.position.y = scalar*-.5;
		this.particles.visible = FACETER.Params.isDebugging;

		// create facets
		// facets are created using the delunay triamgulate function
		// it copies all points and reparses them into triangles
		facet;
		triangles = triangulate(this.particles.geometry.vertices);
		this.totalFacets = triangles.length;

		this.cachedFacets = [];
		this.facets = [];
		this.facetWires = [];

		material = new THREE.MeshBasicMaterial( { 
			color: 0xFF0000, 
			wireframe:true, 
			transparent:true, 
			opacity:0.25 
		} );

		for(i = 0; i < this.totalFacets; i++) {
			geometry = new THREE.Geometry();

			geometry.vertices.push(triangles[i].a.clone());
			geometry.vertices.push(triangles[i].b.clone());
			geometry.vertices.push(triangles[i].c.clone());
			geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );

			geometry.computeFaceNormals(); 
			geometry.computeVertexNormals();

			facet = new THREE.Mesh( geometry, material );
			this.cachedFacets.push(facet);
			this.base.add(this.cachedFacets[i]);
			facet.scale.set(scalar,scalar,1);
			facet.position.z = -100;
			facet.position.x = scalar*-.5;
			facet.position.y = scalar*-.5;
			facet.visible = FACETER.Params.isDebugging;
		}


		for(i = 0; i < this.totalFacets; i++) {

			geometry = new THREE.Geometry();

			geometry.vertices.push(triangles[i].a.clone());
			geometry.vertices.push(triangles[i].b.clone());
			geometry.vertices.push(triangles[i].c.clone());
			geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );

			geometry.computeFaceNormals(); 
			geometry.computeVertexNormals();

			material = new THREE.MeshBasicMaterial( { 
				color: 0x33CCFF, 
				wireframe:true, 
				transparent:false, 
				opacity:0.25,
			} );

			facet = new THREE.Mesh( geometry, material );
			this.facets.push(facet);
			this.base.add(facet);

			material = new THREE.MeshBasicMaterial( { 
				color: 0x0099FF, 
				wireframe:false, 
				transparent:false, 
				opacity:0.25,
				side:THREE.DoubleSide
			} );

			facet = new THREE.Mesh( geometry, material );
			this.facetWires.push(facet);
			this.base.add(facet);

		}

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

		this.base.rotation.y += FACETER.Params.orbitSpeed;
		this.parsePrimaryElements();

		this.count+=FACETER.Params.speed;

		return this;
	};

	this.parsePrimaryElements = function() {

		var i, j, id, x, y, z, percentage, radius, radiusBuffer; 								// generic
		var particle, geometry, material, vertex, cachedVertex, facet, triangles; 	// custom

		var total = this.totalFacets;

		var facetRadius = FACETER.Params.facetRadius;
		var facetHeight = FACETER.Params.facetHeight;
		var facetWrap = FACETER.Params.facetWrap;
		var facetVerticalOffset = FACETER.Params.facetVerticalOffset;
		var facetVerticalSize = FACETER.Params.facetVerticalSize;
		var facetDepthSize = FACETER.Params.facetDepthSize;
		for ( i = 0; i < total; i ++ ) {
			for ( j = 0; j < 3; j ++ ) {
				vertex = this.facets[i].geometry.vertices[j];
				cachedVertex = this.cachedFacets[i].geometry.vertices[j];
				radiusBuffer = cachedVertex.z*facetDepthSize;
				radius = Math.cos( ( cachedVertex.y + facetVerticalOffset ) * facetVerticalSize * Math.PI) * facetRadius;
				radius += radiusBuffer;
				percentage = cachedVertex.x * Math.PI * 2.0 * facetWrap;
				vertex.x = Math.cos(percentage)*radius;
				vertex.z = Math.sin(percentage)*radius; 
				vertex.y = cachedVertex.y * facetHeight;
			}

			this.facets[i].position.y = -facetHeight*.5;
			this.facetWires[i].position.y = -facetHeight*.5;
		}

		// this.cachedFacets[5].geometry.vertices

		// facet = this.cachedFacets[5].geometry.vertices
		// trace(facet)

	};

	// ---------------------------------------------------------
	// draw elements
	// ---------------------------------------------------------

	this.draw = function() {

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

		this.controls.update();
		this.renderer.render( this.scene , this.camera );

		return this;
	};

	// ---------------------------------------------------------
	// listeners
	// ---------------------------------------------------------
	this.createListeners = function() {

/*
		this.container.addEventListener('mousemove', function(event) {
			scope.onDocumentMouseMove(event);
		}, false);
*/
		
		return this;
	};

	// ---------------------------------------------------------
	// public function
	// ---------------------------------------------------------
	this.reset = function(){
		this.traceFunction("reset");
		this.removeFacets();
		this.randomizeDiamond();
		this.createPrimaryElements();
		return this;
	};

	this.addParticle = function(){
		// this.traceFunction("addParticle");

		this.removeFacets();

		// create mesh
		vertex = new THREE.Vector3();
		vertex.x = Math.random();
		vertex.y = Math.random();
		vertex.z = 0;
		this.cachedParticles.push( vertex );

		this.totalParticles++;

		this.createPrimaryElements();

		return this;
	};

	// ---------------------------------------------------------
	// public functions
	// ---------------------------------------------------------

	this.convertMesh = function(){
		this.traceFunction("convertMesh");

		// var geometry = this.customPlanes[1].geometry;
		// saveSTL(geometry,"test_01");
		saveSTLFromArray(this.facets,"facets");
	}

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

	this.rotateAroundAxis = function(currentVector, vectorAxis, theta){
		var ax = vectorAxis.x,
			ay = vectorAxis.y,
			az = vectorAxis.z,

			ux = ax * currentVector.x,
			uy = ax * currentVector.y,
			uz = ax * currentVector.z,

			vx = ay * currentVector.x,
			vy = ay * currentVector.y,
			vz = ay * currentVector.z,

			wx = az * currentVector.x,
			wy = az * currentVector.y,
			wz = az * currentVector.z;

			si = Math.sin(theta);
			co = Math.cos(theta);

			var xx = (ax * (ux + vy + wz) + (currentVector.x * (ay * ay + az * az) - ax * (vy + wz)) * co + (-wy + vz) * si);
			var yy = (ay * (ux + vy + wz) + (currentVector.y * (ax * ax + az * az) - ay * (ux + wz)) * co + (wx - uz) * si);
			var zz = (az * (ux + vy + wz) + (currentVector.z * (ax * ax + ay * ay) - az * (ux + vy)) * co + (-vx + uy) * si);

		return (new THREE.Vector3(xx,yy,zz));

	};

};

FACETER.Faceter3D.prototype = new UNCTRL.BoilerPlate();
FACETER.Faceter3D.prototype.constructor = FACETER.Faceter3D;