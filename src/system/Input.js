class Input {
    constructor() {
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            space: false,
            shift: false,
        }

        document.addEventListener('keydown', this.keyDown.bind(this), false)
        document.addEventListener('keyup', this.keyUp.bind(this), false)
    }

    keyDown(event) {
        switch (event.keyCode) {
            case 87: // w
                this.keys.forward = true
                break
            case 90: // z
                this.keys.forward = true
                break
            case 65: // a
                this.keys.left = true
                break
            case 81: // q
                this.keys.forward = true
                break
            case 83: // s
                this.keys.backward = true
                break
            case 68: // d
                this.keys.right = true
                break
            case 32: // SPACE
                this.keys.space = true
                break
            case 16: // SHIFT
                this.keys.shift = true
                break
        }
    }
    keyUp(event) {
        switch (event.keyCode) {
            case 87: // w
                this.keys.forward = false
                break
            case 90: // z
                this.keys.forward = false
                break
            case 65: // a
                this.keys.left = false
                break
            case 81: // q
                this.keys.forward = false
                break
            case 83: // s
                this.keys.backward = false
                break
            case 68: // d
                this.keys.right = false
                break
            case 32: // SPACE
                this.keys.space = false
                break
            case 16: // SHIFT
                this.keys.shift = false
                break
        }
    }
}

export { Input }
