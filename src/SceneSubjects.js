import { Spotlight } from './sceneSubjects/lights/Spotlight.js'
import { Hemilight } from './sceneSubjects/lights/Hemilight.js';
import { Dirlight } from './sceneSubjects/lights/Dirlight.js';
import { Floor } from './sceneSubjects/Floor.js'
import { Character } from './sceneSubjects/Character.js'
import { Enemy } from './sceneSubjects/Enemy.js';
import { Tree } from './sceneSubjects/Tree.js'
import { Dragon } from './sceneSubjects/Dragon.js'
import { Text } from './sceneSubjects/Text.js'

function createSceneSubjects(scene) {
    const sceneSubjects = [
        new Character(scene),
        new Hemilight(scene),
        // new Spotlight(scene),
        new Dirlight(scene),
        new Floor(scene),
        new Enemy(scene),
        new Tree(scene, new THREE.Vector3(3, 0, 2)),
        new Tree(scene, new THREE.Vector3(-4, 0, 3)),
        new Tree(scene, new THREE.Vector3(-2, 0, 4)),
        new Text(scene),
        // new Dragon(scene),
    ];

    return sceneSubjects
}

export { createSceneSubjects }