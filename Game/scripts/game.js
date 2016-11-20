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
var mouse = { x: 0, y: 0 }
var rayc = new THREE.Raycaster();
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
    //dodano: mouse za streljanje
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    $(document).click(function (e) {
        e.preventDefault;
        if (e.which === 1) { // Left click only
            createBullet();
        }
    });
    //
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 0, 750);

    var light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);

    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());

    //dodano: premik v stavbo na zacetku
    controls.getObject().translateX(100);
    controls.getObject().translateY(100);
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
                if (canJump === true){
					velocity.y += 200;
					velocity.z -= 200;
				} 			
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
	

	createWorld();

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
        addAI(i);
    }
    //dodano:
    // addPresident();
    //
}
function addAI(i) {
    var aiGeo = new THREE.CubeGeometry(40, 40, 40);
    var c = getMapSector(camera.position);
    var aiMaterial = new THREE.MeshBasicMaterial({/*color: 0xEE3333,*/map: THREE.ImageUtils.loadTexture('images/face.png') });
    var o = new THREE.Mesh(aiGeo, aiMaterial);
    var x = i;
    var z = 0;
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

    var cc = getMapSector(controls.getObject().position);

    if (Date.now() > a.lastShot + 750 && distance(c.x, c.z, cc.x, cc.z) < 5) { //
        createBullet(a);
        a.lastShot = Date.now();
    }
}

function AIdeath(a, i) {
    if (a.health <= 0) {
        ai.splice(i, 1);
        scene.remove(a);
        //kills++;
        //$('#score').html(kills * 100);
    }
}

function createBullet(obj) {
    
    var mat = new THREE.MeshBasicMaterial({ color: 0x333333 });
    var geo = new THREE.SphereGeometry(3, 5, 5);
    var sphere = new THREE.Mesh(geo, mat);
     //!!!!

    if (obj == undefined) {
        obj = controls.getObject();

        raycaster.setFromCamera(mouse, camera);
        sphere.ray = raycaster.ray;
    }
        
    else {
        var vector = controls.getObject().position.clone();
        sphere.ray = new THREE.Ray(
				obj.position,
				vector.sub(obj.position).normalize()
		);
    }
    sphere.owner = obj;
    sphere.position.set(obj.position.x, obj.position.y, obj.position.z);
    bullets.push(sphere);
    console.log(bullets.length);
    scene.add(sphere);

    return sphere;
}
function updateBullets() {
    for (var i = bullets.length - 1; i >= 0; i--) {
        var b = bullets[i], p = b.position, d = b.ray.direction;
        
        var speed = 10;
        var hit = false;
        /*
        if (checkWallCollision(p)) {
            bullets.splice(i, 1);
            scene.remove(b);
            continue;
        }*/

        //DODAJ: zadet AI, zadet player
        // zadet player
        
        if (distance(p.x, p.z, controls.getObject().position.x, controls.getObject().position.z) < 25 && b.owner != controls.getObject()) {
            console.log("hit, health: " + health);
            //$('#hurt').fadeIn(75);
            health -= 10;
            if (health < 0) health = 0;
           // val = health < 25 ? '<span style="color: darkRed">' + health + '</span>' : health;
         //   $('#health').html(val);
            bullets.splice(i, 1);
            scene.remove(b);
            //$('#hurt').fadeOut(350);
            hit = true;
        }
        //zadet AI
        for (var j = ai.length - 1; j >= 0; j--) {
            var a = ai[j];
            var v = a.geometry.vertices[0];
            var c = a.position;
            var x = Math.abs(v.x), z = Math.abs(v.z);
            //console.log(Math.round(p.x), Math.round(p.z), c.x, c.z, x, z);
            if (p.x < c.x + x && p.x > c.x - x && p.z < c.z + z && p.z > c.z - z && b.owner != a) {
                bullets.splice(i, 1);
                scene.remove(b);
                a.health -= 100;
                var color = a.material.color, percent = a.health / 100;
                //a.material.color.setRGB(percent * color.r,percent * color.g, percent * color.b);
                hit = true;
                AIdeath(a, j);
                break;
            }
        }

        if (!hit) {
            b.translateX(speed * d.x);
            b.translateZ(speed * d.z);
        }
        console.log(ai.length);
    }
}
function distance(x1, z1, x2, z2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (z2 - z1) * (z2 - z1));
}
function onDocumentMouseMove(e) {
    var WIDTH = window.innerWidth;
    var HEIGHT = window.innerHeight;
    e.preventDefault();
    mouse.x = (e.clientX / WIDTH) * 2 - 1;
    mouse.y = -(e.clientY / HEIGHT) * 2 + 1;
}

/* World */

function createWorld(){
	// floor

    geometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
    geometry.rotateX(-Math.PI / 2);

    for (var i = 0, l = geometry.vertices.length; i < l; i++) {

        var vertex = geometry.vertices[i];
        vertex.x += Math.random() * 20 - 10;
        vertex.y += Math.random() * 2;
        vertex.z += Math.random() * 20 - 10;

    }

    material = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('images/tla.jpg')});
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
	
	//streha	
	createWall(180,90,400,360,20,800);
	
	//zunanje stene
	createWall(20,40,400,40,80,800);
	createWall(780,40,400,40,80,800);
	createWall(400,40,780,800,80,40);
	createWall(400,40,20,800,80,40);
	
	//notranje stene
	createWall(100,40,380,120,80,20);
	createWall(300,40,380,120,80,20);
	createWall(240,40,580,240,80,20);
	
	createWall(320,40,720,20,80,80);
	createWall(320,40,480,20,80,180);
	createWall(320,40,205,20,80,330);
	createWall(130,40,630,20,80,80);
	
	//stopnice
	for(var i = 0; i < 5 ; i++){
		var x = 410 - i * 10 - 5;
		var y = i * 10 + 5;
		var z = 120 - i * 10 - 5 ;
		
		createWall(x ,50 + y,60,15,10,40);
		createWall(430, y , z  ,40,10,15);
	}
	
	createWall(430,45,60,40,10,40);
}

function createWall(cx,cy,cz,dx,dy,dz){
	geometry = new THREE.BoxGeometry(dx, dy, dz);
	material = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('images/wall-1.jpg') });
	var mesh = new THREE.Mesh(geometry, material);
		
	mesh.position.x = cx;
	mesh.position.y = cy;
	mesh.position.z = cz;
		
	scene.add(mesh);
	objects.push(mesh);
}