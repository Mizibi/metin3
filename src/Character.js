import { Input } from './system/Input.js'

class Character {
    constructor() {
        this.model = undefined
        // <string, action> name, action clip
        this.animations = new Map()
        this.mixer = undefined

        this.input = new Input()

        this.settings = {
            'modify idle weight': 1.0,
            'modify walk weight': 0.0,
            'modify run weight': 0.0,
        }
    }

    async init() {
        const loadedCharacter = await new THREE.GLTFLoader(window.LOADINGMANAGER)
            .loadAsync('../ressources/fixedMainCharacter.glb')

        this.model = loadedCharacter.scene

        // Postion, scale and do stuff to model here
        loadedCharacter.scene.scale.setScalar(0.5)

        // Clip model animations here
        this.mixer = new THREE.AnimationMixer(this.model)

        // Add model updater
        this.model.tick = (delta) => {
            this.handleMovements()
            this.mixer.update(delta)
        }

        this.initAnimations(loadedCharacter.animations)

        this.initDebug()
    }

    initAnimations(animations) {
        const actions = ['Idle', 'Walk', 'Run']

        animations.forEach(animation => {
            console.log(animation)
            if (actions.includes(animation.name)) {
                const action = this.mixer.clipAction(animation)
                this.animations.set(animation.name, action)
                action.play()
                action.setEffectiveWeight(0)
            }
        })

        this.animations.get('Idle').setEffectiveWeight(1)
        console.log(this.mixer)
    }

    initDebug() {
        let anim = window.GUI.addFolder('Animations')
        anim.add(this.settings, 'modify idle weight', 0.0, 1.0, 0.01).listen().onChange((weight) => {
            setWeight(this.animations.get('Idle'), weight)
        })
        anim.add(this.settings, 'modify walk weight', 0.0, 1.0, 0.01).listen().onChange((weight) => {
            setWeight(this.animations.get('Walk'), weight)
        })
        anim.add(this.settings, 'modify run weight', 0.0, 1.0, 0.01).listen().onChange((weight) => {
            setWeight(this.animations.get('Run'), weight)
        })
    }

    handleMovements() {
        if (this.input.keys.forward) {
            this.animations.get('Idle').setEffectiveWeight(0)
            this.animations.get('Walk').setEffectiveWeight(1)

            this.model.position.z += 0.01
        }
        else if (this.input.keys.shift) {
            this.animations.get('Idle').setEffectiveWeight(0)
            this.animations.get('Run').setEffectiveWeight(1)

            this.model.position.z += 0.02
        }
        else if (this.input.keys.backward) {
            this.animations.get('Idle').setEffectiveWeight(0)
            this.animations.get('Walk').setEffectiveWeight(1)
            
            this.model.position.z -= 0.01
        }
        else {
            this.animations.get('Idle').setEffectiveWeight(1)
            this.animations.get('Walk').setEffectiveWeight(0)
            this.animations.get('Run').setEffectiveWeight(0)
        }
    }
}

function setWeight(action, weight) {
    action.enabled = true
    action.setEffectiveTimeScale(1)
    action.setEffectiveWeight(weight)
}

// TODO From idle to walk
// From walk to run

export { Character }
