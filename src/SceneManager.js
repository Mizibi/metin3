import { createScene } from "./system/Scene.js";
import { createRenderer } from "./system/Renderer.js";
import { createCamera } from "./system/Camera.js";

import { createSceneSubjects } from "./SceneSubjects.js";

import { Resizer } from "./system/Resizer.js";
import { Loop } from "./system/Loop.js";

class SceneManager {
  constructor() {
    // One scene for now
    this.scene = createScene();
    this.renderer = createRenderer();
    this.sceneSubjects = createSceneSubjects(this.scene);
  }

  async init() {
    // attach camera to char (first subject, to change)
    // For now camera target is always first scene subject
    this.camera = createCamera(this.sceneSubjects[0]);

    // Resizer should be reworked
    this.resizer = new Resizer(this.camera.camera, this.renderer);

    this.loop = new Loop(this.camera, this.scene, this.renderer);
    for (const subject of this.sceneSubjects) {
      await subject.init();
      this.loop.updatables.push(subject);
    }
  }

  start() {
    this.loop.start();
  }

  stop() {
    this.loop.stop();
  }
}

export { SceneManager };
