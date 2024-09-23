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
    // Fix: shouldRender is a function and should be called

    // Create a Three.JS Scene
    const scene = new THREE.Scene()

    const mycanvas = document.getElementById('container3D')

    // Create a new camera with a more typical FOV for better performance
    const camera = new THREE.PerspectiveCamera(
        10, // Adjusted FOV for performance
        mycanvas.clientWidth / mycanvas.clientHeight,
        0.1,
        1000
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

    // Optimize lighting: Reduced number of lights and intensity
    const directionalLight = new THREE.DirectionalLight(0xffffff, 4) // Reduced intensity
    directionalLight.position.set(500, 500, 500) // x, y, z position
    scene.add(directionalLight)

    const ambientLight = new THREE.AmbientLight(0x333333, 4) // Reduced intensity
    scene.add(ambientLight)

    // Load the file with Draco compression
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

    // Instantiate a new renderer and set its size with optimized pixel ratio
    const renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setPixelRatio(
        window.devicePixelRatio < 2 ? window.devicePixelRatio : 2
    ) // Optimized for high-DPI screens
    renderer.setSize(mycanvas.clientWidth, mycanvas.clientHeight) // Use mycanvas size
    mycanvas.appendChild(renderer.domElement) // Append renderer to mycanvas

    // OrbitControls to allow the camera to move around the scene
    const controls = new OrbitControls(camera, renderer.domElement)

    // Add Stats.js for performance monitoring
    const stats = new Stats()
    // document.body.appendChild(stats.dom);

    // Rotation speed (in radians per frame)
    const rotationSpeed = 0.0003
    let direction = 1
    const range = 0.3

    // Render the scene with animation, updating only on control changes for better performance
    function animate() {
        stats.begin()

        // Rotate the object only if it's loaded
        if (object) {
            if (direction === 1) {
                object.rotation.y += rotationSpeed
                if (object.rotation.y > range + 0.5) {
                    direction = -1
                }
            } else {
                object.rotation.y -= rotationSpeed
                if (object.rotation.y < -range) {
                    direction = 1
                }
            }
        }

        renderer.render(scene, camera)

        stats.end()
        requestAnimationFrame(animate)
    }

    // Add a listener to the window to handle resizing
    window.addEventListener('resize', function () {
        camera.aspect = mycanvas.clientWidth / mycanvas.clientHeight // Fix: use mycanvas size
        camera.updateProjectionMatrix()
        renderer.setSize(mycanvas.clientWidth, mycanvas.clientHeight) // Fix: use mycanvas size
    })

    // Start the 3D rendering
    animate()

    // Trigger render on camera movement for performance boost
    controls.addEventListener('change', () => {
        renderer.render(scene, camera)
    })
}
