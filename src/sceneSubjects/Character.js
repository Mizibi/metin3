import { Input } from './../system/Input.js'
import { StateMachine } from './../StateMachine.js'

const path = '../ressources/untitledmorecomplete.glb'

const ACCELERATION_X = 1
const ACCELERATION_Y = 0.25
const ACCELERATION_Z = 3

const DECCELERATION_X = -0.0005
const DECCELERATION_Y = -0.0001
const DECCELERATION_Z = -5.0

class Character {
    constructor(scene) {
        this.raycaster = new THREE.Raycaster()
        this.inAir = false
        this.scene = scene

        this.model = null

        // Animations
        this.mixer = null
        this.stateMachine = null
        this.animations = new Map() // <string, action>

        this.input = new Input()

        // This should be called speed, there is no velocity needed for now
        this.acceleration = new THREE.Vector3(
            ACCELERATION_X,
            ACCELERATION_Y,
            ACCELERATION_Z
        )
        this.decceleration = new THREE.Vector3(
            DECCELERATION_X,
            DECCELERATION_Y,
            DECCELERATION_Z
        )
        this.velocity = new THREE.Vector3(0, 0, 0)
    }

    async init() {
        const object = await new THREE.GLTFLoader(
            window.LOADINGMANAGER
        ).loadAsync(path)

        // This would maybe benefit object.scene.children[0]
        this.model = object.scene

        this.model.name = 'player'
        this.model.traverse((node) => {
            // Postion, scale and alter shadows to model
            if (node instanceof THREE.Mesh) {
                node.castShadow = true
            }
        })

        this.model.position.y = 1
        this.model.scale.setScalar(0.5)

        this.mixer = new THREE.AnimationMixer(this.model)
        this.initAnimations(object.animations)

        this.scene.add(this.model)

        // EQUIPPED ITEM TODO
        // this.bones = this.model.children[0].children[1].skeleton.bones
        // this.sword = await new THREE
        //     .GLTFLoader(window.LOADINGMANAGER)
        //     .loadAsync('../ressources/sw.glb').scene
        // this.sword.rotateX(-Math.PI / 3);
        // this.sword.rotation.set(new THREE.Vector3( 0, 0, -1))
        // this.sword.position.y += 5
        // this.sword.position.x -= 1
        // this.sword.position.z -= 10
        // this.sword.rotation.x += 1.2
        // this.sword.rotation.y += 1.4
        // this.sword.scale.setScalar(15)
        //                     character   idk         idk         idk         idk         left shoulder arm        forearm    left hand
        // this.model.children[0].children[0].children[0].children[0].children[0].children[2].children[0].children[0].children[0].add(this.sword)
        // console.log(this.model.children[0].children[0].children[0].children[0].children[0].children[1].children[0].children[0].children[0])

        if (window.DEBUG) {
            const characterFolder = window.GUI.addFolder('character')
            characterFolder.add(this.model, 'visible')
        }

        const geometry = new THREE.ConeGeometry(0.1, 0.2, 12)
        // geometry.translate(0, 50, 0)
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
        this.helper = new THREE.Mesh(geometry, material)
        this.helper.rotateX(Math.PI)
        this.helper.position.x = 5
        this.helper.position.y = 1
        this.scene.add(this.helper)
    }

    initAnimations(animations) {
        const actions = ['idle', 'walking', 'walkbackward', 'running']

        actions.forEach((action) => {
            const foundAnimation = THREE.AnimationClip.findByName(
                animations,
                action
            )
            this.animations.set(action, this.mixer.clipAction(foundAnimation))
        })

        this.stateMachine = new StateMachine({
            initialState: 'idle',
            idle: {
                enter: () => {
                    const foundAnim = this.animations.get('idle')
                    if (this.stateMachine && this.stateMachine.oldState) {
                        const previousAnim = this.animations.get(
                            this.stateMachine.oldState
                        )
                        fadeAnimation(foundAnim, previousAnim, 0, 1, 1, 0.2)
                    }
                    foundAnim.play()
                },
                update: () => {
                    if (this.input.keys.forward) {
                        this.stateMachine.transition('walking')
                    } else if (this.input.keys.backward) {
                        this.stateMachine.transition('walkbackward')
                    }
                },
                exit: () => {},
            },
            walking: {
                enter: () => {
                    const foundAnim = this.animations.get('walking')
                    if (this.stateMachine.oldState) {
                        const previousAnim = this.animations.get(
                            this.stateMachine.oldState
                        )
                        fadeAnimation(foundAnim, previousAnim, 0, 1, 1, 0.2)

                        if (this.stateMachine.oldState === 'running') {
                            const ratio =
                                foundAnim.getClip().duration /
                                previousAnim.getClip().duration
                            foundAnim.time = previousAnim.time * ratio
                        }
                    }
                    foundAnim.play()
                },
                update: () => {
                    if (!this.input.keys.forward) {
                        this.stateMachine.transition('idle')
                    }
                    if (
                        this.input.keys.shift &&
                        this.stateMachine.currentState !== 'idle'
                    ) {
                        this.stateMachine.transition('running')
                    }
                },
                exit: () => {},
            },
            walkbackward: {
                enter: () => {
                    const foundAnim = this.animations.get('walkbackward')
                    if (this.stateMachine.oldState) {
                        const previousAnim = this.animations.get(
                            this.stateMachine.oldState
                        )
                        fadeAnimation(foundAnim, previousAnim, 0, 1, 1, 0.2)
                    }
                    foundAnim.play()
                },
                update: () => {
                    if (!this.input.keys.backward) {
                        this.stateMachine.transition('idle')
                    }
                },
                exit: () => {},
            },
            running: {
                enter: () => {
                    const foundAnim = this.animations.get('running')
                    if (this.stateMachine.oldState) {
                        const previousAnim = this.animations.get(
                            this.stateMachine.oldState
                        )
                        fadeAnimation(foundAnim, previousAnim, 0, 1, 1, 0.2)

                        if (this.stateMachine.oldState === 'walking') {
                            const ratio =
                                foundAnim.getClip().duration /
                                previousAnim.getClip().duration
                            foundAnim.time = previousAnim.time * ratio
                        }
                    }
                    foundAnim.play()
                },
                update: () => {
                    if (!this.input.keys.shift || !this.input.keys.forward) {
                        this.stateMachine.transition('walking')
                    }
                },
                exit: () => {},
            },
        })
    }

    update(delta) {
        // Animation update
        this.stateMachine.update(delta)
        this.mixer.update(delta)

        // Avoid movements if state is not movement linked
        const currentState = this.stateMachine.currentState

        // TODO ADD left and right rotation, complicated animation
        // TODO handle jump ? should handle physics too then

        if (
            currentState !== 'idle' &&
            currentState !== 'walking' &&
            currentState !== 'walkbackward' &&
            currentState !== 'running'
        ) {
            return
        }

        const _Q = new THREE.Quaternion()
        const _A = new THREE.Vector3(0, 1, 0)
        const _R = this.model.quaternion.clone()

        // Movements
        if (this.input.keys.forward) {
            if (this.input.keys.shift) {
                this.model.translateZ(this.acceleration.z * 2 * delta)
            } else {
                this.model.translateZ(this.acceleration.z * delta)
            }
        }
        if (this.input.keys.backward) {
            this.model.translateZ(-this.acceleration.z * delta)
        }

        // Rotate
        if (this.input.keys.left && !this.input.keys.right) {
            _Q.setFromAxisAngle(_A, 2.0 * Math.PI * delta * this.acceleration.y)
            _R.multiply(_Q)
        }
        if (this.input.keys.right && !this.input.keys.left) {
            _Q.setFromAxisAngle(
                _A,
                2.0 * -Math.PI * delta * this.acceleration.y
            )
            _R.multiply(_Q)
        }

        this.model.quaternion.copy(_R)

        // const object = this.scene.getObjectByName( "enemy" );

        const dir = new THREE.Vector3(0, -1, 0)
        // Check intersection
        this.raycaster.set(this.model.position, dir)
        const intersects = this.raycaster.intersectObjects(this.scene.children)
        if (intersects.length > 0) {
            // Maybe check if ground
            if (intersects[0].distance < 0.1) {
                this.inAir = false
            }
        }
        // else this.inAir = true
        for (let i = 0; i < intersects.length; i++) {
            // intersects[i].object.material.color.set(0xff0000)
        }
        if (this.inAir) {
            this.model.position.y -= 0.05
        }
    }
}

function fadeAnimation(
    animation,
    previousAnimation,
    time,
    timeScale,
    weight,
    delay
) {
    animation.enabled = true

    animation.time = time

    animation.setEffectiveTimeScale(timeScale)
    animation.setEffectiveWeight(weight)

    animation.crossFadeFrom(previousAnimation, delay, true)
}

function setWeight(action, weight) {
    action.enabled = true
    action.setEffectiveTimeScale(1)
    action.setEffectiveWeight(weight)
}

export { Character }
