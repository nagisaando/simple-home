import * as THREE from 'three'
import GUI from 'lil-gui';
import { GLTFLoader, OrbitControls } from 'three/examples/jsm/Addons.js';
import './style.css'

const gui = new GUI({ width: 340 })

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

const glftLoader = new GLTFLoader()

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}


window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 6)
scene.add(camera)

// controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


// These properties control how far the camera can rotate vertically (up/down) and horizontally (left/right) when using OrbitControls.

//          ▲ (maxPolarAngle ~144°)
//          |
//          |   Camera can rotate
//          |   within this range
//          |
// ◄────────┼────────► (horizon)
//          |
//          |   (minPolarAngle ~11°)
//          ▼
controls.minPolarAngle = 0
controls.maxPolarAngle = Math.PI / 2;



controls.minAzimuthAngle = 0;
controls.maxAzimuthAngle = Math.PI / 2



const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xECA400, })
)



scene.add(cube1)


const tick = () => {

  // update controls
  controls.update()

  // render
  renderer.render(scene, camera)
  // Call tick again on the next frame
  window.requestAnimationFrame(tick)

}

tick()