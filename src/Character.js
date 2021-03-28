import { Input } from './system/Input.js'
import { StateMachine } from './StateMachine.js'
class Character {
    constructor() {
        this.model = null
        this.mixer = null

        this.input = new Input()
        // <string, action> name, action clip
        this.animations = new Map()

        this.acceleration = new THREE.Vector3(1, 0.25, 1.0)
        this.velocity = new THREE.Vector3(0, 0, 0)
    }

    async init() {
        const loadedCharacter = await new THREE.GLTFLoader(window.LOADINGMANAGER)
            .loadAsync('../ressources/fixedMainCharacter.glb')


        // Store loaded 3d object and animations into class
        this.model = loadedCharacter.scene
        this.mixer = new THREE.AnimationMixer(this.model)

        // Postion, scale and alter shadows to model here
        this.model.traverse(node => { 
            if (node instanceof THREE.Mesh) { 
                node.castShadow = true
            }
        })

        this.model.scale.setScalar(0.5)
        // ...

        this.initAnimations(loadedCharacter.animations)

        // Add model updater
        this.model.tick = (delta) => {

            this.stateMachine.Update(delta, this.input)

            this.update(delta)
            // Update animation mixer
            this.mixer.update(delta)
        }
    }

    initAnimations(animations) {
        const actions = ['Idle', 'Walk', 'Run']

        animations.forEach(animation => {
            if (actions.includes(animation.name)) {
                const action = this.mixer.clipAction(animation)

                this.animations.set(animation.name, action)
            }
        })

        this.stateMachine = new StateMachine(this.animations, this.model)
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

    update(delta) {
        const velocity = this.velocity;
        const acceleration = this.acceleration.clone();

        const _Q = new THREE.Quaternion();
        const _A = new THREE.Vector3();
        const _R = this.model.quaternion.clone();

        if (this.input.keys.forward) {
            this.model.translateZ(acceleration.z * delta)
        }
        if (this.input.keys.backward) {
            this.model.translateZ(- acceleration.z * delta)
        }

        if (this.input.keys.left) {
            _A.set(0, 1, 0);
            _Q.setFromAxisAngle(_A, 4.0 * Math.PI * delta * acceleration.y);
            _R.multiply(_Q);
        }
        if (this.input.keys.right) {
            _A.set(0, 1, 0);
            _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * delta * acceleration.y);
            _R.multiply(_Q);
        }

        this.model.quaternion.copy(_R);
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
