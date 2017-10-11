window.THREE = require('three')

const GLTFLoader = require('./GLTFLoader')
var OrbitControls = require('three-orbit-controls')(THREE)


const W = window.innerWidth
const H = window.innerHeight
const renderer = new THREE.WebGLRenderer({
  antialias: true
})
renderer.setSize(W, H)
document.body.appendChild(renderer.domElement)
document.body.style.margin = 0
const camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 100)
camera.position.z = 3
camera.lookAt(new THREE.Vector3)
new OrbitControls(camera)
const scene = new THREE.Scene()
const loader = new THREE.GLTFLoader
loader.load('./model.glb', function(gltf) {
  scene.add(gltf.scene)
  console.log("ARUGMENTS", arguments)
})

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
requestAnimationFrame(animate)
