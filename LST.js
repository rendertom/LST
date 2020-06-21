var LST = (function() {
	// @include 'lib/CameraEx.js'
	// @include 'lib/CompositionEx.js'
	// @include 'lib/LayerEx.js'
	// @include 'lib/MathEx.js'
	// @include 'lib/Matrix.js'
	// @include 'lib/Trig.js'
	// @include 'lib/Vector3.js'


	var module = {};
	/**
	 * Transforms a point from layer scope into composition scope.
	 * @param  {LayerObject}    layer     Layer
	 * @param  {Array}          offset    Point coordinates, optional. Defaults to layers anchor point value.
	 * @return {Array}                    Points coordinates in composition scope.
	 */
	module.toComp = function(layer, offset) {
		offset = fixOffset(layer, offset);

		var result;
		if (!layer.threeDLayer) {
			result = toComp2D(layer, offset);
			result.pop();
		} else {
			result = toComp3D(layer, offset);
		}

		return result;
	};

	/**
	 * Transforms a point from layer scope into view-independent world scope.
	 * @param  {LayerObject}    layer     Layer
	 * @param  {Array}          offset    Point coordinates, optional. Defaults to layers anchor point value.
	 * @return {Array}                    Points coordinates in view-independent world scope.
	 */
	module.toWorld = function(layer, offset) {
		offset = fixOffset(layer, offset);

		var modelMatrix = getModelMatrix(layer, offset);
		var result = Matrix.getTranslate(modelMatrix);
		result[2] *= -1;

		if (!layer.threeDLayer) {
			result.pop();
		}

		return result;
	};

	return module;



	function fixOffset(layer, offset) {
		var property, value;

		if (typeof offset === 'undefined') {
			offset = [0, 0, 0];
		} else {
			property = layer.property('ADBE Transform Group').property('ADBE Anchor Point');
			value = property.value;

			value[2] *= -1;
			offset -= value;
		}

		return offset;
	}

	function getAOV(composition) {
		var camera = composition.activeCamera;
		if (camera && camera.enabled) {
			return CameraEx.getAOV(camera);
		} else {
			return CompositionEx.getAOV();
		}
	}
	
	function getModelMatrix(layer, offset) {
		var layerLocalMatrix = LayerEx.getLocalMatrix(layer);
		var layerWorldMatrix = LayerEx.getWorldMatrix(layer);
		var offsetMatrix = getOffsetMatrix(offset);

		var modelMatrix = Matrix.multiplyArrayOfMatrices([
			layerWorldMatrix,
			layerLocalMatrix,
			offsetMatrix
		]);

		return modelMatrix;
	}

	function getOffsetMatrix(offset) {
		var matrix = Matrix.getIdentity();
		if (typeof offset !== 'undefined') {
			matrix = Matrix.translate(matrix, offset[0], offset[1], offset[2]);
		}

		return matrix;
	}

	function getProjectedZ(composition) {
		var camera, z;

		camera = composition.activeCamera;
		if (camera && camera.enabled) {
			z = CameraEx.getProjectedZ(camera);
		} else {
			z = CompositionEx.getProjectedZ(composition);
		}

		return z;
	}

	function getProjectionMatrix(composition) {
		var projectionMatrix = Matrix.perspective(
			getAOV(composition),
			composition.width / composition.height,
			0.1, 10000
		);

		return projectionMatrix;
	}

	function getViewMatrix(composition) {
		var camera, viewMatrix;

		camera = composition.activeCamera;
		if (camera && camera.enabled) {
			viewMatrix = CameraEx.getViewMatrix(camera);
		} else {
			viewMatrix = CompositionEx.getViewMatrix(composition);
		}

		return viewMatrix;
	}

	function toComp2D(layer, offset) {
		var modelMatrix = getModelMatrix(layer, offset);
		return Matrix.getTranslate(modelMatrix);
	}

	function toComp3D(layer, offset) {
		var modelMatrix = getModelMatrix(layer, offset);
		var viewMatrix = getViewMatrix(layer.containingComp);
		var projectionMatrix = getProjectionMatrix(layer.containingComp);

		var mvp = Matrix.multiplyArrayOfMatrices([
			projectionMatrix,
			Matrix.invert(viewMatrix),
			modelMatrix,
		]);

		return toScreenCoordinates(mvp, layer.containingComp);
	}

	function toScreenCoordinates(mvp, composition) {
		var ndc, x, y, z, w;

		w = mvp[15];
		ndc = Matrix.getTranslate(mvp) / w;

		x = (ndc[0] + 1) * composition.width / 2;
		y = (ndc[1] + 1) * composition.height / 2;
		z = getProjectedZ(composition);

		return [x, y, z];
	}
})();