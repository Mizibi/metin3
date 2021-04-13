class StateMachine {
    constructor(animations, model) {
        this.states = {}
        this.model = model
        this.animations = animations

        this.currentState = null
        this.prevState = null

        // Declare all states
        // this.addState('Idle', IdleState)
        this.addState('Walk', WalkState)
        this.addState('Sidle', SidleState)
        this.addState('Attack', AttackState)

        // Default state for character
        this.setState('Sidle')
    }

    addState(name, type) {
        this.states[name] = type
    }

    setState(stateName) {
        this.prevState = this.currentState

        this.currentState = new this.states[stateName](this)
        this.currentState.Enter(this.prevState)
    }

    Update(delta, input) {
        if (this.currentState) {
            this.currentState.Update(input)
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
        return 'Idle'
    }

    Enter(prevState) {
        const idleAction = this._parent.animations.get('Idle')
        if (prevState) {
            const prevAction = this._parent.animations.get(prevState.Name)

            idleAction.time = 0.0
            idleAction.enabled = true
            idleAction.setEffectiveTimeScale(1.0)
            idleAction.setEffectiveWeight(1.0)
            idleAction.crossFadeFrom(prevAction, 0.3, true)
        }
        idleAction.play()
    }

    Update(input) {
        if (input.keys.forward || input.keys.backward) {
            this._parent.setState('Walk')
        }
    }
}

class WalkState extends State {
    constructor(parent) {
        super(parent)
    }

    get Name() {
        return 'swalk'
    }

    Enter(prevState) {
        const walkAction = this._parent.animations.get('swalk')
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
        // this._parent.model.
        if (!input.keys.forward && !input.keys.backward) {
            this._parent.setState('Sidle')
        }

        if (input.keys.space) {
            this._parent.setState('Attack')
        }
    }
}

class SidleState extends State {
    constructor(parent) {
        super(parent)
    }

    get Name() {
        return 'sidle'
    }

    Enter(prevState) {
        const sidleAction = this._parent.animations.get('sidle')
        if (prevState) {
            const prevAction = this._parent.animations.get(prevState.Name)

            sidleAction.time = 0.0
            sidleAction.enabled = true
            sidleAction.setEffectiveTimeScale(1.0)
            sidleAction.setEffectiveWeight(1.0)
            sidleAction.crossFadeFrom(prevAction, 0.3, true)
        }
        sidleAction.play()
    }

    Update(input) {
        if (input.keys.forward || input.keys.backward) {
            this._parent.setState('Walk')
        }
        if (input.keys.space) {
            this._parent.setState('Attack')
        }
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
        const sidleAction = this._parent.animations.get('Slash1')

        if (prevState) {
            const prevAction = this._parent.animations.get(prevState.Name)

            sidleAction.time = 0.0
            sidleAction.enabled = true
            sidleAction.setLoop(THREE.LoopOnce, 1)
            sidleAction.clampWhenFinished = true
            sidleAction.setEffectiveTimeScale(1.0)
            sidleAction.setEffectiveWeight(1.0)
            sidleAction.crossFadeFrom(prevAction, 0.3, true)
        }
        sidleAction.play()
    }

    Update(input) {
        const currentAnim = this._parent.animations.get('Slash1')
        // 0.5 is to adjust attack end too long
        if (currentAnim.time >= currentAnim._clip.duration - 0.5) {
            this._parent.setState('Sidle')
        }
    }
}
export { StateMachine }
