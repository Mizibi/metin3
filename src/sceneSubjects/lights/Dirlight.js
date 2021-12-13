const LIGHT_X = 1
const LIGHT_Y = 1
const LIGHT_INTENSITY = 1

class Dirlight {
    constructor(scene) {
        const dirLight = new THREE.DirectionalLight(0xFFFFFF, LIGHT_INTENSITY)

        dirLight.castShadow = true
        dirLight.position.y = LIGHT_X
        dirLight.position.x = LIGHT_Y

        scene.add(dirLight)

        this.model = dirLight

        if (window.DEBUG) {
            const helper = new THREE.DirectionalLightHelper( dirLight, 1, 0xFF0000 );
            dirLight.add(helper)

            const dirLightFolder = window.GUI.addFolder('dirLight')
            dirLightFolder.add(dirLight, 'visible')
            dirLightFolder.add(dirLight, 'castShadow')
            dirLightFolder.add(dirLight.position, 'x', -10, 10)
            dirLightFolder.add(dirLight.position, 'y', -10, 10)
            dirLightFolder.add(dirLight.position, 'z', -10, 10)
        }
    }

    init() {
    }

    update() {
    }
}

export { Dirlight }