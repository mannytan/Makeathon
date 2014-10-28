/**
 * Created by unctrl.com
 * User: mannytan
 */


FACETER.Terrain3D = function(name) {
	var scope = this;

	FACETER.Faceter3D.call(this);

	this.name = 'Terrain3D';

	this.init = function() {
		this.traceFunction("init");

		return this;
	}

};

FACETER.Terrain3D.prototype = new FACETER.Terrain3D();
FACETER.Terrain3D.prototype.constructor = FACETER.Faceter3D;