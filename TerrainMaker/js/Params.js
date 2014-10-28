/**
 * Created by unctrl.com
 * User: mannytan
 * Date: 03/20/12
 */

var FACETER = FACETER || {};

FACETER.Params = {};
FACETER.Sliders = {};

FACETER.Params = function(name) {
	var scope = this;

	UNCTRL.BoilerPlate.call(this);

	this.name = 'Params';
	this.scope3d = null;

	this.init = function() {
		this.traceFunction("init");
		return this;
	};

	this.createGui = function() {

		FACETER.Params = {
			orbitSpeed: 0.0000,
			guiWidth: 300,
			speed: 0.125,
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
			addParticle: function(){
				scope.scope3d.addParticle();
			},
			randomize: function(){
				scope.scope3d.randomizeElements();
			},
			orderize: function(){
				scope.scope3d.orderizeElements();
			}
			
		};

		this.gui = new dat.GUI({
			width: FACETER.Params.guiWidth,
		});

		this.guiContainer = this.gui.domElement;
		this.guiContainer.onselectStart = function() {
			return false;
		};


		var f1 = this.gui.addFolder('GLOBAL');

		FACETER.Sliders.speed = f1.add(FACETER.Params, 'speed', -.2, .2).step(0.0005).name('speed');
		FACETER.Sliders.facetRadius = f1.add(FACETER.Params, 'facetRadius', 0, 200).step(1).name('facet Radius');
		FACETER.Sliders.facetHeight = f1.add(FACETER.Params, 'facetHeight', 0, 300).step(1).name('facet Height');
		FACETER.Sliders.facetWrap = f1.add(FACETER.Params, 'facetWrap', 0, 1.0).step(0.0005).name('facet Wrap');
		FACETER.Sliders.facetDepthSize = f1.add(FACETER.Params, 'facetDepthSize', -50.0, 50.0).step(1).name('facet depth');
		FACETER.Sliders.facetVerticalOffset = f1.add(FACETER.Params, 'facetVerticalSize', 0.0, 1.0).step(0.0005).name('facet size');
		this.gui.add(FACETER.Params, 'addParticle').name('addParticle');
		this.gui.add(FACETER.Params, 'randomize').name('randomize');
		this.gui.add(FACETER.Params, 'orderize').name('orderize');
		this.gui.add(FACETER.Params, 'saveSTL').name('saveSTL');

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

FACETER.Params.prototype = new UNCTRL.BoilerPlate();
FACETER.Params.prototype.constructor = FACETER.Params;