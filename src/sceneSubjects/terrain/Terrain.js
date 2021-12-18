const SIZE_AMPLIFIER = 5;
const HEIGHT_AMPLIFIER = 0.2;

class Terrain {
  constructor(scene) {
    this.scene = scene;
  }

  loadTextures() {
    var loader = new THREE.TextureLoader();
    return new Promise((resolve) => {
      loader.load("../../ressources/textures/sand.jpeg", function (t1) {
        loader.load("../../ressources/textures/grass.jpeg", function (t2) {
          loader.load("../../ressources/textures/stone.jpeg", function (t3) {
            loader.load("../../ressources/textures/snow.jpeg", function (t4) {
              resolve({ sand: t1, grass: t2, stone: t3, snow: t3 });
            });
          });
        });
      });
    });
  }
  async init() {
    const textures = await this.loadTextures();
    console.log(textures);
    // Generate a terrain
    var xS = 64,
      yS = 64;

    const terrainScene = THREE.Terrain({
      easing: THREE.Terrain.Linear,
      frequency: 2.5,
      heightmap: THREE.Terrain.DiamondSquare,
      material: THREE.Terrain.generateBlendedMaterial([
        { texture: textures.sand },
        { texture: textures.grass, levels: [-80, -35, 20, 50] },
        { texture: textures.stone, levels: [20, 50, 60, 85] },
        {
          texture: textures.snow,
          glsl: "1.0 - smoothstep(65.0 + smoothstep(-256.0, 256.0, vPosition.x) * 10.0, 80.0, vPosition.z)",
        },
        {
          texture: textures.stone,
          glsl: "slope > 0.7853981633974483 ? 0.2 : 1.0 - smoothstep(0.47123889803846897, 0.7853981633974483, slope) + 0.2",
        }, // between 27 and 45 degrees
      ]),
      maxHeight: 100,
      minHeight: -100,
      steps: 1,
      xSegments: xS,
      xSize: 500,
      ySegments: yS,
      ySize: 500,
    });
    terrainScene.position.y = -50;
    this.scene.add(terrainScene);

    this.model = terrainScene;

    if (window.DEBUG) {
      const terrainFolder = window.GUI.addFolder("Terrain");
      terrainFolder.add(this.model, "visible");
      // terrainFolder.add(this.model.material, 'wireframe')
      terrainFolder.add(this.model.position, "x", -10, 10);
      terrainFolder.add(this.model.position, "y", -1000, 100);
      terrainFolder.add(this.model.position, "z", -10, 10);
    }
  }

  update() {}
}

export { Terrain };
