function createRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true })

    renderer.physicallyCorrectLights = true

    renderer.toneMapping = THREE.ReinhardToneMapping
    renderer.toneMappingExposure = 1
    renderer.outputEncoding = THREE.sRGBEncoding

    return renderer
}

export { createRenderer }