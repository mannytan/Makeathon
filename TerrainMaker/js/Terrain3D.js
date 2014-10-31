/**
 * Created by unctrl.com
 * User: mannytan
 */


FACETER.Terrain3D = function(parent) {
	var scope = this;

    this.parent.constructor.call(this);
    this.superInit = this.init;

	this.name = 'Terrain3D';

	this.init = function() {
		this.blockHeight = 2;
		this.blockWidth = 30;
		this.blockDepth = 30;

		this.totalXIncrements = 20;
		this.totalYIncrements = 10;
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

		this.displayBlankArray();

		this.superInit.call(this);
	}

	this.displayBlankArray = function() {
		var str = "";
		str = str.concat("this.zHeight = [\n");

		for (var i = 0; i<this.totalYIncrements; i++){
			str = str.concat("\t");
			for (var j = 0; j<this.totalXIncrements; j++){
				str = str.concat("0.0, ");
			}
			str = str.concat("\n");
		}

		str = str.concat("];");
		console.log(str);
	}


};

FACETER.Terrain3D.prototype = Object.create(FACETER.BoilerPlate3D.prototype);
FACETER.Terrain3D.prototype.constructor = FACETER.Terrain3D;
FACETER.Terrain3D.prototype.parent = FACETER.BoilerPlate3D.prototype;
