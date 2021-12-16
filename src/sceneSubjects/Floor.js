const FLOOR_SIZE = 1000
const WORLD_WIDTH = FLOOR_SIZE / 4
const WORLD_HEIGHT = FLOOR_SIZE / 4
var seed = 10

const HEIGHT_AMPLIFIER = 1

const IMAGE_SRC = '../../ressources/simplex.png'

function random() {
    var x = Math.sin(seed++) * 10000
    return x - Math.floor(x)
}

class Floor {
    constructor(scene) {
        this.scene = scene
        var floorGeo = new THREE.PlaneGeometry(
            FLOOR_SIZE,
            FLOOR_SIZE,
            WORLD_WIDTH,
            WORLD_HEIGHT
        )

        // const texture = new THREE.CanvasTexture(
        //     generateTexture(data, WORLD_WIDTH, WORLD_HEIGHT)
        // )
        // texture.wrapS = THREE.ClampToEdgeWrapping
        // texture.wrapT = THREE.ClampToEdgeWrapping
        // var floorMat = new THREE.MeshBasicMaterial({
        //     // color: 0xa0adaf,
        //     // wireframe: true,
        //     map: texture,
        // })
        // var floor = new THREE.Mesh(floorGeo, floorMat)

        // floor.position.y = 0
        // floor.rotateX(-Math.PI / 2)
        // floor.castShadow = false
        // floor.receiveShadow = true

        // floor.position.copy(new THREE.Vector3(0, 0, 500))
        // floor.name = 'floor'
        // scene.add(floor)

        // this.model = floor

        if (window.DEBUG) {
            const floorFolder = window.GUI.addFolder('floor')
            floorFolder.add(floor, 'visible')
            floorFolder.add(floor.material, 'wireframe')
            floorFolder.add(floor.position, 'x', -10, 10)
            floorFolder.add(floor.position, 'y', -10, 10)
            floorFolder.add(floor.position, 'z', -10, 10)
        }
    }

    loadHeightMap() {
        return new Promise((resolve, reject) => {
            var image = new Image()
            image.src = IMAGE_SRC
            image.onload = function () {
                this.width = image.width
                this.height = image.height

                var canvas = document.createElement('canvas')
                canvas.width = this.width
                canvas.height = this.height
                var context = canvas.getContext('2d')

                console.log('image loaded')
                context.drawImage(image, 0, 0)
                const data = context.getImageData(
                    0,
                    0,
                    this.width,
                    this.height
                ).data

                resolve({data, width: image.width, height: image.height})
            }
        })
    }

    async init() {
        const heightMap = await this.loadHeightMap()
        this.heightMap = heightMap.data
        this.width = heightMap.width
        this.height = heightMap.height
        console.log(this.heightMap)
        console.log(this.width)

        const floorGeo = new THREE.PlaneGeometry(
            this.width,
            this.height,
            this.width - 1,
            this.height - 1
        )
        var vertices = floorGeo.attributes.position.array
        // apply height map to vertices of plane
        for (let i = 0, j = 2; i < this.heightMap.length; i += 4, j += 3) {
            vertices[j] = this.heightMap[i] * HEIGHT_AMPLIFIER
        }

        var material = new THREE.MeshPhongMaterial({
            // color: 0xffffff,
            wireframe: true
        })
        this.model = new THREE.Mesh(floorGeo, material)
        this.model.rotation.x = -Math.PI / 2
        this.model.position.y = -100
        floorGeo.computeFaceNormals()
        floorGeo.computeVertexNormals()

        this.scene.add(this.model)
    }

    update() {}
}

function generateHeight(width, height) {
    const size = width * height,
        data = new Uint8Array(size),
        perlin = new THREE.ImprovedNoise(),
        z = Math.random() * 100

    let quality = 1

    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < size; i++) {
            const x = i % width,
                y = ~~(i / width)
            data[i] += Math.abs(
                perlin.noise(x / quality, y / quality, z) * quality * 1.75
            )
        }

        quality *= 5
    }

    return data
}

function generateTexture(data, width, height) {
    // bake lighting into texture

    let context, image, imageData, shade

    const vector3 = new THREE.Vector3(0, 0, 0)

    const sun = new THREE.Vector3(1, 1, 1)
    sun.normalize()

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    context = canvas.getContext('2d')
    context.fillStyle = '#000'
    context.fillRect(0, 0, width, height)

    image = context.getImageData(0, 0, canvas.width, canvas.height)
    imageData = image.data

    for (let i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {
        vector3.x = data[j - 2] - data[j + 2]
        vector3.y = 2
        vector3.z = data[j - width * 2] - data[j + width * 2]
        vector3.normalize()

        shade = vector3.dot(sun)

        imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007)
        imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007)
        imageData[i + 2] = shade * 96 * (0.5 + data[j] * 0.007)
    }

    context.putImageData(image, 0, 0)

    // Scaled 4x

    const canvasScaled = document.createElement('canvas')
    canvasScaled.width = width * 4
    canvasScaled.height = height * 4

    context = canvasScaled.getContext('2d')
    context.scale(4, 4)
    context.drawImage(canvas, 0, 0)

    image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height)
    imageData = image.data

    for (let i = 0, l = imageData.length; i < l; i += 4) {
        const v = ~~(Math.random() * 5)

        imageData[i] += v
        imageData[i + 1] += v
        imageData[i + 2] += v
    }

    context.putImageData(image, 0, 0)

    return canvasScaled
}
export { Floor }
