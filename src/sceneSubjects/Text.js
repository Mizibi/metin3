const path = '../ressources/fonts/helvetiker_regular.typeface.json'

const loader = new THREE.FontLoader();

class Text {
    constructor(scene) {
        this.scene = scene
        this.model = null
        this.geometry = null
    }

    async init() {
        loader.load(path, (font) => {
            const geometry = new THREE.TextGeometry( 'Username', {
                font: font,
                size: 0.05,
                height: 0.01,
                // curveSegments: 24,
                // bevelEnabled: true,
                // bevelThickness: 0.08,
                // bevelSize: 0.01,
                // bevelOffset: 0,
                // bevelSegments: 5
            } );
            
            const material = new THREE.MeshBasicMaterial()
            this.model = new THREE.Mesh(geometry, material)
            this.model.rotation.y = Math.PI;

            this.scene.add(this.model)
        })
    }

    update(delta) {
        // Async loading
        if (!this.model) return

        const offset = new THREE.Vector3(0.15, 1, 0)
        const player = this.scene.getObjectByName("player")
        if (player.position) {
            offset.add(player.position)
            this.model.position.copy(offset)
        }
    }
}

export { Text }
