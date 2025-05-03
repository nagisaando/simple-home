import * as THREE from 'three'
import GUI from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import './style.css'

// debug
const gui = new GUI({ width: 340 })

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()


/**
 * Update all materials
 */

// activate the shadows on all the Meshes
const updateAllMaterials = () => {
  scene.traverse((child) => { // scene.traverse will go through all children and grandchildren of the scene 

    if (child.isMesh && child.material?.isMeshStandardMaterial) {
      child.castShadow = true
      child.receiveShadow = true
    }
  })
}


// models
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const glftLoader = new GLTFLoader()
glftLoader.setDRACOLoader(dracoLoader)

glftLoader.load(
  '/home.glb',
  (gltf) => {
    gltf.scene.scale.set(0.4, 0.4, 0.4)
    gltf.scene.position.set(0, -0.8, 0)
    // gltf.scene.rotation.y = - Math.PI / 4
    scene.add(gltf.scene)
    updateAllMaterials()
  }
)


// lights

const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.9)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.position.set(5, 5, 5);



// [Shadow acne]
// The problem of using hamburger model: there is strips cover its face. It can be more obvious by lowering envMapIntensity
// scene.environmentIntensity = 0

// Shadow acne can occur on both smooth and flat surface for precision reasons when calculating if the surface is in the shadow or not. 
// THe hamburger is casting a shadow on its own surface (See: src/assets/lesson-25/shadow-acne.png)

// solutions
// We have to tweak the light shadow's "bias" and "normalBias", and we need to tweak the both to get the good result
// "bias": usually helps for flat surfaces (moving everything away or closer from the camera shadow)
// "normalBias": usually helps for rounded surface (make the hamburger/object bigger or smaller)

directionalLight.shadow.normalBias = 0.027
directionalLight.shadow.bias = - 0.04


scene.add(directionalLight)

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



controls.minAzimuthAngle = -Math.PI / 4;
controls.maxAzimuthAngle = Math.PI / 4



const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// test cube
// const cube1 = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial({ color: 0xECA400, })
// )



// scene.add(cube1)


const tick = () => {

  // update controls
  controls.update()

  // render
  renderer.render(scene, camera)
  // Call tick again on the next frame
  window.requestAnimationFrame(tick)

}

tick()