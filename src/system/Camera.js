const fov = 35
const aspect = window.innerWidth / window.innerHeight
const near = 0.1
const far = 100

function createCamera() {
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)

    // turn on the physically correct lighting model
    camera.physicallyCorrectLights = true
    camera.position.z = -3
    camera.position.y = 4

    return camera
}

export { createCamera }