const FLOOR_SIZE = 1000

class Floor {
    constructor(scene) {
        var floorGeo = new THREE.PlaneBufferGeometry(FLOOR_SIZE, FLOOR_SIZE, FLOOR_SIZE / 4, FLOOR_SIZE / 4);
        var floorMat = new THREE.MeshPhongMaterial({
            color: 0xa0adaf,
            // wireframe: true,
        });
        var floor = new THREE.Mesh(floorGeo, floorMat);
        floor.position.y = 0;
        floor.rotateX(-Math.PI / 2)
        floor.castShadow = false 
        floor.receiveShadow = true 
        
        scene.add(floor)

        this.model = floor

        if (window.DEBUG) {
            const floorFolder = window.GUI.addFolder('floor')
            floorFolder.add(floor, 'visible')
            floorFolder.add(floor.material, 'wireframe')
            floorFolder.add(floor.position, 'x', -10, 10)
            floorFolder.add(floor.position, 'y', -10, 10)
            floorFolder.add(floor.position, 'z', -10, 10)
        }
    }

    init() {
    }

    update() {
    }
}

export { Floor }
