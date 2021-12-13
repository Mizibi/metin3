import { Input } from './../system/Input.js'
import { StateMachine } from './../StateMachine.js'

const path = '../ressources/untitledmorecomplete.glb'

const ACCELERATION_X = 1
const ACCELERATION_Y = 0.25
const ACCELERATION_Z = 1.5

const DECCELERATION_X = -0.0005
const DECCELERATION_Y = -0.0001
const DECCELERATION_Z = -5.0

class Character {
    constructor(scene) {
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

        this.model.traverse((node) => {
            // Postion, scale and alter shadows to model
            if (node instanceof THREE.Mesh) {
                node.castShadow = true
            }
        })

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

    initDebug() {
        // let anim = window.GUI.addFolder('Animations')
        // anim.add(this.settings, 'modify idle weight', 0.0, 1.0, 0.01).listen().onChange((weight) => {
        //     setWeight(this.animations.get('Idle'), weight)
        // })
        // anim.add(this.settings, 'modify walk weight', 0.0, 1.0, 0.01).listen().onChange((weight) => {
        //     setWeight(this.animations.get('Walk'), weight)
        // })
        // anim.add(this.settings, 'modify run weight', 0.0, 1.0, 0.01).listen().onChange((weight) => {
        //     setWeight(this.animations.get('Run'), weight)
        // })

        const folder1 = window.GUI.addFolder('Visibility')
        const folder2 = window.GUI.addFolder('Activation/Deactivation')
        const folder3 = window.GUI.addFolder('Pausing/Stepping')
        const folder4 = window.GUI.addFolder('Crossfading')
        const folder5 = window.GUI.addFolder('Blend Weights')
        const folder6 = window.GUI.addFolder('General Speed')
        let settings = {
            'show model': true,
            'show skeleton': false,
            // 'deactivate all': deactivateAllActions,
            // 'activate all': activateAllActions,
            // 'pause/continue': pauseContinue,
            // 'make single step': toSingleStepMode,
            'modify step size': 0.05,
            'from walk to idle': function () {
                prepareCrossFade(walkAction, idleAction, 1.0)
            },
            'from idle to walk': function () {
                prepareCrossFade(idleAction, walkAction, 0.5)
            },
            'from walk to run': function () {
                prepareCrossFade(walkAction, runAction, 2.5)
            },
            'from run to walk': function () {
                prepareCrossFade(runAction, walkAction, 5.0)
            },
            'use default duration': true,
            'set custom duration': 3.5,
            'modify idle weight': 0.0,
            'modify walk weight': 1.0,
            'modify run weight': 0.0,
            'modify time scale': 1.0,
        }

        // folder1.add( settings, 'show model' ).onChange( showModel );
        // folder1.add( settings, 'show skeleton' ).onChange( showSkeleton );
        // folder2.add( settings, 'deactivate all' );
        // folder2.add( settings, 'activate all' );
        // folder3.add( settings, 'pause/continue' );
        // folder3.add( settings, 'make single step' );
        folder3.add(settings, 'modify step size', 0.01, 0.1, 0.001)
        const crossFadeControls = []
        function modifyTimeScale(speed) {
            this.mixer.timeScale = speed
        }
        crossFadeControls.push(folder4.add(settings, 'from walk to idle'))
        crossFadeControls.push(folder4.add(settings, 'from idle to walk'))
        crossFadeControls.push(folder4.add(settings, 'from walk to run'))
        crossFadeControls.push(folder4.add(settings, 'from run to walk'))
        folder4.add(settings, 'use default duration')
        folder4.add(settings, 'set custom duration', 0, 10, 0.01)
        folder5
            .add(settings, 'modify idle weight', 0.0, 1.0, 0.01)
            .listen()
            .onChange(function (weight) {
                setWeight(idleAction, weight)
            })
        folder5
            .add(settings, 'modify walk weight', 0.0, 1.0, 0.01)
            .listen()
            .onChange(function (weight) {
                setWeight(walkAction, weight)
            })
        folder5
            .add(settings, 'modify run weight', 0.0, 1.0, 0.01)
            .listen()
            .onChange(function (weight) {
                setWeight(runAction, weight)
            })
        folder6
            .add(settings, 'modify time scale', 0.0, 1.5, 0.01)
            .onChange(modifyTimeScale.bind(this))

        folder1.open()
        folder2.open()
        folder3.open()
        folder4.open()
        folder5.open()
        folder6.open()
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

        const object = this.scene.getObjectByName( "enemy" );
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
