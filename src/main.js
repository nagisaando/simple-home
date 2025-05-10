import * as THREE from 'three'
import { OrbitControls, RGBELoader } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import './style.css'

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
    console.log(gltf)
    gltf.scene.scale.set(0.4, 0.4, 0.4)
    gltf.scene.position.set(0, -0.8, 0)
    gltf.scene.rotation.y = - Math.PI / 4
    scene.add(gltf.scene)
    updateAllMaterials()
  }
)




// environment map
const rgbdLoader = new RGBELoader()
rgbdLoader.load('/environment-map/kloofendal_misty_morning_puresky_1k.hdr', (envMap) => {
  envMap.mapping = THREE.EquirectangularReflectionMapping
  scene.background = envMap
  // we will use environment map for lighting
  scene.environment = envMap
})


// scene.add(directionalLight)

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

controls.minDistance = 2;
controls.maxDistance = 8

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