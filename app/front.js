// Renderer process

const THREE = require('./vendor/three.min.js');
const renderManager = require('./front/render');

let renderer = renderManager.init(THREE);
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

function draw(){
  requestAnimationFrame(draw);
  renderManager.render();
}
draw();
