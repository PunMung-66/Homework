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
    // Create a Three.JS Scene
    const scene = new THREE.Scene()
    const mycanvas = document.getElementById('container3D')

    // Create a new camera
    const camera = new THREE.PerspectiveCamera(
        10,
        mycanvas.clientWidth / mycanvas.clientHeight,
        0.1,
        1000
    )
    camera.position.set(59, 32, 55)

    // Instantiate loaders
    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath(
        'https://www.gstatic.com/draco/versioned/decoders/1.5.7/'
    )
    loader.setDRACOLoader(dracoLoader)

    let object

    // Optimize lighting
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1) // Reduced intensity
    directionalLight.position.set(500, 500, 500)
    scene.add(directionalLight)

    const ambientLight = new THREE.AmbientLight(0x333333, 1) // Reduced intensity
    scene.add(ambientLight)

    // Load the model
    loader.load(
        './asset/model/computer_v3/scene.gltf',
        function (gltf) {
            object = gltf.scene
            object.position.set(0, -10, 0)
            scene.add(object)

            // Use a simple material for performance
            object.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshBasicMaterial({
                        color: 0xffffff,
                        wireframe: false,
                    })
                }
            })
        },
        undefined,
        function (error) {
            console.error(error)
        }
    )

    const renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setPixelRatio(
        window.devicePixelRatio < 2 ? window.devicePixelRatio : 2
    )
    renderer.setSize(mycanvas.clientWidth, mycanvas.clientHeight)
    mycanvas.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    const stats = new Stats()
    // document.body.appendChild(stats.dom);

    const rotationSpeed = 0.0003
    let direction = 1
    const range = 0.3

    function animate() {
        stats.begin()

        // Rotate the object only if it's loaded
        if (object) {
            object.rotation.y += direction * rotationSpeed
            if (object.rotation.y > range + 0.5 || object.rotation.y < -range) {
                direction *= -1
            }
        }

        renderer.render(scene, camera)
        stats.end()
        requestAnimationFrame(animate)
    }

    // Resize listener
    window.addEventListener('resize', function () {
        camera.aspect = mycanvas.clientWidth / mycanvas.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(mycanvas.clientWidth, mycanvas.clientHeight)
    })

    // Start rendering
    animate()
}
