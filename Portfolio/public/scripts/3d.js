// Import the THREE.js library
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js'
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/DRACOLoader.js'
import Stats from 'https://cdn.skypack.dev/stats.js'

function shouldRender() {
    return window.innerWidth >= 1000
}

if (shouldRender()) {
    // Create a Three.js Scene
    const scene = new THREE.Scene()

    const mycanvas = document.getElementById('container3D')

    // Create a new camera with optimized FOV and clipping planes
    const camera = new THREE.PerspectiveCamera(
        50, // FOV adjusted for performance
        mycanvas.clientWidth / mycanvas.clientHeight,
        0.1, // Near clipping plane, closer for performance
        1000 // Far clipping plane limited for performance
    )
    camera.position.set(59, 32, 55) // Set the camera position

    // Instantiate a loader for the .gltf file with Draco compression
    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath(
        'https://www.gstatic.com/draco/versioned/decoders/1.5.7/'
    )
    loader.setDRACOLoader(dracoLoader)

    // Keep the 3D object in a global variable so we can access it later
    let object

    // Optimize lighting: Use minimal lights and reduce intensity
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5) // Reduced intensity
    directionalLight.position.set(500, 500, 500) // x, y, z position
    scene.add(directionalLight)

    const ambientLight = new THREE.AmbientLight(0x333333, 1) // Reduced ambient intensity
    scene.add(ambientLight)

    // Load the model file with Draco compression
    loader.load(
        './asset/model/computer_v3/scene.gltf',
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

    // Create renderer with optimized pixel ratio and set its size
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false }) // Disabled antialiasing for performance
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // Cap pixel ratio for high-DPI devices
    renderer.setSize(mycanvas.clientWidth, mycanvas.clientHeight)
    mycanvas.appendChild(renderer.domElement)

    // OrbitControls to allow the camera to move around the scene
    const controls = new OrbitControls(camera, renderer.domElement)

    // Use Stats.js for performance monitoring
    const stats = new Stats()

    // Rotation speed for the object (in radians per frame)
    const rotationSpeed = 0.001
    let direction = 1
    const range = 0.3

    // Render the scene with animation, applying optimizations
    function animate() {
        stats.begin()

        // Rotate the object only if it's loaded
        if (object) {
            if (direction === 1) {
                object.rotation.y += rotationSpeed
                if (object.rotation.y > range + 0.5) direction = -1
            } else {
                object.rotation.y -= rotationSpeed
                if (object.rotation.y < -range) direction = 1
            }
        }

        renderer.render(scene, camera)
        stats.end()

        requestAnimationFrame(animate)
    }

    // Optimize resizing by adjusting the camera aspect ratio and renderer size
    window.addEventListener('resize', function () {
        camera.aspect = mycanvas.clientWidth / mycanvas.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(mycanvas.clientWidth, mycanvas.clientHeight)
    })

    // Start rendering
    animate()

    // Render only when OrbitControls are changed
    controls.addEventListener('change', () => {
        renderer.render(scene, camera)
    })

    // Performance optimizations
    controls.enableDamping = true // Enable damping (inertia) for smoother movement
    controls.dampingFactor = 0.05 // Damping speed
}
