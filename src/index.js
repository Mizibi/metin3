import { World } from './World.js'
import { createLoading } from './system/Loading.js'

window.DEBUG = window.location.search.includes('debug')
window.GUI = new dat.GUI()

async function main() {
    const world = new World()

    document.body.appendChild(world.renderer.domElement)
    world.renderer.domElement.style.visibility = 'hidden'

    window.LOADINGMANAGER = createLoading(world.renderer)
    
    await world.init()

    world.start()
}

main().catch(e => console.error(e))