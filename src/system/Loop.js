class Loop {
    constructor(camera, scene, renderer) {
        this.camera = camera
        this.scene = scene
        this.renderer = renderer
        this.clock = new THREE.Clock()
        this.updatables = []
    }

    start() {
        requestAnimationFrame( this.start.bind(this) )
        this.tick()
        this.renderer.render(this.scene, this.camera.camera)
    }

    stop() {
        this.renderer.setAnimationLoop(null)
    }

    tick() {
        const delta = this.clock.getDelta()

        this.camera.Update()

        // console.log(
        //   `The last frame rendered in ${delta * 1000} milliseconds`,
        // )

        this.updatables.forEach(updatable => {
            updatable.tick(delta)
        })

        // May be faster ? To benchmark
        // for (const object of this.updatables) {
        //     object.tick(delta)
        // }
    }
}

export { Loop }
