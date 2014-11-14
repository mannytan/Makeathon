/**
 * Created by unctrl.com
 * User: mannytan
 * Date: 03/20/12
 */

var TERRAIN = TERRAIN || {};

TERRAIN.Params = {};
TERRAIN.Sliders = {};

TERRAIN.Params = function(name) {
	var scope = this;

	UNCTRL.BoilerPlate.call(this);

	this.name = 'Params';
	this.scope3d = null;

	this.init = function() {
		this.traceFunction("init");
		return this;
	};

	this.createGui = function() {

		TERRAIN.Params = {
			orbitSpeed: 0.0000,
			guiWidth: 300,
			speed: 0.125,
			boxHeight: 30,
			modulusIncrement: 1,
			perlinSpeed: 0.0,
			perlinResolution: 0.125,
			delay: 0.150,
			isDebugging: false,
			saveSTL: function(){
				scope.scope3d.convertMesh();
			},
			createBlankArray: function(){
				scope.scope3d.createBlankArray();
			},
			orderize: function(){
				scope.scope3d.orderizeElements();
			},
			updateValues: function(){
				scope.scope3d.updateValues();
			}
			
		};

		this.gui = new dat.GUI({
			width: TERRAIN.Params.guiWidth,
		});

		this.guiContainer = this.gui.domElement;
		this.guiContainer.onselectStart = function() {
			return false;
		};

		var f1 = this.gui.addFolder('GLOBAL');
		var f2 = this.gui.addFolder('PERLIN');
		var f3 = this.gui.addFolder('MODULUS');

		TERRAIN.Sliders.speed = f1.add(TERRAIN.Params, 'speed', -.2, .2).step(0.0005).name('speed');
		TERRAIN.Sliders.speed = f1.add(TERRAIN.Params, 'isDebugging').name('debug');

		TERRAIN.Sliders.boxHeight = f1.add(TERRAIN.Params, 'boxHeight', 0.0, 100.0).step(0.0005).name('boxHeight');

		TERRAIN.Sliders.perlinSpeed = f2.add(TERRAIN.Params, 'perlinSpeed', -.4, .4).step(0.0005).name('speed');
		TERRAIN.Sliders.perlinResolution = f2.add(TERRAIN.Params, 'perlinResolution', 0.0, 0.4).step(0.0005).name('resolution');

		TERRAIN.Sliders.modulusIncrement = f3.add(TERRAIN.Params, 'modulusIncrement', 0, 10).step(1).name('increment');


		this.gui.add(TERRAIN.Params, 'saveSTL').name('saveSTL');
		this.gui.add(TERRAIN.Params, 'createBlankArray').name('createBlankArray');

		TERRAIN.Sliders.speed.onChange(function(value) { TERRAIN.Params.updateValues(); });

		f1.open();
		f2.open();
		f3.open();


		this.guiContainer = document.getElementById('guiContainer');
		this.guiContainer.appendChild(this.gui.domElement);

		return this;

	};

	this.createListeners = function(arg){

		return this;

	};


	this.toggleView = function() {
		trace("toggleView");
		this.dispatchEvent("TOGGLE_VIEW",[]);
		return this;
	};


	this.randomizeTotalNumbers = function() {
		trace("randomizeTotalNumbers");
		window.location.href=window.location.pathname + "?totalWidth=" +((Math.random()*20)|0 + 2)+ "&totalDepth=" + ((Math.random()*20)|0 + 2);
		return this;
	};
	
	this.set3DScope = function(arg) {
		this.scope3d = arg;
		return this;
	};

};

TERRAIN.Params.prototype = new UNCTRL.BoilerPlate();
TERRAIN.Params.prototype.constructor = TERRAIN.Params;