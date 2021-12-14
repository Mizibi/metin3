const loader = document.getElementById("loader")
const loaderText = document.getElementById("loadingText")

const stats = document.getElementById("stats")
const menu = document.getElementById("menu")
const chat = document.getElementById("chat")

function createLoading(renderer) {
    const loading = new THREE.LoadingManager()

    loading.onStart = function (url, itemsLoaded, itemsTotal) {
        // console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.')
        // loaderText.innerHTML = 'Loading'
    }
    loading.onLoad = function () {
        loaderText.innerHTML = `Starting...`

        // hide loader
        loader.style.visibility = 'hidden'
        loaderText.style.visibility = 'hidden'

        // show 3d render
        renderer.domElement.style.visibility = 'visible'
        // show HUD
        stats.style.visibility = 'visible'
        menu.style.visibility = 'visible'
        chat.style.visibility = 'visible'
        
    }
    loading.onProgress = function (url, itemsLoaded, itemsTotal) {
        // console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.')
        loaderText.innerHTML = `${itemsLoaded} / ${itemsTotal} loaded`

        // Create load percentage
    }
    loading.onError = function (url) {
        console.log('There was an error loading ' + url)
    }

    return loading
}

export { createLoading }