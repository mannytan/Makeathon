/**
 * Created by unctrl.com
 * User: mannytan
 * Date: 8/22/11
 */

var UNCTRL = UNCTRL || {};

UNCTRL.BoilerPlate = function () {
	var scope = this;
	this._events = {};
	this.name = "BoilerPlate";
	// trace("BoilerPlate")

	this.traceFunction = function() {
		var args = Array.prototype.slice.call(arguments);
		var func = args.shift();
		trace(this.name + "." + func + "(" + args + ");");
	};

	/*
	* event listener model
	* this.removeEventListener("SOME_EVENT",function);
	* this.addEventListener("SOME_EVENT",function);
	* this.dispatchEvent("SOME_EVENT",[arg1,arg2]);
	*/
	this.removeEventListener = function(eventName, callback) {
		var events = this._events,
				callbacks = events[eventName] = events[eventName] || [];
		callbacks.pop(callback);
		return this;
	};

	this.addEventListener = function(eventName, callback) {
		var events = this._events,
				callbacks = events[eventName] = events[eventName] || [];
		callbacks.push(callback);
		return this;
	};

	this.dispatchEvent = function(eventName, args) {
		var callbacks = this._events[eventName];
		for (var i = 0, l = callbacks.length; i < l; i++) {
			callbacks[i].apply(null, args);
		}
		
		return this;
	};

};


UNCTRL.prototype = new UNCTRL.BoilerPlate();
UNCTRL.prototype.constructor = UNCTRL.BoilerPlate;