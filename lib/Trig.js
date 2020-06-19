var Trig = (function() {
	var module = {};

	module.radiansToDegrees = function(radians) {
		return radians * 180 / Math.PI;
	};

	module.degreesToRadians = function(degrees) {
		return degrees * Math.PI / 180;
	};

	return module;
})();