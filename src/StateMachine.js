class StateMachine {
    constructor(stateMachineDefinition) {
        this.stateMachineDefinition = stateMachineDefinition
        this.transition(stateMachineDefinition.initialState)
    }

    transition(state) {
        const oldState = this.stateMachineDefinition[this.currentState]
        this.oldState = this.currentState
        if (oldState && oldState.exit) {
            oldState.exit.call(this)
        }
        this.currentState = state
        if (this.stateMachineDefinition[state].enter) {
            this.stateMachineDefinition[state].enter.call(this)
        }
    }

    update(delta) {
        const currentState = this.stateMachineDefinition[this.currentState]
        if (currentState.update) {
            currentState.update.call(this, delta)
        }
    }
}

class State {
    constructor(parent) {
        this._parent = parent
    }

    Enter() { }
    Exit() { }
    Update() { }
}

class IdleState extends State {
    constructor(parent) {
        super(parent)
    }

    get Name() {
        return 'idle'
    }

    Enter(prevState) {
        const sidleAction = this._parent.animations.get('idle')
        if (prevState) {
            const prevAction = this._parent.animations.get(prevState.Name)

            sidleAction.time = 0.0
            sidleAction.enabled = true
            sidleAction.setEffectiveTimeScale(1.0)
            sidleAction.setEffectiveWeight(1.0)
            sidleAction.crossFadeFrom(prevAction, 0.2, true)
        }
        sidleAction.play()
    }

    Update(input) {
        if (input.keys.space) {
            return this._parent.setState('Jump')
        }
        if (input.keys.forward || input.keys.backward) {
            this._parent.setState('Walk')
        }
        // if (input.keys.space) {
        //     this._parent.setState('Attack')
        // }
    }
}

class WalkState extends State {
    constructor(parent) {
        super(parent)
    }

    get Name() {
        return 'walking'
    }

    Enter(prevState) {
        const walkAction = this._parent.animations.get('walking')
        if (prevState) {
            const prevAction = this._parent.animations.get(prevState.Name)

            walkAction.time = 0.0
            walkAction.enabled = true
            walkAction.setEffectiveTimeScale(1.0)
            walkAction.setEffectiveWeight(1.0)
            walkAction.crossFadeFrom(prevAction, 0.3, true)
        }
        walkAction.play()
    }

    Update(input) {
        if (input.keys.space) {
            return this._parent.setState('Jump')
        }
        
        // this._parent.model.
        if (!input.keys.forward && !input.keys.backward) {
            this._parent.setState('Idle')
        }

        // if (input.keys.space) {
        //     this._parent.setState('Attack')
        // }

        if (input.keys.shift) {
            this._parent.setState('Run')
        }
    }
}

class RunState extends State {
    constructor(parent) {
        super(parent)
    }

    get Name() {
        return 'running'
    }

    Enter(prevState) {
        const runAction = this._parent.animations.get('running')
        if (prevState) {
            const prevAction = this._parent.animations.get(prevState.Name)

            runAction.time = 0.0
            runAction.enabled = true
            runAction.setEffectiveTimeScale(1.0)
            runAction.setEffectiveWeight(1.0)
            runAction.crossFadeFrom(prevAction, 0.2, true)
        }
        runAction.play()
    }

    Update(input) {
        if (input.keys.space) {
            return this._parent.setState('Jump')
        }

        // this._parent.model.
        if (!input.keys.shift) {
            this._parent.setState('Walk')
        }
    }
}

class JumpState extends State {
    constructor(parent) {
        super(parent)
    }

    get Name() {
        return 'jump'
    }

    Enter(prevState) {
        const jumpAction = this._parent.animations.get('jump')
        if (prevState) {
            const prevAction = this._parent.animations.get(prevState.Name)

            jumpAction.time = 0.4
            jumpAction.enabled = true
            jumpAction.setEffectiveTimeScale(1.0)
            jumpAction.setEffectiveWeight(1.0)
            jumpAction.crossFadeFrom(prevAction, 0.1, true)
        }
        jumpAction.play()
    }

    Update(input, delta) {
        const currentAnim = this._parent.animations.get('jump')
        if (currentAnim.time >= currentAnim._clip.duration - 0.8) {
                this._parent.setState('Idle')
        }
        // this._parent.model.
        // if (!input.keys.shift) {
        //     this._parent.setState('Walk')
        // }
    }
}

class AttackState extends State {
    constructor(parent) {
        super(parent)
        this._FinishedCallback = () => {
            this._Finished();
        }
    }

    get Name() {
        return 'Slash1'
    }

    Enter(prevState) {
        const slashAction = this._parent.animations.get('Slash1')
 
        if (prevState) {
            const prevAction = this._parent.animations.get(prevState.Name)

            slashAction.time = 0.8
            slashAction.enabled = true
            slashAction.setLoop(THREE.LoopOnce, 1)
            slashAction.clampWhenFinished = true
            slashAction.setEffectiveTimeScale(1.0)
            slashAction.setEffectiveWeight(1.0)
            slashAction.crossFadeFrom(prevAction, 0.2, true)
        }
        slashAction.play()
    }

    Update(input) {
        const currentAnim = this._parent.animations.get('Slash1')
        // 0.5 is to adjust attack end too long
        if (currentAnim.time >= currentAnim._clip.duration - 0.5) {
            this._parent.setState('Idle')
        }
    }
}
export { StateMachine }
