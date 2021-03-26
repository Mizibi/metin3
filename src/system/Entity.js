class EntityManager {
    #_id = 0
    #entities = new Map()
    constructor() {}

    add(e) {
        this.#_id++
        this.#entities.set(this.#_id, e)
    }
}

export { EntityManager }
