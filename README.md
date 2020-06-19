# LST #

LST, short for Layer Space Transforms, is a utility class for Adobe After Effects, that helps calculating layers position in composition scope, very similar to `toWorld()` and `toComp()` methods available inside expressions.

## API ##

* `LST.toComp(layer, offset);` Transforms a point from layer scope into composition scope.
* `LST.toWorld(layer, offset);` Transforms a point from layer scope into view-independent world scope.

## Usage ##

Download the repository and include the class in your main script.
```javascript
// Include the class
#include 'LST.js'
```

### Case 1 ###

```javascript
// Get layers position in composition scope
LST.toComp(layer);
```

### Case 2 ###

```javascript
// Get layers top-left point coordinate in composition scope
LST.toComp(layer, [0, 0, 0]);
```

### Case 3 ###

```javascript
// Get layers position in composition scope and ignore active composition camera
LST.toWorld(layer);
```
---

## Notes ##

There's a slight Z-position error (0.0 <= 0.3) when running `toComp()` method on a 3D layer in the composition with a camera. I wasn't able to find a more robust way to calculate a projected Z position, sorry.

LST assumes that the default **FILM SIZE** value is **36.00mm**, as there's no API in After Effects to retrieve this value. Also, when processing a 3D layer inside a composition that contains no active camera, the **FOCAL LENGTH** defaults to **50.00mm** (again, lack of API on AE's side).

---

## Todo ##
* `fromComp()`: Transform a point from composition scope inco layer scope. 
* `fromWorld()`: Transform a point from world space to layer space.

---

## Resources ##
* Three.js: https://github.com/mrdoob/three.js
* Interactive 3D Graphics course on Udacity: https://classroom.udacity.com/courses/cs291
* ModelViewProjection live demo: http://www.realtimerendering.com/udacity/transforms.html
* Foundations of 3D Rendering on Scratchapixel 2.0: https://www.scratchapixel.com/
* 3D Game Engine Programming: https://www.3dgep.com/understanding-the-view-matrix/
* World, View and Projection Transformation Matrices on Codinglabs: http://www.codinglabs.net/article_world_view_projection_matrix.aspx