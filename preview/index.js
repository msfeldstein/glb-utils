window.THREE = require('three')

const GLTFLoader = require('./GLTFLoader')
require('./flycontrols')


const W = window.innerWidth
const H = window.innerHeight
const renderer = new THREE.WebGLRenderer({
  antialias: true
})
renderer.setSize(W, H)
renderer.setClearColor(0xFF0000, 1.0)
document.body.appendChild(renderer.domElement)
document.body.style.margin = 0
const camera = new THREE.PerspectiveCamera(145, W / H, 0.001, 100)
camera.lookAt(new THREE.Vector3)
const controls = new THREE.FlyControls(camera)
controls.movementSpeed = 1;
// controls.domElement = container;
// controls.rollSpeed = Math.PI / 124;
controls.autoForward = false;
controls.dragToLook = false;
const clock = new THREE.Clock()
const scene = new THREE.Scene()
const loader = new THREE.GLTFLoader
loader.load('./model.glb', function(gltf) {
  scene.add(gltf.scene)
  gltf.scene.scale.z = .1
  console.log("ARUGMENTS", arguments)
})

function animate() {
  requestAnimationFrame(animate)
  // controls.update(clock.getDelta())
  camera.position.x = Math.sin(Date.now() / 1000) * .01
  camera.position.y = Math.cos(Date.now() / 1100) * .01
  renderer.render(scene, camera)
}
requestAnimationFrame(animate)
