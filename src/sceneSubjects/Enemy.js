import { StateMachine } from './../StateMachine.js'
const path = '../ressources/dummy.glb'

class Enemy {
    constructor(scene) {
        this.scene = scene

        this.model = null

        // Animations
        this.mixer = null
        this.stateMachine = null
        this.animations = new Map() // <string, action>
    }

    async init() {
        const object = await new THREE.GLTFLoader(
            window.LOADINGMANAGER
        ).loadAsync(path)
        this.model = object.scene
        this.model.name = 'enemy'
        this.model.traverse((node) => {
            // Postion, scale and alter shadows to model
            if (node instanceof THREE.Mesh) {
                node.castShadow = true
            }
        })
        this.model.scale.setScalar(0.5)
        
        this.model.position.x = 0;
        this.model.position.z = 5;
        this.model.rotation.y = Math.PI;

        this.mixer = new THREE.AnimationMixer(this.model)
        this.initAnimations(object.animations)

        this.scene.add(this.model)

    }

    initAnimations(animations) {
        const actions = ['Idle', 'Damage']

        actions.forEach((action) => {
            const foundAnimation = THREE.AnimationClip.findByName(
                animations,
                action
            )
            this.animations.set(action, this.mixer.clipAction(foundAnimation))
        })

        this.stateMachine = new StateMachine({
            initialState: 'Idle',
            Idle: {
                enter: () => {
                    const foundAnim = this.animations.get('Idle')
                    if (this.stateMachine && this.stateMachine.oldState) {
                        const previousAnim = this.animations.get(
                            this.stateMachine.oldState
                        )
                        fadeAnimation(foundAnim, previousAnim, 0, 1, 1, 0.2)
                    }
                    foundAnim.play()
                },
                update: () => {},
                exit: () => {},
            },
            Damage: {
                enter: () => {
                    const foundAnim = this.animations.get('Damage')
                    if (this.stateMachine.oldState) {
                        const previousAnim = this.animations.get(
                            this.stateMachine.oldState
                        )
                        fadeAnimation(foundAnim, previousAnim, 0, 1, 1, 0.2)
                    }
                    foundAnim.play()
                },
                update: () => {
                },
                exit: () => {},
            },
        })
    }

    update(delta) {
        // Animation update
        this.stateMachine.update(delta)
        this.mixer.update(delta)

        if (this.isHit) {
            this.stateMachine.transition('Damage')
        }
    }
}

export { Enemy }
