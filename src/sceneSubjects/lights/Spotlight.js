const LIGHT_X = 1.5
const LIGHT_Y = 1
const LIGHT_INTENSITY = 8

class Spotlight {
    constructor(scene) {
        const spotLight = new THREE.SpotLight(0xffa95c, LIGHT_INTENSITY)

        spotLight.castShadow = true
        spotLight.position.y = LIGHT_X
        spotLight.position.x = LIGHT_Y
        
        // Helper
        if (window.DEBUG) {
            let geometry = new THREE.SphereGeometry( 0.1, 12, 6 );
            let material = new THREE.MeshBasicMaterial( { color: 'red', wireframe: true } );
            material.color.multiplyScalar( 1.5 );
            let sphere = new THREE.Mesh( geometry, material );
            spotLight.add( sphere )
        }

        scene.add(spotLight)

        this.model = spotLight

    }

    init() {
    }

    update() {
    }
}

export { Spotlight }