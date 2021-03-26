function createScene() {
    const scene = new THREE.Scene()

    scene.background = new THREE.Color('white')

    scene.add(new THREE.AxesHelper(50))

    return scene
}

export { createScene }