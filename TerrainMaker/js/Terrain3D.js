/**
 * Created by unctrl.com
 * User: mannytan
 */

TERRAIN.Terrain3D = function(parent) {
	var scope = this;
    this.parent.constructor.call(this);

    this.superInit = this.init;
    this.superUpdate = this.update;
	this.name = 'Terrain3D';

	this.init = function() {

		this.blockHeight = 4;
		this.blockWidth = 120;
		this.blockDepth = 100;
		this.totalXIncrements = 6;
		this.totalZIncrements = 5;

		// --------------------------------------------------------
		// blank
		// --------------------------------------------------------
		// values "should" be between 0.0 and 1.0
		this.yHeight = [
			0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 
			0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 
			0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 
			0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 
			0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 
		]; 

		// --------------------------------------------------------
		// randomizer
		// --------------------------------------------------------
		var i;
		var x,y,z;
		var total = this.totalXIncrements * this.totalZIncrements;
		for(i = 0; i < total; i++){
			z = parseInt(i/this.totalXIncrements);
			x = i%this.totalXIncrements;
			y = Math.random();
			this.yHeight[i] = y;
		}

		this.superInit.call(this);	
	}

	this.update = function() {

		var i;
		var x,y,z;
		var total = this.totalXIncrements * this.totalZIncrements;

		/*
		// --------------------------------------------------------
		// randomizer
		// --------------------------------------------------------
		for(i = 0; i < total; i++){
			z = parseInt(i/this.totalXIncrements);
			x = i%this.totalXIncrements;
			y = Math.random();
			this.yHeight[i] = y;
		}
		*/

		/*
		// --------------------------------------------------------
		// checkerboard
		// --------------------------------------------------------
		for(i = 0; i < total; i++){
			z = parseInt(i/this.totalXIncrements);
			x = i%this.totalXIncrements;
			y = ( i % TERRAIN.Params.modulusIncrement == 0) ? 1 : 0;
			this.yHeight[i] = y;
		}
		*/ 
		
		/*
		// --------------------------------------------------------
		// perlin
		// --------------------------------------------------------
		if(!this.perlin) {
			this.perlin = new SimplexNoise();
			this.noiseCount = 0;
		}
		this.noiseCount += TERRAIN.Params.perlinSpeed;
		var perlinResolution = TERRAIN.Params.perlinResolution;
		var speed = this.noiseCount * 0.05;
		for(i = 0;i <total; i++){
			z = parseInt(i/this.totalXIncrements);
			x = i%this.totalXIncrements;
			y = this.perlin.noise((x*(perlinResolution) + speed),(z*(perlinResolution) + speed));
			y =  y*0.5 + 0.5;
			this.yHeight[i] = y;
		}
		*/

		this.superUpdate.call(this);
	}
};

TERRAIN.Terrain3D.prototype = Object.create(TERRAIN.BoilerPlate3D.prototype);
TERRAIN.Terrain3D.prototype.constructor = TERRAIN.Terrain3D;
TERRAIN.Terrain3D.prototype.parent = TERRAIN.BoilerPlate3D.prototype;
