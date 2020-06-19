var CompositionEx = (function() {
	var FILM_SIZE = 36;
	var FOCAL_LENGTH = 50;


	var module = {};

	module.getAOV = function() {
		return MathEx.getAOV(FILM_SIZE, FOCAL_LENGTH);
	};

	module.getProjectedZ = function(composition) {
		var z, zoom;

		zoom = getZoom(composition);
		z = zoom - (zoom / zoom);

		return z;
	};

	module.getViewMatrix = function(composition) {
		var viewMatrix, zoom;

		zoom = getZoom(composition);

		viewMatrix = Matrix.getIdentity();
		viewMatrix = Matrix.translate(viewMatrix,
			composition.width / 2,
			composition.height / 2,
			zoom
		);

		return viewMatrix;
	};

	return module;

	function getZoom(composition) {
		var filmSize, zoom;

		filmSize = composition.height;
		zoom = filmSize * FOCAL_LENGTH / FILM_SIZE;

		return zoom;
	}
})();