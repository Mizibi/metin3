

function createLights() {
    const spotLight = new THREE.SpotLight(0xffa95c, 4)
    const hemiLight = new THREE.HemisphereLight( 0xffeeb1, 0x080820, 4 )

    spotLight.castShadow = true

    return [spotLight, hemiLight]
}

export { createLights }