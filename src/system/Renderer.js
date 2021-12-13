function createRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true })

    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.shadowMap.enabled = true

    renderer.physicallyCorrectLights = true
    renderer.toneMapping = THREE.ReinhardToneMapping

    // Looks shitty
    // renderer.toneMappingExposure = 1

    if (window.DEBUG) {
        const rendererFolder = window.GUI.addFolder('renderer')

        const toneMappingOptions = {
            None: THREE.NoToneMapping,
            Linear: THREE.LinearToneMapping,
            Reinhard: THREE.ReinhardToneMapping,
            Cineon: THREE.CineonToneMapping,
            ACESFilmic: THREE.ACESFilmicToneMapping,
            Custom: THREE.CustomToneMapping,
        }

        // Not working for now
        rendererFolder
            .add(renderer, 'toneMapping', Object.keys(toneMappingOptions))
            .onChange((changed) => {
                renderer.toneMapping = toneMappingOptions[changed]
                console.log(renderer)
            })
        rendererFolder
            .add(renderer, 'toneMappingExposure', 0, 10)
            .onChange((changed) => {
                renderer.toneMappingExposure = changed
            })
    }

    return renderer
}

export { createRenderer }
