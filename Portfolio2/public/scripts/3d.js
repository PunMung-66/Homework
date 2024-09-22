// Import the THREE.js library
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js'
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js'

// Create a Three.JS Scene
const scene = new THREE.Scene()

const mycanvas = document.getElementById('container3D')

// Create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(
    10,
    mycanvas.clientWidth / mycanvas.clientHeight,
    0.1,
    1000
)
camera.position.set(59, 32, 55) // Set the camera position

// Instantiate a loader for the .gltf file
const loader = new GLTFLoader()

// Keep the 3D object in a global variable so we can access it later
let object

const directionalLight = new THREE.DirectionalLight(0xffffff, 6) // color and intensity
directionalLight.position.set(500,500,500) // x, y, z position
scene.add(directionalLight)


// Load the file
loader.load(
    `./asset/model/computer_v3/scene.gltf`,
    function (gltf) {
        object = gltf.scene
        object.position.set(0, -10, 0) // Set the object position
        scene.add(object)
    },
    undefined,
    function (error) {
        console.error(error)
    }
)

// Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }) // Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight)
document.getElementById('container3D').appendChild(renderer.domElement)

// OrbitControls to allow the camera to move around the scene
const controls = new OrbitControls(camera, renderer.domElement)


// Add lights to the scene
const topLight = new THREE.DirectionalLight(0xffffff, 1)
topLight.position.set(500, 500, 500) // Position the light
scene.add(topLight)

const ambientLight = new THREE.AmbientLight(0x333333, 6)
scene.add(ambientLight)

// Rotation speed (in radians per frame)
const rotationSpeed = 0.0003
let diraction = 1
const range = 0.3



// Render the scene with animation
function animate() {
    requestAnimationFrame(animate)

    // If the object is loaded, rotate it at a constant speed
    if (diraction == 1) {
        object.rotation.y += rotationSpeed
        if (object.rotation.y > range + 0.5) {
            diraction = -1
        }
    } else {
        object.rotation.y -= rotationSpeed
        if (object.rotation.y < -range) {
            diraction = 1
        }
    }

    //console.log(object.rotation.y)

    renderer.render(scene, camera)
}

// Add a listener to the window to handle resizing
window.addEventListener('resize', function () {
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

// Start the 3D rendering
animate()
