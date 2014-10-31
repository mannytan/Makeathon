/**
 * Created by unctrl.com
 * User: mannytan
 */


FACETER.BoilerPlate3D = function(name) {
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


		var light	= new THREE.AmbientLight( Math.random() * 0xffffff );
		this.scene.add( light );
		var light	= new THREE.DirectionalLight( Math.random() * 0xffffff );
		light.position.set( Math.random(), Math.random(), Math.random() ).normalize();
		this.scene.add( light );
		var light	= new THREE.PointLight( Math.random() * 0xffffff );
		light.position.set( Math.random()-0.5, Math.random()-0.5, Math.random()-0.5 )
				.normalize().multiplyScalar(1.2);
		this.scene.add( light );

		return this;
	};

	// ---------------------------------------------------------
	// create elements
	// ---------------------------------------------------------

	this.createElements = function() {
		this.traceFunction("createElements");
		this.createBackgroundElements();
		this.orderizeDiamond();
		this.createPrimaryElements();
		this.parsePrimaryElements();


		return this;
	};

	this.randomizeElements = function() {
		this.traceFunction("randomizeElements");
		this.removeFacets();
		this.randomizeDiamond();
		this.createPrimaryElements();
		this.parsePrimaryElements();

		return this;
	};

	this.orderizeElements = function() {
		this.removeFacets();
		this.orderizeDiamond();
		this.createPrimaryElements();
		this.parsePrimaryElements();
		return this;
	};

	this.createBackgroundElements = function() {
		
		var color = 0x000000;
		var geometry;
		var material;
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

	this.randomizeDiamond = function(){

		this.cachedParticles = [];
	
		var total = this.totalParticles;

		// create mesh
		for ( i = 0; i < total; i ++ ) {
			vertex = new THREE.Vector3();
			vertex.x = Math.random();
			vertex.y = Math.random();
			vertex.z = Math.random();
			this.cachedParticles.push( vertex );
		}

		return this;
	};

	// even spaces out cachedParticles
	this.orderizeDiamond = function(){

		this.cachedParticles = [];

		var i, j;
		var seed;

		// create mesh
		var margin = 0.01;
		seed = 0;
		for ( j = 0; j < this.totalYIncrements; j ++ ) {
			for ( i = 0; i < this.totalXIncrements; i ++ ) {
				vertex = new THREE.Vector3();

				vertex.x = i/this.totalXIncrements;
				vertex.y = j/this.totalYIncrements;
				vertex.z = this.zHeight[seed];
				this.cachedParticles.push( vertex );

				seed++;
			}
		}

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
		material = new THREE.PointCloudMaterial( { 
			color:0xFF0000, 
			size: 4
		} );

		for ( i = 0; i < total; i ++ ) {

			vertex = this.cachedParticles[i].clone();
			geometry.vertices.push( vertex );

		}

		this.particles = new THREE.PointCloud( geometry, material );
		this.base.add( this.particles );
		this.particles.scale.set(scalar,scalar,1);
		this.particles.position.z = -200;
		this.particles.position.x = scalar*-.5;
		this.particles.position.y = scalar*-.5;
		this.particles.visible = FACETER.Params.isDebugging;

		// create facets
		// facets are created using the delunay triangulate function
		// it copies all points and reparses them into triangles
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

			material = new THREE.MeshNormalMaterial( { 
				side:THREE.DoubleSide
			} );

			facet = new THREE.Mesh( geometry, material );
			this.facets.push(facet);
			this.base.add(facet);

			material = new THREE.MeshPhongMaterial( { 
				color: 0x0099FF, 
				wireframe:false, 
				transparent:false, 
				side:THREE.DoubleSide
			} );

			facet = new THREE.Mesh( geometry, material );
			this.facetWires.push(facet);
			// this.base.add(facet);

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
		// this.parsePrimaryElements();

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
				percentage = (cachedVertex.x/(1-1/this.totalXIncrements)) * Math.PI * 2.0 * facetWrap;
				vertex.x = Math.cos(percentage)*radius;
				vertex.z = Math.sin(percentage)*radius; 
				vertex.y = cachedVertex.y * facetHeight;
			}

			this.facets[i].position.y = -facetHeight*.5;
			this.facetWires[i].position.y = -facetHeight*.5;

		}

		this.computeNormals();
	};

	this.computeNormals = function() {
		this.traceFunction("computeNormals");
		var i;
		var total = this.totalFacets;

		for ( i = 0; i < total; i ++ ) {
			this.facets[i].geometry.computeFaceNormals(); 
			this.facets[i].geometry.computeVertexNormals(); 
		}
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

FACETER.BoilerPlate3D.prototype = Object.create(UNCTRL.BoilerPlate.prototype);
FACETER.BoilerPlate3D.prototype.constructor = FACETER.BoilerPlate3D;
FACETER.BoilerPlate3D.prototype.parent = UNCTRL.BoilerPlate.prototype;
