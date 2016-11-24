/**
 * @author mrdoob / http://mrdoob.com/
 * @author schteppe / https://github.com/schteppe
 */
 var PointerLockControls = function ( camera, cannonBody ) {

    var eyeYPos = 2; // eyes are 2 meters above the ground
    var velocityFactor = 0.2;
    var jumpVelocity = 20;
    var scope = this;

    var pitchObject = new THREE.Object3D();
    pitchObject.add( camera );

    var yawObject = new THREE.Object3D();
    yawObject.position.y = 2;
    yawObject.add( pitchObject );

    var quat = new THREE.Quaternion();

    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;

    var canJump = false;

    var contactNormal = new CANNON.Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
    var upAxis = new CANNON.Vec3(0,1,0);
    cannonBody.addEventListener("collide",function(e){
        var contact = e.contact;

        // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
        // We do not yet know which one is which! Let's check.
        if(contact.bi.id == cannonBody.id)  // bi is the player body, flip the contact normal
            contact.ni.negate(contactNormal);
        else
            contactNormal.copy(contact.ni); // bi is something else. Keep the normal as it is

        // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
        if(contactNormal.dot(upAxis) > 0.5) // Use a "good" threshold value between 0 and 1 here!
            canJump = true;
    });

    var velocity = cannonBody.velocity;

    var PI_2 = Math.PI / 2;

    var onMouseMove = function ( event ) {

        if ( scope.enabled === false ) return;

        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        yawObject.rotation.y -= movementX * 0.002;
        pitchObject.rotation.x -= movementY * 0.002;

        pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
    };

    var onKeyDown = function ( event ) {

        switch ( event.keyCode ) {

            case 38: // up
            case 87: // w
                moveForward = true;
                break;

            case 37: // left
            case 65: // a
                moveLeft = true; break;

            case 40: // down
            case 83: // s
                moveBackward = true;
                break;

            case 39: // right
            case 68: // d
                moveRight = true;
                break;

            case 32: // space
                if ( canJump === true ){
                    velocity.y = jumpVelocity;
                }
                canJump = false;
                break;
        }

    };

    var onKeyUp = function ( event ) {

        switch( event.keyCode ) {

            case 38: // up
            case 87: // w
                moveForward = false;
                break;

            case 37: // left
            case 65: // a
                moveLeft = false;
                break;

            case 40: // down
            case 83: // a
                moveBackward = false;
                break;

            case 39: // right
            case 68: // d
                moveRight = false;
                break;

        }

    };

    document.addEventListener( 'mousemove', onMouseMove, false );
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

    this.enabled = false;

    this.getObject = function () {
        return yawObject;
    };

    this.getDirection = function(targetVec){
        targetVec.set(0,0,-1);
        quat.multiplyVector3(targetVec);
    }

    // Moves the camera to the Cannon.js object position and adds velocity to the object if the run key is down
    var inputVelocity = new THREE.Vector3();
    var euler = new THREE.Euler();
    this.update = function ( delta ) {

        if ( scope.enabled === false ) return;

        delta *= 0.1;

        inputVelocity.set(0,0,0);

        if ( moveForward ){
            inputVelocity.z = -velocityFactor * delta;
        }
        if ( moveBackward ){
            inputVelocity.z = velocityFactor * delta;
        }

        if ( moveLeft ){
            inputVelocity.x = -velocityFactor * delta;
        }
        if ( moveRight ){
            inputVelocity.x = velocityFactor * delta;
        }

        // Convert velocity to world coordinates
        euler.x = pitchObject.rotation.x;
        euler.y = yawObject.rotation.y;
        euler.order = "XYZ";
        quat.setFromEuler(euler);
        inputVelocity.applyQuaternion(quat);
        //quat.multiplyVector3(inputVelocity);

        // Add to the object
        velocity.x += inputVelocity.x;
        velocity.z += inputVelocity.z;

        yawObject.position.copy(cannonBody.position);
    };
};

//########################
// code start

var density = 2515;

var map = [ // 1  2  3  4  5  6  7  8  9
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1,],
	[1, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3,1,],
	[1, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3,1,],
	[1, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 1, 1, 1, 3, 3,1,],
	[1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3,1,],
	[1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3,1,],
	[1, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 1, 3, 3, 3, 3,1,],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 1, 3, 3, 3, 3,1,],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1,1,],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0,1,],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0,1,],
	[1, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 2, 0, 0, 0, 0, 0,1,],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 2, 2, 0, 0, 0,1,],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0,1,],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0,1,],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 2, 2, 2, 2,1,],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0,1,],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0,1,],
	[1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,1,],
	[1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,1,],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1,],
], mapW = map.length, mapH = map[0].length;



var sphereShape, sphereBody;
var world;
var physicsMaterial, groundMaterial;
var groundShape, groundBody;
var walls=[], balls=[], ballMeshes=[], boxes=[], boxMeshes=[];

var camera, scene, renderer;
var geometry, material, mesh;
var controls,time = Date.now();

var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if ( havePointerLock ) {

	var element = document.body;

	var pointerlockchange = function ( event ) {

		if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

			controls.enabled = true;

			blocker.style.display = 'none';

		} else {

			controls.enabled = false;

			blocker.style.display = '-webkit-box';
			blocker.style.display = '-moz-box';
			blocker.style.display = 'box';

			instructions.style.display = '';

		}

	}

	var pointerlockerror = function ( event ) {
		instructions.style.display = '';
	}

	// Hook pointer lock state change events
	document.addEventListener( 'pointerlockchange', pointerlockchange, false );
	document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
	document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

	document.addEventListener( 'pointerlockerror', pointerlockerror, false );
	document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
	document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

	instructions.addEventListener( 'click', function ( event ) {
		instructions.style.display = 'none';

		// Ask the browser to lock the pointer
		element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

		if ( /Firefox/i.test( navigator.userAgent ) ) {

			var fullscreenchange = function ( event ) {

				if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

					document.removeEventListener( 'fullscreenchange', fullscreenchange );
					document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

					element.requestPointerLock();
				}

			}

			document.addEventListener( 'fullscreenchange', fullscreenchange, false );
			document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

			element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

			element.requestFullscreen();

		} else {

			element.requestPointerLock();

		}

	}, false );

} else {

	instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

}

initCannon();
init();
animate();

function initCannon(){
	// Setup our world
	world = new CANNON.World();
	world.quatNormalizeSkip = 0;
	world.quatNormalizeFast = false;

	var solver = new CANNON.GSSolver();

	world.defaultContactMaterial.contactEquationStiffness = 1e9;
	world.defaultContactMaterial.contactEquationRelaxation = 4;

	solver.iterations = 20;
	solver.tolerance = 0;
	var split = true;
	if(split)
		world.solver = new CANNON.SplitSolver(solver);
	else
		world.solver = solver;

	world.gravity.set(0,-55,0);
	world.broadphase = new CANNON.NaiveBroadphase();

	// Create a slippery material (friction coefficient = 0.0)
	physicsMaterial = new CANNON.Material("slipperyMaterial");
	var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
															physicsMaterial,
															0.0, // friction coefficient
															0.3  // restitution
															);
	// We must add the contact materials to the world
	world.addContactMaterial(physicsContactMaterial);

	groundMaterial = new CANNON.Material("groundMaterial");
	var ground_material = new CANNON.ContactMaterial(groundMaterial, groundMaterial,
		{
			friction: 1.0,
			restitution: 0.0,
			contactEquationStiffness: 1e8,
			contactEquationRelaxation: 3,
			frictionEquationStiffness: 1e8,
			frictionEquationRegularizationTime: 3,
		});

	world.addContactMaterial(ground_material);

	// Create a sphere
	
	var mass = 5, radius = 1.3;
	sphereShape = new CANNON.Sphere(radius);
	sphereBody = new CANNON.Body({
		mass: mass,
		material: groundMaterial,
		linearFactor: new CANNON.Vec3(0,0,0),
		angularFactor: new CANNON.Vec3(0,0,0)
	});
	sphereBody.addShape(sphereShape);
	sphereBody.position.set(0,5,0);
	sphereBody.linearDamping = 0.9;
	world.add(sphereBody);

	// Create a plane
	groundShape = new CANNON.Plane();
	groundBody = new CANNON.Body({ mass: 0, material: groundMaterial });
	groundBody.addShape(groundShape);
	groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
	world.add(groundBody);
}

function init() {

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );

	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x000000, 0, 500 );

	/*var ambient = new THREE.AmbientLight( 0x111111 );
	scene.add( ambient );*/

    // light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    // light.position.set(0.5, 1, 0.75);
    // scene.add(light);
	
	light = new THREE.SpotLight( 0xffffff );
	light.position.set( 10, 30, 20 );
	light.target.position.set( 0, 0, 0 );
	if(true){
		light.castShadow = true;

		light.shadow.camera.near = 20;
		light.shadow.camera.far = 50;//camera.far;
		light.shadow.camera.fov = 40;

		light.shadowMapBias = 0.1;
		light.shadowMapDarkness = 0.7;
		light.shadow.mapSize.width = 2*512;
		light.shadow.mapSize.height = 2*512;

		//light.shadowCameraVisible = true;
	}
	scene.add( light );

	controls = new PointerLockControls( camera , sphereBody );
	scene.add( controls.getObject() );

	// floor
	geometry = new THREE.PlaneGeometry( 300, 300, 50, 50 );
	geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

	material = new THREE.MeshLambertMaterial( { color: 0xeeee00 } );

	mesh = new THREE.Mesh( geometry, material );
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	scene.add( mesh );

	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.shadowMap.enabled = true;
	renderer.shadowMapSoft = true;
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( scene.fog.color, 1 );

	document.body.appendChild(renderer.domElement);

	window.addEventListener( 'resize', onWindowResize, false );

	// Add boxes
	// var halfExtents = new CANNON.Vec3(1,1,1);
	// var boxShape = new CANNON.Box(halfExtents);
	// var boxGeometry = new THREE.BoxGeometry(halfExtents.x*2,halfExtents.y*2,halfExtents.z*2);
	// for(var i=0; i<7; i++){
	// 	var x = (Math.random()-0.5)*20;
	// 	var y = 1 + (Math.random()-0.5)*1;
	// 	var z = (Math.random()-0.5)*20;
	// 	var boxBody = new CANNON.Body({ mass: 50000 });
	// 	boxBody.addShape(boxShape);
	// 	var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
	// 	material2 = new THREE.MeshLambertMaterial( { color: randomColor } );
	// 	var boxMesh = new THREE.Mesh( boxGeometry, material2 );
	// 	world.add(boxBody);
	// 	scene.add(boxMesh);
	// 	boxBody.position.set(x,y,z);
	// 	boxMesh.position.set(x,y,z);
	// 	boxMesh.castShadow = true;
	// 	boxMesh.receiveShadow = true;
	// 	boxes.push(boxBody);
	// 	boxMeshes.push(boxMesh);
	// }


	var halfExtents = new CANNON.Vec3(25,3,2);
	var boxShape = new CANNON.Box(halfExtents);
	var boxGeometry = new THREE.BoxGeometry(50, 6, 2);

	// var x = (Math.random()-0.5)*20;
	// var y = 1 + (Math.random()-0.5)*1;
	// var z = (Math.random()-0.5)*20;

	var x = -10;
	var y = groundBody.position.y;
	var z = -10;

	var boxBody = new CANNON.Body({ mass: 50000 });
	boxBody.addShape(boxShape);
	var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
	var material2 = new THREE.MeshLambertMaterial( { color: randomColor } );
	var boxMesh = new THREE.Mesh( boxGeometry, material2 );
	world.add(boxBody);
	scene.add(boxMesh);
	boxBody.position.set(x,y,z);
	boxMesh.position.set(x,y,z);
	boxMesh.castShadow = true;
	boxMesh.receiveShadow = true;
	boxes.push(boxBody);
	boxMeshes.push(boxMesh);




	var he = new CANNON.Vec3(1, 1, 1);
	var bs = new CANNON.Box(he);
	var bg = new THREE.BoxGeometry(2, 2, 2);

	x = -16;
	y = groundBody.position.y;
	z = 0;

	var bb = new CANNON.Body({mass: 50000});
	bb.addShape(bs);
	var bm = new THREE.Mesh(bg, material2);
	world.add(bb);
	scene.add(bm);
	bb.position.set(x, y, z);
	bm.position.set(x, y, z);
	boxes.push(bb);
	boxMeshes.push(bm);


	// Add linked boxes
	/*var size = 0.5;
	var he = new CANNON.Vec3(size,size,size*0.1);
	var boxShape = new CANNON.Box(he);
	var mass = 0;
	var space = 0.1 * size;
	var N = 5, last;
	var boxGeometry = new THREE.BoxGeometry(he.x*2,he.y*2,he.z*2);
	for(var i=0; i<N; i++){
		var boxbody = new CANNON.Body({ mass: mass });
		var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
		material2 = new THREE.MeshBasicMaterial( { color: randomColor } );
		//console.log (randomColor);
		boxbody.addShape(boxShape);
		var boxMesh = new THREE.Mesh(boxGeometry, material2);
		boxbody.position.set(5,(N-i)*(size*2+2*space) + size*2+space,0);
		boxbody.linearDamping = 0.01;
		boxbody.angularDamping = 0.01;
		// boxMesh.castShadow = true;
		boxMesh.receiveShadow = true;
		world.add(boxbody);
		scene.add(boxMesh);
		boxes.push(boxbody);
		boxMeshes.push(boxMesh);

		if(i!=0){
			// Connect this body to the last one
			var c1 = new CANNON.PointToPointConstraint(boxbody,new CANNON.Vec3(-size,size+space,0),last,new CANNON.Vec3(-size,-size-space,0));
			var c2 = new CANNON.PointToPointConstraint(boxbody,new CANNON.Vec3(size,size+space,0),last,new CANNON.Vec3(size,-size-space,0));
			world.addConstraint(c1);
			world.addConstraint(c2);
		} else {
			mass=0.3;
		}
		last = boxbody;
	}*/
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

var dt = 1/60;
function animate() {
	requestAnimationFrame( animate );

	var pos = controls.getObject().position;
	console.log(pos.x + " " + pos.y + " " + pos.z);


	if(controls.enabled){
		world.step(dt);

		// Update ball positions
		for(var i=0; i<balls.length; i++){
			ballMeshes[i].position.copy(balls[i].position);
			ballMeshes[i].quaternion.copy(balls[i].quaternion);
		}

		// Update box positions
		for(var i=0; i<boxes.length; i++){
			boxMeshes[i].position.copy(boxes[i].position);
			boxMeshes[i].quaternion.copy(boxes[i].quaternion);
		}
	}

	controls.update( Date.now() - time );
	renderer.render( scene, camera );
	time = Date.now();

}

var ballShape = new CANNON.Sphere(0.2);
var ballGeometry = new THREE.SphereGeometry(ballShape.radius, 32, 32);
var shootDirection = new THREE.Vector3();
var shootVelo = 35;
var projector = new THREE.Projector();
function getShootDir(targetVec){
	var vector = targetVec;
	targetVec.set(0,0,1);
	vector.unproject(camera);
	var ray = new THREE.Ray(sphereBody.position, vector.sub(sphereBody.position).normalize() );
	targetVec.copy(ray.direction);
}

window.addEventListener("click",function(e){
	if(controls.enabled==true){
		var x = sphereBody.position.x;
		var y = sphereBody.position.y;
		var z = sphereBody.position.z;
		var ballBody = new CANNON.Body({ mass: 1 });
		ballBody.addShape(ballShape);
		var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
		material2 = new THREE.MeshPhongMaterial( { color: randomColor } );
		var ballMesh = new THREE.Mesh( ballGeometry, material2 );
		world.add(ballBody);
		scene.add(ballMesh);
		ballMesh.castShadow = true;
		ballMesh.receiveShadow = true;
		balls.push(ballBody);
		ballMeshes.push(ballMesh);
		getShootDir(shootDirection);
		ballBody.velocity.set(  shootDirection.x * shootVelo,
								shootDirection.y * shootVelo,
								shootDirection.z * shootVelo);

		// Move the ball outside the player sphere
		x += shootDirection.x * (sphereShape.radius*1.02 + ballShape.radius);
		y += shootDirection.y * (sphereShape.radius*1.02 + ballShape.radius);
		z += shootDirection.z * (sphereShape.radius*1.02 + ballShape.radius);
		ballBody.position.set(x,y,z);
		ballMesh.position.set(x,y,z);
	}
});

