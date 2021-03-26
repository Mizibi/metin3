function createControls(camera, renderer) {
    const controls = new THREE.OrbitControls( camera, renderer.domElement );

    return controls
}

export { createControls }