import { Spotlight } from './sceneSubjects/lights/Spotlight.js'
import { Hemilight } from './sceneSubjects/lights/Hemilight.js';
import { Dirlight } from './sceneSubjects/lights/Dirlight.js';
import { Floor } from './sceneSubjects/Floor.js'
import { Character } from './sceneSubjects/Character.js'
import { Enemy } from './sceneSubjects/Enemy.js';

function createSceneSubjects(scene) {
    const sceneSubjects = [
        new Character(scene),
        new Hemilight(scene),
        // new Spotlight(scene),
        new Dirlight(scene),
        new Floor(scene),
        new Enemy(scene)
    ];

    return sceneSubjects
}

export { createSceneSubjects }