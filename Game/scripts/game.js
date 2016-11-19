var map = [ 
           [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1,],
           [1, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3,1,],
           [1, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3,1,],
		   [1, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 4, 5, 5, 3, 3,1,],
		   [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3,1,],
		   [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3,1,],
		   [1, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 4, 3, 3, 3, 3,1,],
		   [1, 5, 5, 5, 5, 5, 5, 5, 5, 4, 3, 3, 3, 3, 4, 3, 3, 3, 3,1,],
		   [1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 5, 5, 5, 4, 3, 3, 5, 5,1,],
		   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0,1,],
		   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0,1,],
		   [1, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 2, 0, 0, 0, 0, 0,1,],
		   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 2, 2, 0, 0, 0,1,],
		   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0,1,],
		   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0,1,],
		   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 2, 2, 2, 2,1,],
		   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0,1,],
           [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0,1,],
		   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,1,],
		   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,1,],
           [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1,],
           ], mapW = map.length, mapH = map[0].length;

/*
	1 zunanji zid
	2 pregrade zunaj hise
	3 streha
	4 notranja navpicna stena
	5 notranja vzdovzna stena
	stopnice so hardcovdane na poljih 9,2 9,3 10,2

*/
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var camera, scene, renderer;
var geometry, material, mesh;
var controls;
//dodano: 
var SPEED = 1000;
var NUMAI = 5;
var UNITSIZE = 40;
var ai = [];
var aispeed = 5;
var bullets = [];
var health = 100;
//
var objects = [];

var raycaster;

var blocker = document.getElementById('blocker');
var instructions = document.getElementById('instructions');

// http://www.html5rocks.com/en/tutorials/pointerlock/intro/

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if (havePointerLock) {

    var element = document.body;

    var pointerlockchange = function (event) {

        if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {

            controlsEnabled = true;
            controls.enabled = true;

            blocker.style.display = 'none';

        } else {

            controls.enabled = false;

            blocker.style.display = '-webkit-box';
            blocker.style.display = '-moz-box';
            blocker.style.display = 'box';

            instructions.style.display = '';

        }

    };

    var pointerlockerror = function (event) {

        instructions.style.display = '';

    };

    // Hook pointer lock state change events
    document.addEventListener('pointerlockchange', pointerlockchange, false);
    document.addEventListener('mozpointerlockchange', pointerlockchange, false);
    document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

    document.addEventListener('pointerlockerror', pointerlockerror, false);
    document.addEventListener('mozpointerlockerror', pointerlockerror, false);
    document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

    instructions.addEventListener('click', function (event) {

        instructions.style.display = 'none';

        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

        if (/Firefox/i.test(navigator.userAgent)) {

            var fullscreenchange = function (event) {

                if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {

                    document.removeEventListener('fullscreenchange', fullscreenchange);
                    document.removeEventListener('mozfullscreenchange', fullscreenchange);

                    element.requestPointerLock();
                }

            };

            document.addEventListener('fullscreenchange', fullscreenchange, false);
            document.addEventListener('mozfullscreenchange', fullscreenchange, false);

            element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

            element.requestFullscreen();

        } else {

            element.requestPointerLock();

        }

    }, false);

} else {

    instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

}

init();
animate();

var controlsEnabled = false;

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;

var prevTime = performance.now();
var velocity = new THREE.Vector3();

function init() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 0, 750);

    var light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);

    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());

    setupAI();
    var onKeyDown = function (event) {

        switch (event.keyCode) {

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
                if (canJump === true) velocity.y += 350;
                canJump = false;
                break;

        }

    };

    var onKeyUp = function (event) {

        switch (event.keyCode) {

            case 38: // up
            case 87: // w
                moveForward = false;
                break;

            case 37: // left
            case 65: // a
                moveLeft = false;
                break;

            case 40: // down
            case 83: // s
                moveBackward = false;
                break;

            case 39: // right
            case 68: // d
                moveRight = false;
                break;

        }

    };

    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);
	

    // floor

    geometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
    geometry.rotateX(-Math.PI / 2);

    for (var i = 0, l = geometry.vertices.length; i < l; i++) {

        var vertex = geometry.vertices[i];
        vertex.x += Math.random() * 20 - 10;
        vertex.y += Math.random() * 2;
        vertex.z += Math.random() * 20 - 10;

    }

    material = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('images/tla.jpg') });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // objects

    
	
	
    for (var i = 0, l = geometry.faces.length; i < l; i++) {

        var face = geometry.faces[i];
        face.vertexColors[0] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
        face.vertexColors[1] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
        face.vertexColors[2] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);

    }
	
	//
	
	for (var i = 0; i < mapW; i++) {
		for (var j = 0, m = map[i].length; j < m; j++) {
			
			if(map[i][j]==1) {
				geometry = new THREE.BoxGeometry(40, 40, 40);
				material = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('images/wall-1.jpg') });
				var mesh = new THREE.Mesh(geometry, material);
				
				mesh.position.x = i * 40 + 20;
				mesh.position.z = j * 40 + 20;
				mesh.position.y = 20;
				
				scene.add(mesh);
				material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
				objects.push(mesh);
				
				geometry = new THREE.BoxGeometry(40, 40, 40);
				material = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('images/wall-1.jpg') });
				var mesh = new THREE.Mesh(geometry, material);				
				
				
				mesh = new THREE.Mesh(geometry, material);
				
				mesh.position.x = i * 40 + 20;
				mesh.position.z = j * 40 + 20;
				mesh.position.y = 60;
				
				scene.add(mesh);
				material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
				objects.push(mesh)

				geometry = new THREE.BoxGeometry(40, 20, 40);
				material = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('images/wall-1.jpg') });
				var mesh = new THREE.Mesh(geometry, material);				
			
				mesh = new THREE.Mesh(geometry, material);
				
				mesh.position.x = i * 40 + 20;
				mesh.position.z = j * 40 + 20;
				mesh.position.y = 90;
				
				scene.add(mesh);
				material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
				objects.push(mesh)
				
			}
			if(map[i][j]==2) {
				
				geometry = new THREE.BoxGeometry(20, 40, 20);
				material = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture('images/crate.jpg') });
				var mesh = new THREE.Mesh(geometry, material);				

				mesh.position.x = i * 40 + 20;
				mesh.position.z = j * 40 + 20;
				mesh.position.y = 20;
				
				scene.add(mesh);
				material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
				objects.push(mesh);
			}
			if(map[i][j]==3) {
				
				geometry = new THREE.BoxGeometry(40, 20, 40);
				material = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('images/wall-1.jpg') });
				var mesh = new THREE.Mesh(geometry, material);				
				
				mesh.position.x = i * 40 + 20;
				mesh.position.z = j * 40 + 20;
				mesh.position.y = 90;
				
				scene.add(mesh);
				material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
				objects.push(mesh);
			}
			if(map[i][j]==4) {
				geometry = new THREE.BoxGeometry(40, 40, 20);
				material = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('images/wall-1.jpg') });
				var mesh = new THREE.Mesh(geometry, material);
				
				mesh.position.x = i * 40 + 20;
				mesh.position.z = j * 40 + 20;
				mesh.position.y = 20;
				
				scene.add(mesh);
				material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
				objects.push(mesh);
				
				geometry = new THREE.BoxGeometry(40, 40, 20);
				material = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('images/wall-1.jpg') });
				var mesh = new THREE.Mesh(geometry, material);				
				
				
				mesh = new THREE.Mesh(geometry, material);
				
				mesh.position.x = i * 40 + 20;
				mesh.position.z = j * 40 + 20;
				mesh.position.y = 60;
				
				scene.add(mesh);
				material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
				objects.push(mesh)

				geometry = new THREE.BoxGeometry(40, 20, 40);
				material = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('images/wall-1.jpg') });
				var mesh = new THREE.Mesh(geometry, material);				
			
				mesh = new THREE.Mesh(geometry, material);
				
				mesh.position.x = i * 40 + 20;
				mesh.position.z = j * 40 + 20;
				mesh.position.y = 90;
				
				scene.add(mesh);
				material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
				objects.push(mesh)
				
				if(map[i][j+1]==5 ) {
					geometry = new THREE.BoxGeometry(20, 40, 20);
					material = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('images/wall-1.jpg') });
					var mesh = new THREE.Mesh(geometry, material);
					
					mesh.position.x = i * 40 + 20;
					mesh.position.z = j * 40 + 30;
					mesh.position.y = 20;
					
					scene.add(mesh);
					material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
					objects.push(mesh);
					
					geometry = new THREE.BoxGeometry(20, 40, 20);
					material = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('images/wall-1.jpg') });
					var mesh = new THREE.Mesh(geometry, material);				
					
					
					mesh = new THREE.Mesh(geometry, material);
					
					mesh.position.x = i * 40 + 20;
					mesh.position.z = j * 40 + 30;
					mesh.position.y = 60;
					
					scene.add(mesh);
					material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
					objects.push(mesh)	
				}
				
				if(map[i][j-1]==5 ) {
					geometry = new THREE.BoxGeometry(20, 40, 20);
					material = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('images/wall-1.jpg') });
					var mesh = new THREE.Mesh(geometry, material);
					
					mesh.position.x = i * 40 + 20;
					mesh.position.z = j * 40 + 10;
					mesh.position.y = 20;
					
					scene.add(mesh);
					material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
					objects.push(mesh);
					
					geometry = new THREE.BoxGeometry(20, 40, 20);
					material = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('images/wall-1.jpg') });
					var mesh = new THREE.Mesh(geometry, material);				
					
					
					mesh = new THREE.Mesh(geometry, material);
					
					mesh.position.x = i * 40 + 20;
					mesh.position.z = j * 40 + 10;
					mesh.position.y = 60;
					
					scene.add(mesh);
					material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
					objects.push(mesh)	
				}
				
				
				
			}
			if(map[i][j]==5) {
				geometry = new THREE.BoxGeometry(20, 40, 40);
				material = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('images/wall-1.jpg') });
				var mesh = new THREE.Mesh(geometry, material);
				
				mesh.position.x = i * 40 + 20;
				mesh.position.z = j * 40 + 20;
				mesh.position.y = 20;
				
				scene.add(mesh);
				material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
				objects.push(mesh);
				
				geometry = new THREE.BoxGeometry(20, 40, 40);
				material = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('images/wall-1.jpg') });
				var mesh = new THREE.Mesh(geometry, material);				
				
				
				mesh = new THREE.Mesh(geometry, material);
				
				mesh.position.x = i * 40 + 20;
				mesh.position.z = j * 40 + 20;
				mesh.position.y = 60;
				
				scene.add(mesh);
				material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
				objects.push(mesh)

				geometry = new THREE.BoxGeometry(40, 20, 40);
				material = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('images/wall-1.jpg') });
				var mesh = new THREE.Mesh(geometry, material);				
			
				mesh = new THREE.Mesh(geometry, material);
				
				mesh.position.x = i * 40 + 20;
				mesh.position.z = j * 40 + 20;
				mesh.position.y = 90;
				
				scene.add(mesh);
				material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
				objects.push(mesh)
				
			}
			
			
			
			
		}
	}
	
	// stopnice   
	//stopnice so hardcovdane na poljih 8,1 8,2 9,1
	for(var i = 0; i < 10 ; i++){	
		geometry = new THREE.BoxGeometry(6, 6, 40);
		material = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('images/wall-1.jpg') });
		var mesh = new THREE.Mesh(geometry, material);
		
		mesh.position.x = 9 * 40 + 20  -  i * 6 - 3 ;
		mesh.position.z = 1 * 40 + 20;
		mesh.position.y = 40 + i * 6 + 3;
		
		scene.add(mesh);
		material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
		objects.push(mesh);
	}
	for(var i = 0; i < 10 ; i++){	
		geometry = new THREE.BoxGeometry(40, 4, 4);
		material = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('images/wall-1.jpg') });
		var mesh = new THREE.Mesh(geometry, material);
		
		mesh.position.x = 400 ;
		mesh.position.z = 3 * 40 - i * 4 - 2;
		mesh.position.y = i * 4 + 2;
		
		scene.add(mesh);
		material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
		objects.push(mesh);
	}
	
	
	
	
		geometry = new THREE.BoxGeometry(40, 10, 40);
		material = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('images/wall-1.jpg') });
		var mesh = new THREE.Mesh(geometry, material);
		
		mesh.position.x = 400 ;
		mesh.position.z = 1 * 40 + 20;
		mesh.position.y = 35;
		
		scene.add(mesh);
		material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
		objects.push(mesh);
	
	
    //

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xffffff);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //

    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    requestAnimationFrame(animate);

    if (controlsEnabled) {
        raycaster.ray.origin.copy(controls.getObject().position);
        raycaster.ray.origin.y -= 10;

        var intersections = raycaster.intersectObjects(objects);

        var isOnObject = intersections.length > 0;

        var time = performance.now();
        var delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        if (moveForward) velocity.z -= SPEED * delta;
        if (moveBackward) velocity.z += SPEED * delta;

        if (moveLeft) velocity.x -= SPEED * delta;
        if (moveRight) velocity.x += SPEED * delta;

        if (isOnObject === true) {
            velocity.y = Math.max(0, velocity.y);

            canJump = true;
        }

        controls.getObject().translateX(velocity.x * delta);
        controls.getObject().translateY(velocity.y * delta);
        controls.getObject().translateZ(velocity.z * delta);

        if (controls.getObject().position.y < 10) {

            velocity.y = 0;
            controls.getObject().position.y = 10;

            canJump = true;

        }
        //dodano: premikanje metkov
        updateBullets();
        //dodano:premikanje sovraznikov
        for (var i = 0; i < ai.length; i++) {
            var a = ai[i];
            moveAI(a, i);
        }
        //
        prevTime = time;

    }

    renderer.render(scene, camera);

}

//DODANO:
function setupAI() {
    for (var i = 0; i < NUMAI; i++) {
        addAI();
    }
    //dodano:
    // addPresident();
    //
}
function addAI() {
    var aiGeo = new THREE.CubeGeometry(40, 40, 40);
    var c = getMapSector(camera.position);
    var aiMaterial = new THREE.MeshBasicMaterial({/*color: 0xEE3333,*/map: THREE.ImageUtils.loadTexture('images/face.png') });
    var o = new THREE.Mesh(aiGeo, aiMaterial);
    do {
        var x = getRandBetween(0, mapW - 1);
        var z = getRandBetween(0, mapH - 1);
    } while (map[x][z] > 0 || (x == c.x && z == c.z));
    x = Math.floor(x - mapW / 2) * UNITSIZE;
    z = Math.floor(z - mapW / 2) * UNITSIZE;
    o.position.set(x, UNITSIZE * 0.5, z);
    o.health = 100;
    //o.path = getAIpath(o);
    o.pathPos = 1;
    o.lastRandomX = Math.random();
    o.lastRandomZ = Math.random();
    o.lastShot = Date.now(); // Higher-fidelity timers aren't a big deal here.
    ai.push(o);
    scene.add(o);
}
function getMapSector(v) {
    var x = Math.floor((v.x + UNITSIZE / 2) / UNITSIZE + mapW / 2);
    var z = Math.floor((v.z + UNITSIZE / 2) / UNITSIZE + mapW / 2);
    return { x: x, z: z };
}
function getRandBetween(lo, hi) {
    return parseInt(Math.floor(Math.random() * (hi - lo + 1)) + lo, 10);
}
function moveAI(a, i) {
    var r = Math.random();
    if (r > 0.995) {
        a.lastRandomX = Math.random() * 2 - 1;
        a.lastRandomZ = Math.random() * 2 - 1;
    }
    a.translateX(aispeed * a.lastRandomX);
    a.translateZ(aispeed * a.lastRandomZ);
    var c = getMapSector(a.position);
    if (c.x < 0 || c.x >= mapW || c.y < 0 || c.y >= mapH) { //dodaj collision!!
        a.translateX(-2 * aispeed * a.lastRandomX);
        a.translateZ(-2 * aispeed * a.lastRandomZ);
        a.lastRandomX = Math.random() * 2 - 1;
        a.lastRandomZ = Math.random() * 2 - 1;
    }
    if (c.x < -1 || c.x > mapW || c.z < -1 || c.z > mapH) {
        ai.splice(i, 1);
        scene.remove(a);
        addAI();
    }

    var cc = getMapSector(camera.position);

    if (Date.now() > a.lastShot + 750 && distance(c.x, c.z, cc.x, cc.z) < 5) { //
        createBullet(a);
        a.lastShot = Date.now();
    }
}
function createBullet(obj) {
    if (obj === undefined) {
        obj = camera;
    }
    var mat = new THREE.MeshBasicMaterial({ color: 0x333333 });
    var geo = new THREE.SphereGeometry(2, 6, 6);
    var sphere = new THREE.Mesh(geo, mat);
    sphere.position.set(obj.position.x, obj.position.y * 0.8, obj.position.z);

    if (obj instanceof THREE.Camera) {
        var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
        projector.unprojectVector(vector, obj);
        sphere.ray = new THREE.Ray(
				obj.position,
				vector.sub(obj.position).normalize()
		);
    }
    else {
        var vector = camera.position.clone();
        sphere.ray = new THREE.Ray(
				obj.position,
				vector.sub(obj.position).normalize()
		);
    }
    sphere.owner = obj;

    bullets.push(sphere);
    scene.add(sphere);

    return sphere;
}
function updateBullets() {
    for (var i = bullets.length - 1; i >= 0; i--) {
        var b = bullets[i], p = b.position, d = b.ray.direction;
        var speed = 5;
        var hit = false;
        /*
        if (checkWallCollision(p)) {
            bullets.splice(i, 1);
            scene.remove(b);
            continue;
        }*/

        //DODAJ: zadet AI, zadet player
        // Bullet hits player

        if (!hit) {
            b.translateX(speed * d.x);
            b.translateZ(speed * d.z);
        }
    }
}
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}
