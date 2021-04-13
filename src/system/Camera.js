const fov = 35
const aspect = window.innerWidth / window.innerHeight
const near = 0.1
const far = 100

function createCamera(target) {
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)

    // turn on the physically correct lighting model
    camera.physicallyCorrectLights = true
    camera.position.z = -3
    camera.position.y = 4

    return new ThirdPersonCamera({
        camera,
        target,
    })
}

class ThirdPersonCamera {
    constructor(params) {
      this.params = params
      this.camera = params.camera
    }
  
    calcOffset() {
      const offset = new THREE.Vector3(0, 1.5, -4)
    //   offset.applyQuaternion(this._params.target.model.quaternion)
      offset.add(this.params.target.model.position)
      return offset
    }
  
    calcLookAt() {
      const lookAt = new THREE.Vector3(0, 0, 5)
    //   lookAt.applyQuaternion(this._params.target.model.quaternion)
      lookAt.add(this.params.target.model.position)
      return lookAt
    }
  
    Update(delta) {
        // return
      const offset = this.calcOffset()
      const lookAt = this.calcLookAt()
    //   const currentPosition = new THREE.Vector3().add(this.params.target.model.position)
      // const t = 0.05
      // const t = 4.0 * delta
    //   const t = 1.0 - Math.pow(0.001, delta)
  
    //   offset.lerp(offset, t)
    //   this._currentLookat.lerp(idealLookat, t)
  
      this.camera.position.copy(offset)
      this.camera.lookAt(lookAt)

    }
  }
  
export { createCamera }