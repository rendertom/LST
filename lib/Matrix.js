// Most of the methods are adopted from THREE.js
// https://github.com/mrdoob/three.js/tree/master/src

var Matrix = (function() {

	var module = {};

	module.decompose = function(matrix) {
		var result = {
			rotation: module.getRotation(matrix),
			scale: module.getScale(matrix),
			translate: module.getTranslate(matrix),
		};

		return result;
	};

	module.getIdentity = function() {
		var identity = [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];

		return identity;
	};

	module.getRotation = function(matrix) {
		var scale = module.getScale(matrix);
		var sX = scale[0];
		var sY = scale[1];
		var sZ = scale[2];

		// https://community.khronos.org/t/is-it-possible-to-extract-rotation-translation-scale-given-a-matrix/49221/4
		var sinPitch = -matrix[8] / sX;
		var sinRoll = -matrix[6] / sZ;
		var cosRoll = matrix[5] / sY;
		var sinYaw = 0;
		var cosYaw = 1;

		var cosPitch = Math.sqrt(1 - sinPitch * sinPitch);
		if (Math.abs(cosPitch) > 1e-6) {
			sinRoll = (matrix[9] / sY) / cosPitch;
			cosRoll = (matrix[10] / sZ) / cosPitch;
			sinYaw = (matrix[4] / sX) / cosPitch;
			cosYaw = (matrix[0] / sX) / cosPitch;
		}

		var x = Math.atan2(sinRoll, cosRoll);
		var y = Math.atan2(sinPitch, cosPitch);
		var z = Math.atan2(sinYaw, cosYaw);

		return [
			Trig.radiansToDegrees(x),
			Trig.radiansToDegrees(y),
			Trig.radiansToDegrees(z),
		];
	};

	module.getScale = function(matrix) {
		var x, y, z;

		x = Math.sqrt(matrix[0] * matrix[0] + matrix[4] * matrix[4] + matrix[8] * matrix[8]);
		y = Math.sqrt(matrix[1] * matrix[1] + matrix[5] * matrix[5] + matrix[9] * matrix[9]);
		z = Math.sqrt(matrix[2] * matrix[2] + matrix[6] * matrix[6] + matrix[10] * matrix[10]);

		return [x, y, z];
	};

	module.getTranslate = function(matrix) {
		var x, y, z;

		x = matrix[3];
		y = matrix[7];
		z = matrix[11];

		return [x, y, z];
	};

	module.invert = function(matrix) {
		// Adapted from: https://github.com/mrdoob/three.js/blob/master/src/math/Matrix4.js
		var result = [];

		var n11 = matrix[0],
			n12 = matrix[4],
			n13 = matrix[8],
			n14 = matrix[12];
		var n21 = matrix[1],
			n22 = matrix[5],
			n23 = matrix[9],
			n24 = matrix[13];
		var n31 = matrix[2],
			n32 = matrix[6],
			n33 = matrix[10],
			n34 = matrix[14];
		var n41 = matrix[3],
			n42 = matrix[7],
			n43 = matrix[11],
			n44 = matrix[15];

		result[0] = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
		result[4] = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
		result[8] = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
		result[12] = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
		result[1] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
		result[5] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
		result[9] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
		result[13] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
		result[2] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
		result[6] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
		result[10] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
		result[14] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
		result[3] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
		result[7] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
		result[11] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
		result[15] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;

		var determinant = n11 * result[0] + n21 * result[4] + n31 * result[8] + n41 * result[12];

		if (determinant === 0) {
			throw new Error('Can\'t invert matrix, determinant is 0');
		}

		for (var i = 0, il = result.length; i < il; i++) {
			result[i] /= determinant;
		}

		return result;
	};

	module.lookAt = function(eye, target, up) {
		var result, x, y, z;

		z = Vector3.subVectors(eye, target);
		if (Vector3.lengthSq(z) === 0) {
			// eye and target are in the same position
			z[2] = 1;
		}

		z = Vector3.normalize(z);

		x = Vector3.crossVectors(up, z);
		if (Vector3.lengthSq(x) === 0) {
			// up and z are parallel
			if (Math.abs(up.z) === 1) {
				z[0] += 0.0001;
			} else {
				z[2] += 0.0001;
			}

			z = Vector3.normalize(z);
			x = Vector3.crossVectors(up, z);
		}

		x = Vector3.normalize(x);
		y = Vector3.crossVectors(z, x);

		result = module.getIdentity();
		result[0] = x[0];
		result[4] = y[0];
		result[8] = z[0];
		result[1] = x[1];
		result[5] = y[1];
		result[9] = z[1];
		result[2] = x[2];
		result[6] = y[2];
		result[10] = z[2];

		return result;
	};

	module.multiplyArrayOfMatrices = function(matrices) {
		var result = matrices[0];
		for (var i = 1, il = matrices.length; i < il; i++) {
			result = module.multiplyMatrices(result, matrices[i]);
		}

		return result;
	};

	module.multiplyMatrices = function(a, b) {
		var result = [
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0
		];

		result[0] = a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12];
		result[1] = a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13];
		result[2] = a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14];
		result[3] = a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15];

		result[4] = a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12];
		result[5] = a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13];
		result[6] = a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14];
		result[7] = a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15];

		result[8] = a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12];
		result[9] = a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13];
		result[10] = a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14];
		result[11] = a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15];

		result[12] = a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12];
		result[13] = a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13];
		result[14] = a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14];
		result[15] = a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15];

		return result;
	};

	module.perspective = function(fovy, aspect, near, far) {
		var f = 1 / Math.tan(fovy / 2);
		var nf = 1 / (near - far);

		var result = [
			f / aspect, 0, 0, 0,
			0, f, 0, 0,
			0, 0, (far + near) * nf, 2 * far * near * nf,
			0, 0, -1, 0
		];

		return result;
	};

	module.rotateX = function(matrix, theta) {
		var rotationXmatrix = [
			1, 0, 0, 0,
			0, Math.cos(theta), -Math.sin(theta), 0,
			0, Math.sin(theta), Math.cos(theta), 0,
			0, 0, 0, 1
		];

		return module.multiplyMatrices(rotationXmatrix, matrix);
	};

	module.rotateY = function(matrix, theta) {
		var rotationYmatrix = [
			Math.cos(theta), 0, Math.sin(theta), 0,
			0, 1, 0, 0, -Math.sin(theta), 0, Math.cos(theta), 0,
			0, 0, 0, 1
		];

		return module.multiplyMatrices(rotationYmatrix, matrix);
	};

	module.rotateZ = function(matrix, theta) {
		var rotationZmatrix = [
			Math.cos(theta), -Math.sin(theta), 0, 0,
			Math.sin(theta), Math.cos(theta), 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];

		return module.multiplyMatrices(rotationZmatrix, matrix);
	};

	module.scale = function(matrix, x, y, z) {
		var scaleMatrix = [
			x, 0, 0, 0,
			0, y, 0, 0,
			0, 0, z, 0,
			0, 0, 0, 1
		];

		return module.multiplyMatrices(scaleMatrix, matrix);
	};

	module.skew = function(matrix, thetaX, thetaY) {
		var skewMatrix = [
			1, Math.tan(thetaX), 0, 0,
			Math.tan(thetaY), 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];

		return module.multiplyMatrices(skewMatrix, matrix);
	};

	module.translate = function(matrix, x, y, z) {
		var translateMatrix = [
			1, 0, 0, x,
			0, 1, 0, y,
			0, 0, 1, z,
			0, 0, 0, 1
		];

		return module.multiplyMatrices(translateMatrix, matrix);
	};

	return module;
})();