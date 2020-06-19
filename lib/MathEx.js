var MathEx = (function() {
	var module = {};

	module.getAOV = function(filmSize, focalLength) {
		return 2 * Math.atan(filmSize / (2 * focalLength));
	};

	return module;
})();