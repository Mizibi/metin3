import { SceneManager } from "./SceneManager.js";
import { createLoading } from "./system/Loading.js";

window.SETTINGS = {
  useComposer: false,
}

window.DEBUG = window.location.search.includes("debug");
if (window.DEBUG) {
  window.GUI = new dat.GUI();
  const settingsFolder = window.GUI.addFolder('Settings')
  settingsFolder.add(window.SETTINGS, 'useComposer')
}

async function main() {
  const sceneManager = new SceneManager();

  document.body.appendChild(sceneManager.renderer.domElement);
  sceneManager.renderer.domElement.style.visibility = "hidden";

  window.LOADINGMANAGER = createLoading(sceneManager.renderer);

  // Should not be init, but async needed for loading
  await sceneManager.init();

  // Loop handled inside scene manager
  sceneManager.start();
}

main().catch((e) => console.error(e));
