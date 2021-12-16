// Scene specifics should be passed as arguments
function createScene(sceneColor) {
    const scene = new THREE.Scene()

    scene.background = new THREE.Color(sceneColor || 'white')

    // Temp fog, to determine with gui
    scene.fog = new THREE.FogExp2(0x89b2eb, 0.002);

    // Inspector
    window.scene = scene
    window.THREE = THREE
    return scene
}

export { createScene }