/**
 * Created by unctrl.com
 * User: mannytan
 */


TERRAIN.Terrain3D = function(parent) {
	var scope = this;

    this.parent.constructor.call(this);
    this.superInit = this.init;

	this.name = 'Terrain3D';

	this.init = function() {
		this.blockHeight = 2;
		this.blockWidth = 200;
		this.blockDepth = 200;

		this.totalXIncrements = 50;
		this.totalYIncrements = 50;
		this.totalParticles = this.totalXIncrements * this.totalYIncrements;
		this.zHeight = [
			0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.0,
			0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
			0.0, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.0,
			0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
			0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.0,
			0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
			0.0, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.0,
			0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
			0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.0,
			0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
		];

		this.superInit.call(this);
	}

};

TERRAIN.Terrain3D.prototype = Object.create(TERRAIN.BoilerPlate3D.prototype);
TERRAIN.Terrain3D.prototype.constructor = TERRAIN.Terrain3D;
TERRAIN.Terrain3D.prototype.parent = TERRAIN.BoilerPlate3D.prototype;
