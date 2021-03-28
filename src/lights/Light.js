function createLights() {
    const spotLight = new THREE.SpotLight(0xffa95c, 4)
    spotLight.castShadow = true
    spotLight.position.y = 1.5
    spotLight.position.x = 1
    let geometry = new THREE.SphereGeometry( 0.1, 12, 6 );
    let material = new THREE.MeshBasicMaterial( { color: 'red', wireframe: true } );
    material.color.multiplyScalar( 1.5 );
    let sphere = new THREE.Mesh( geometry, material );
    spotLight.add( sphere )

    const hemiLight = new THREE.HemisphereLight( 0xffeeb1, 0x080820, 4 )

    return [spotLight, hemiLight]
}

export { createLights }