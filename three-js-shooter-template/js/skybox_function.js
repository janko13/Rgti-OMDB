//###################### Skybox 360 panorama by Ian L. of Jafty.com ##########################
function addSkybox(path,format) {
var urls = [
  path+'0004'+format,
  path+'0002'+format,
  path+'0006'+format,
  path+'0005'+format,
  path+'0001'+format,
  path+'0003'+format
];

var cubemap = THREE.ImageUtils.loadTextureCube(urls); // load textures
cubemap.format = THREE.RGBFormat;

var shader = THREE.ShaderLib['cube']; // init cube shader from built-in lib
shader.uniforms['tCube'].value = cubemap; // apply textures to shader

// create shader material
var skyBoxMaterial = new THREE.ShaderMaterial( {
  fragmentShader: shader.fragmentShader,
  vertexShader: shader.vertexShader,
  uniforms: shader.uniforms,
  depthWrite: false,
  side: THREE.BackSide
});

// create skybox mesh
 skybox = new THREE.Mesh(
  new THREE.CubeGeometry(600, 600, 600),
  skyBoxMaterial
);
scene.add(skybox);	
}//end addSkybox function
//###################### end skybox panorama by Ian L. of Jafty.com ##########################