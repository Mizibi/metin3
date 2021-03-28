const groundSize = 10

function createFloor() {
    var groundGeo = new THREE.PlaneBufferGeometry(groundSize, groundSize, groundSize / 4, groundSize / 4);
    var groundMat = new THREE.MeshPhongMaterial({
        color: 0xa0adaf,
        shininess: 30,
        specular: 0x111111
        // wireframe: true,
    });
    var ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = 0;
    ground.rotateX(-Math.PI / 2)
    ground.receiveShadow = true

    return ground
}

export { createFloor }