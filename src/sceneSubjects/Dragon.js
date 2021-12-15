const path = '../ressources/Dragon.fbx'

class Dragon {
    constructor(scene) {
        this.scene = scene
        this.model = null
        this.mixer = null
        this.animations = new Map() // <string, action>
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

        this.model.scale.setScalar(0.001)
        
        this.mixer = new THREE.AnimationMixer(this.model)
        this.initAnimations(object.animations)

        console.log(object.animations)

        // this.model.position.x = 1;
        this.model.position.y = 0.5;
        // this.model.rotation.y = Math.PI;

        this.scene.add(this.model)

        if (window.DEBUG) {
            const dragonFolder = window.GUI.addFolder('dragon')
            dragonFolder.add(this.model, 'visible')
            dragonFolder.add(this.model.position, 'x', -10, 10)
            dragonFolder.add(this.model.position, 'y', -10, 10)
            dragonFolder.add(this.model.position, 'z', -10, 10)
        }
    }

    initAnimations(animations) {
        const actions = ["DragonArmature|Dragon_Flying"]

        actions.forEach((action) => {
            const foundAnimation = THREE.AnimationClip.findByName(
                animations,
                action
            )
            const clipAction = this.mixer.clipAction(foundAnimation)
            this.animations.set(action, clipAction)
            clipAction.play()
        })
    }
    
    update(delta) {
        this.mixer.update(delta)
    }
}

export { Dragon }
