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

		// noise
		this.perlin = new SimplexNoise();
		this.noiseCount = 0;

		// values "should" be between 0.0 and 1.0
		this.yHeight = [
			0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 
			0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 
			0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 
			0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 
			0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 
		]; 

		this.superInit.call(this);
	}


	this.update = function() {

		var i;
		var x,y,z;
		var total = this.totalXIncrements * this.totalZIncrements;
		var totalX = this.totalXIncrements;
		var totalZ = this.totalZIncrements;

		/*
		// checkerboard
		for(i = 0; i < total; i++){
			z = parseInt(i/totalX);
			x = i%totalX;
			y = ( i % TERRAIN.Params.modulusIncrement == 0) ? 1 : 0;
			this.yHeight[i] = y;
		}
		*/ 
		/*
		// perlin
		var perlinResolution = TERRAIN.Params.perlinResolution;
		var speed = this.noiseCount * 0.05;
		this.noiseCount += TERRAIN.Params.perlinSpeed;
		for(i = 0;i <total; i++){
			z = parseInt(i/totalX);
			x = i%totalX;
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
