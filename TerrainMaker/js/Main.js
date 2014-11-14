/**
 * Created by unctrl.com
 * User: mannytan
 * Date: 03/20/12
 */

var TERRAIN = TERRAIN || {};

TERRAIN.Main = function(name) {
	var scope = this;

	UNCTRL.BoilerPlate.call(this);

	this.name = 'Main';
	this.isPaused = false;

	// stage
	this.stageWidth = window.innerWidth - this.guiWidth;
	this.stageHeight = window.innerHeight;
	this.stageOffsetX = ((window.innerWidth - this.stageWidth) * 0.5) | 0;
	this.stageOffsetY = ((window.innerHeight - this.stageHeight) * 0.5) | 0;

	// dat.gui
	this.gui = null;

	// stats
	this.stats = new Stats();
	this.stats.domElement.style.position = 'absolute';

	// 3d
	this.boilerPlate3D = null;
	this.terrain3D = null;
	
	this.init = function() {
		this.traceFunction("init");
		this.createListeners();

		this.gui = new TERRAIN.Params("Params");
		this.gui.addEventListener("TOGGLE_VIEW", function() {
			scope.terrain3D.toggleWireFrame();
		});
		this.gui.createGui();
		
		this.terrain3D = new TERRAIN.Terrain3D("Terrain");
		this.terrain3D.init();
		this.terrain3D.setDimensions(this.stageWidth,this.stageHeight);

		this.gui.set3DScope(this.terrain3D);
		this.gui.createListeners();

		this.loader = document.getElementById('loader');
		document.body.appendChild(this.stats.domElement);

		// stop the user getting a text cursor
		document.onselectStart = function() {
			return false;
		};

		this.resize();
		this.play();
		return this;
	};

	this.update = function() {

		this.terrain3D.update();
		// this.terrain3D.parse();
		// this.terrain3D.draw();
		return this;
	};

	this.loop = function() {
		this.stats.update();
		this.update();
		if (this.isPaused) {
			return this;
		}
		requestAnimationFrame(function() {
			scope.loop();
		});
		return this;
	};

	this.pausePlayToggle = function() {
		if (scope.isPaused) {
			this.play();
		} else {
			this.pause();
		}
	};

	this.play = function() {
		this.isPaused = false;
		this.terrain3D.enableTrackBall();
		this.loop();
		return this;
	};

	this.pause = function() {
		this.isPaused = true;
		this.terrain3D.disableTrackBall();
	};

	this.createListeners = function() {
		window.addEventListener('keydown', function() {
			scope.keyDown(event);
		}, false);

		window.addEventListener('resize', function() {
			scope.resize(event);
		}, false);

	};

	this.keyDown = function(event) {
		if (event.keyCode === 32) {
			this.pausePlayToggle();
		}

		// save stl
		if (event.keyCode === 83) {
			this.terrain3D.convertMesh();
		}
	};

	this.resize = function() {
		this.stageWidth = window.innerWidth - TERRAIN.Params.guiWidth;
		this.stageHeight = window.innerHeight;

		this.terrain3D.setDimensions(this.stageWidth,this.stageHeight);
		this.terrain3D.resize();

		this.stats.domElement.style.top = (10) + 'px';
		this.stats.domElement.style.right = (TERRAIN.Params.guiWidth + 10) + 'px';

	};

};

TERRAIN.Main.prototype = new UNCTRL.BoilerPlate();
TERRAIN.Main.prototype.constructor = TERRAIN.Main;