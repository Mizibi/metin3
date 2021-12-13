const fov = 60
const aspect = window.innerWidth / window.innerHeight
const near = 1.0
const far = 1000

const CAM_OFFSET_X = -0.2
const CAM_OFFSET_Y = 1.2
const CAM_OFFSET_Z = -2

const control_near = 0.5
const control_far = 2

function createCamera(target) {
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)

    // Camera initial position
    camera.position.z = CAM_OFFSET_Z
    camera.position.y = CAM_OFFSET_Y

    return new ThirdPersonCamera(camera, target)
}

// function createCameraControls(camera, renderer) {
//   const controls = new THREE.OrbitControls( camera, renderer.domElement );

//   // Initial parameters
//   controls.enableDamping = true
//   controls.minDistance = control_near
//   controls.maxDistance = control_far
//   controls.enablePan = false
//   controls.screenSpacePanning = false
//   controls.maxPolarAngle = Math.PI / 2 - 0.05

//   controls.update()

//   return controls
// }

class ThirdPersonCamera {
    constructor(camera, target) {
      this.camera = camera
      this.target = target

      document.addEventListener('wheel', this.mouseWheel.bind(this), false );

      // Not working
      if (window.DEBUG) {
        const cameraFolder = window.GUI.addFolder('camera')
        cameraFolder.add(camera, 'fov')
        cameraFolder.add(camera, 'far')
        cameraFolder.add(camera, 'near')
        cameraFolder.add(camera, 'frustumCulled')
        cameraFolder.add(camera, 'zoom', 0, 10)
      }
    }
  
    offset() {
      const offset = new THREE.Vector3(CAM_OFFSET_X, CAM_OFFSET_Y, CAM_OFFSET_Z)
      offset.applyQuaternion(this.target.model.quaternion)
      offset.add(this.target.model.position)
      return offset
    }

    lookAt() {
      const lookAt = new THREE.Vector3(0, 0, 5)
      lookAt.applyQuaternion(this.target.model.quaternion);
      lookAt.add(this.target.model.position)
      return lookAt
    }
  
    update(timeElapsed) {
      const offset = this.offset()
      const lookAt = this.lookAt()
      
      // Framerate most compliant method
      const t = 1.0 - Math.pow(0.01, timeElapsed);

      const currentPosition = new THREE.Vector3()
      const currentLookAt = new THREE.Vector3()
      currentPosition.lerp(offset, t);
      currentLookAt.lerp(lookAt, t);

      this.camera.position.copy(offset)
      this.camera.lookAt(lookAt)
    }

    mouseWheel(event) {
      const d = event.deltaY
      let direction = 1
      if (d > 0) direction = -1
      let zoom = this.camera.zoom + 0.1 * direction

      zoom = Math.min(Math.max(zoom, control_near), control_far); // clamp

      this.camera.zoom = zoom
      this.camera.updateProjectionMatrix()
    }
}
  
export { createCamera }