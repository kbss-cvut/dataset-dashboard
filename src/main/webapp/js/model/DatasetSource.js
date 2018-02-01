export default class DatasetSource {

    constructor(type) {
        this._id = null;
        this._parts = [];
    }

    addPart(ds) {
        this.parts.push(ds);
    }

    set id(id) {
        this._id = id;
    }

    get id() {
        return this._id;
    }

    get parts() {
        return this._parts;
    }

    get type() {
        throw new Error();
    }
}