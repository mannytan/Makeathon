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
			perlinSpeed: 0.125,
			perlinHeight: 20,
			perlinSize: 0.125,
			delay: 0.150,
			facetRadius: 100,
			facetHeight: 200,
			facetWrap: .5001,
			facetDepthSize: 10,
			facetVerticalOffset: -.5001,
			facetVerticalSize: 0.0,
			isDebugging: true,
			saveSTL: function(){
				scope.scope3d.convertMesh();
			},
			randomize: function(){
				scope.scope3d.randomizeElements();
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

		TERRAIN.Sliders.speed = f1.add(TERRAIN.Params, 'speed', -.2, .2).step(0.0005).name('speed');
		TERRAIN.Sliders.perlinSpeed = f1.add(TERRAIN.Params, 'perlinSpeed', -.2, .2).step(0.0005).name('perlinSpeed');
		TERRAIN.Sliders.perlinHeight = f1.add(TERRAIN.Params, 'perlinHeight', 0.0, 200.0).step(0.0005).name('perlinHeight');
		TERRAIN.Sliders.perlinSize = f1.add(TERRAIN.Params, 'perlinSize', 0.0, 0.2).step(0.0005).name('perlinSize');
		TERRAIN.Sliders.facetRadius = f1.add(TERRAIN.Params, 'facetRadius', 0, 200).step(1).name('facet Radius');
		TERRAIN.Sliders.facetHeight = f1.add(TERRAIN.Params, 'facetHeight', 0, 300).step(1).name('facet Height');
		TERRAIN.Sliders.facetWrap = f1.add(TERRAIN.Params, 'facetWrap', 0, 1.0).step(0.0005).name('facet Wrap');
		TERRAIN.Sliders.facetDepthSize = f1.add(TERRAIN.Params, 'facetDepthSize', 0.0, 100.0).step(1).name('facet depth');
		TERRAIN.Sliders.facetVerticalOffset = f1.add(TERRAIN.Params, 'facetVerticalSize', 0.0, 1.0).step(0.0005).name('facet size');
		this.gui.add(TERRAIN.Params, 'randomize').name('randomize');
		this.gui.add(TERRAIN.Params, 'orderize').name('orderize');
		this.gui.add(TERRAIN.Params, 'saveSTL').name('saveSTL');

		TERRAIN.Sliders.speed.onChange(function(value) { TERRAIN.Params.updateValues(); });
		TERRAIN.Sliders.facetRadius.onChange(function(value) { TERRAIN.Params.updateValues(); });
		TERRAIN.Sliders.facetHeight.onChange(function(value) { TERRAIN.Params.updateValues(); });
		TERRAIN.Sliders.facetWrap.onChange(function(value) { TERRAIN.Params.updateValues(); });
		TERRAIN.Sliders.facetDepthSize.onChange(function(value) { TERRAIN.Params.updateValues(); });
		TERRAIN.Sliders.facetVerticalOffset.onChange(function(value) { TERRAIN.Params.updateValues(); });

		f1.open();


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