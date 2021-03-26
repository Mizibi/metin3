import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module'

export default function loadGLTF(url, options = {}) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader()

    if (options.meshOpt) {
      loader.setMeshoptDecoder(MeshoptDecoder)
    }

    loader.load(url, resolve, null, (err) =>
      reject(new Error(`Could not load GLTF asset ${url}:\n${err}`))
    )
  })
}