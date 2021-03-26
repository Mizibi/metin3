import { createControls } from './system/Controls.js'
import { Resizer } from './system/Resizer.js'
import { Loop } from './system/Loop.js'
import { createRenderer } from './system/Renderer.js'
import { createScene } from './system/Scene.js'
import { createCamera } from './system/Camera.js'

import { createLights } from './lights/Light.js'
import { Character } from './Character.js'

class World {
    constructor() {
        // World system
        this.renderer = createRenderer()
        this.camera = createCamera()

        this.controls = createControls(this.camera, this.renderer)
        this.resizer = new Resizer(this.camera, this.renderer)

        this.scene = createScene()
        this.loop = new Loop(this.camera, this.scene, this.renderer)

        // 3D Objects
        /* static */
        this.lights = createLights()
        /* dynamic */
        this.entities = [new Character()]
    }

    async init() {
        /* static */
        this.lights.forEach(light => {
            this.scene.add(light)
        })

        /* dynamic */
        for (const entity of this.entities) {
            await entity.init()
            this.scene.add(entity.model)
            this.loop.updatables.push(entity.model)
        }
    }

    start() {
        this.loop.start(this.input)
    }

    stop() {
        this.loop.stop()
    }
}

export { World }