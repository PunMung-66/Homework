import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js'
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/DRACOLoader.js'

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    )
}

function isWebGLAvailable() {
    try {
        const canvas = document.createElement('canvas')
        return !!(
            window.WebGLRenderingContext &&
            (canvas.getContext('webgl') ||
                canvas.getContext('experimental-webgl'))
        )
    } catch (e) {
        return false
    }
}

if (isWebGLAvailable()) {
    const scene = new THREE.Scene()
    const mycanvas = document.getElementById('container3D')

    const camera = new THREE.PerspectiveCamera(
        isMobile() ? 20 : 10, // Wider FOV for mobile
        mycanvas.clientWidth / mycanvas.clientHeight,
        0.1,
        1000
    )
    camera.position.set(59, 32, 55)

    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath(
        'https://www.gstatic.com/draco/versioned/decoders/1.5.7/'
    )
    loader.setDRACOLoader(dracoLoader)

    let object

    const directionalLight = new THREE.DirectionalLight(
        0xffffff,
        isMobile() ? 2 : 4
    )
    directionalLight.position.set(500, 500, 500)
    scene.add(directionalLight)

    const ambientLight = new THREE.AmbientLight(0x333333, isMobile() ? 2 : 4)
    scene.add(ambientLight)

    loader.load(
        './asset/model/computer_v3/scene.gltf',
        function (gltf) {
            object = gltf.scene
            object.position.set(0, -10, 0)
            scene.add(object)
        },
        undefined,
        function (error) {
            console.error('An error occurred while loading the model:', error)
        }
    )

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false })
    renderer.setPixelRatio(
        isMobile()
            ? 1
            : window.devicePixelRatio < 2
            ? window.devicePixelRatio
            : 2
    )
    renderer.setSize(mycanvas.clientWidth, mycanvas.clientHeight)
    mycanvas.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05

    const rotationSpeed = isMobile() ? 0.0002 : 0.0003
    let direction = 1
    const range = 0.3

    function animate() {
        requestAnimationFrame(animate)

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

        controls.update()
        renderer.render(scene, camera)
    }

    function handleResize() {
        camera.aspect = mycanvas.clientWidth / mycanvas.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(mycanvas.clientWidth, mycanvas.clientHeight)
    }

    window.addEventListener('resize', handleResize)

    animate()
} else {
    console.error('WebGL is not supported in this browser')
    // Display an error message to the user
    const errorMessage = document.createElement('div')
    errorMessage.textContent =
        'Your browser does not support WebGL, which is required to view this 3D model.'
    document.body.appendChild(errorMessage)
}
