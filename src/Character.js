import { Input } from './system/Input.js'
import { StateMachine } from './StateMachine.js'

const path = '../ressources/characterplussword.glb'
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
            .loadAsync(path)
        
        // Store loaded 3d object and animations into class
        this.model = loadedCharacter.scene
        this.mixer = new THREE.AnimationMixer(this.model)

        this.bones = this.model.children[0].children[1].skeleton.bones
        console.log(this.bones)
        const loadedSword = await new THREE.GLTFLoader(window.LOADINGMANAGER)
        .loadAsync('../ressources/sw.glb')
        this.sword = loadedSword.scene
        // this.sword.rotateX(-Math.PI / 3);
        // this.sword.rotation.set(new THREE.Vector3( 0, 0, -1))

        this.sword.position.y += 5
        this.sword.position.x -= 1
        this.sword.position.z -= 10

        this.sword.rotation.x += 1.2
        this.sword.rotation.y += 1.4

        this.sword.scale.setScalar(15)
        console.log(this.sword)

        //                     character   idk         idk         idk         idk         left shoulder arm        forearm    left hand
        this.model.children[0].children[0].children[0].children[0].children[0].children[2].children[0].children[0].children[0].add(this.sword)
        // console.log(this.model.children[0].children[0].children[0].children[0].children[0].children[1].children[0].children[0].children[0])
        console.log(this.model.children[0].children[0].children[0].children[0].children[0].children[1].children[0].children[0].children[0])

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
            // this.sword.rotation.y += 0.01

            this.stateMachine.Update(delta, this.input)

            this.update(delta)
            // Update animation mixer
            this.mixer.update(delta)
        }
    }

    initAnimations(animations) {
        const actions = [/*'Idle', 'Walk', 'Run', */'sidle', 'swalk', 'Slash1']

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

        // TODO avoid movement when attacking
        if (this.input.keys.forward && this.stateMachine.currentState.Name !== 'Slash1') {
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
