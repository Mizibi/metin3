class Hemilight {
    constructor(scene) {
        const hemiLight = new THREE.HemisphereLight( 0xFFFFFF, 0xFFFFFFF, 0.6 )
        
        hemiLight.color.setHSL(0.6, 1, 0.6);
        hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        
        scene.add(hemiLight)

        this.model = hemiLight
        
        if (window.DEBUG) {
            const hemiLightFolder = window.GUI.addFolder('hemiLight')
            hemiLightFolder.add(hemiLight, 'visible')
        }
    }

    init() {
    }

    update() {
    }
}

export { Hemilight }
