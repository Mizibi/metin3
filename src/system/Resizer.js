class Resizer {
    constructor(camera, renderer) {
        this.setSize(camera, renderer)

        window.addEventListener('resize', () => {
            this.setSize(camera, renderer)
            this.customActionOnResize()
        })
    }

    setSize(camera, renderer) {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio) // Mobile device

    }

    customActionOnResize() { }
}

export { Resizer }
