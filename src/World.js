import { createControls } from './system/Controls.js'
import { Resizer } from './system/Resizer.js'
import { Loop } from './system/Loop.js'
import { createRenderer } from './system/Renderer.js'
import { createScene } from './system/Scene.js'
import { createCamera } from './system/Camera.js'

import { createLights } from './lights/Light.js'
import { createFloor } from './Floor.js'
import { Character } from './Character.js'

class World {
    constructor() {
        // World system
        this.renderer = createRenderer()

        
        this.scene = createScene()

        // 3D Objects
        /* static */
        this.lights = createLights()
        this.floor = createFloor()
        /* dynamic */
        this.entities = [new Character()]
    }

    async init() {
        /* static */
        this.scene.add(this.floor)
        this.lights.forEach(light => {
            this.scene.add(light)
        })

        /* dynamic */
        for (const entity of this.entities) {
            await entity.init()
            this.scene.add(entity.model)
        }

        // attach camera to char
        this.camera = createCamera(this.entities[0])

        this.controls = createControls(this.camera.camera, this.renderer)
        this.resizer = new Resizer(this.camera.camera, this.renderer)
        this.loop = new Loop(this.camera, this.scene, this.renderer, this.controls)

        for (const entity of this.entities) {
            this.loop.updatables.push(entity.model)
        }
    }

    start() {
        this.loop.start()
    }

    stop() {
        this.loop.stop()
    }
}

export { World }