const LIGHT_X = 5
const LIGHT_Y = 5
const LIGHT_Z = -5
const LIGHT_INTENSITY = 1

class Dirlight {
    constructor(scene) {
        const dirLight = new THREE.DirectionalLight(0xFFFFFF, LIGHT_INTENSITY)

        dirLight.castShadow = true
        dirLight.position.x = LIGHT_X
        dirLight.position.y = LIGHT_Y
        dirLight.position.z = LIGHT_Z

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