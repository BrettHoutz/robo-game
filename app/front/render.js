// Exports a render management object. Managed rendering the entire window.

let THREE;

const TILE_ORDERS = [[0,3,6], [3,6,0], [6,0,3], [9,12,15], [12,15,9], [15,9,12]];

let heights = [
  [0,   0,   0,    0,   0,   0, 0],
  [0,   0, 0.5, 0.75, 0.5,   0, 0],
  [0, 0.5, 0.8,    1, 0.8, 0.5, 0],
  [0,   0, 0.5, 0.75, 0.5,   0, 0],
  [0,   0,   0,    0,   0,   0, 0]
];

let angle = 0;

let scene;
let camera;
let renderer;

let ambientLight;
let dirLight;

window.addEventListener('keydown', event => {switch(event.keyCode){
  case 37: // left arrow
  case 38: // up arrow
  case 39: // right arrow
  case 40: // down arrow
}});

// Generate a geometry given a 2D array of heights
function genTiles(heights){
  let geometry = new THREE.BufferGeometry();
  let vertices = [];
  let normals = [];

  let colLength = heights.length - 1;

  let top;
  let bottom = -1;
  for(let i=1;i<heights.length;i++){
    let rowLength = heights[i].length - 1;

    top = bottom;
    bottom = (2 * i / colLength) - 1;

    let left;
    let right = -1;
    for(let j=1;j<heights[i].length;j++){
      left = right;
      right = (2 * j / rowLength) - 1;

      vertices.push(
        right, top, heights[i-1][j],
        left, bottom, heights[i][j-1],
        left, top, heights[i-1][j-1],

        left, bottom, heights[i][j-1],
        right, top, heights[i-1][j],
        right, bottom, heights[i][j]
      );
    }
  }
  geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
  geometry.computeFaceNormals();
  geometry.computeVertexNormals();
  return geometry;
}

function init(three){
  THREE = three;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();

  //let texture = new THREE.TextureLoader().load('texture.png')

  dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(0, 0, 2);
  scene.add(dirLight);

  ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  let geometry = genTiles(heights);
  let material = new THREE.MeshPhongMaterial({
    color: 0x555544,
    shininess: 30
  });
  let mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  camera.position.z = 2;

  return renderer;
}

function render(){
  dirLight.position.set(2*Math.cos(angle), 0, 2*Math.sin(angle));
  angle += 0.01;
  renderer.render(scene, camera);
}

module.exports = {init, render};
