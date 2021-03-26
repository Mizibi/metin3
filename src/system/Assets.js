import loadGLTF from './loadGLTF.js'

class Assets {
  _extractType(url) {
    const ext = url.slice(url.lastIndexOf('.'))

    switch (true) {
      case /\.(gltf|glb)$/i.test(ext):
        return 'gltf'
      case /\.json$/i.test(ext):
        return 'json'
      case /\.svg$/i.test(ext):
        return 'svg'
      case /\.(jpe?g|png|gif|bmp|tga|tif)$/i.test(ext):
        return 'image'
      case /\.(wav|mp3)$/i.test(ext):
        return 'audio'
      case /\.(mp4|webm|ogg|ogv)$/i.test(ext):
        return 'video'
      default:
        throw new Error(`Could not load ${url}, unknown file extension!`)
    }
  }

  _loadItem({ url, type, renderer, ...options }) {
    switch (type) {
      case 'gltf':
        return loadGLTF(url, options)
      case 'json':
        return fetch(url).then((response) => response.json())
      case 'envmap':
      case 'envMap':
      case 'env-map':
        return loadEnvMap(url, { renderer, ...options })
      case 'svg':
      case 'image':
        return loadImage(url, { crossorigin: 'anonymous' })
      case 'texture':
        return loadTexture(url, { renderer, ...options })
      case 'audio':
        return fetch(url).then((response) => response.arrayBuffer())
      case 'video':
        return fetch(url).then((response) => response.blob())
      default:
        throw new Error(`Could not load ${url}, the type ${type} is unknown!`)
    }
  }
}

export { Assets }