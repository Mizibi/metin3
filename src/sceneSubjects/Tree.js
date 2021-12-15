const path = '../ressources/CommonTree_1.fbx'

class Tree {
    constructor(scene, position) {
        this.position = position
        this.scene = scene
        this.model = null
    }

    async init() {
        const object = await new THREE.FBXLoader(
            window.LOADINGMANAGER
        ).loadAsync(path)

        this.model = object

        this.model.traverse((node) => {
            if (node instanceof THREE.Mesh) {
                node.castShadow = true
            }
        })

        this.model.scale.setScalar(0.01)
        
        if (this.position) {
            this.model.position.copy(this.position)
        }

        this.model.rotation.y = Math.PI / Math.floor(Math.random() * 5);

        this.scene.add(this.model)

        console.log(this.model)
        // if (window.DEBUG) {
        //     const treeFolder = window.GUI.addFolder(`tree`)
        //     treeFolder.add(this.model, 'visible')
        //     treeFolder.add(this.model.position, 'x', -10, 10)
        //     treeFolder.add(this.model.position, 'y', -10, 10)
        //     treeFolder.add(this.model.position, 'z', -10, 10)
        // }
    }

    update(delta) {
    }
}

export { Tree }
