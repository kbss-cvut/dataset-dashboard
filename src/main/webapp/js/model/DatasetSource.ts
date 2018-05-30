export default class DatasetSource {

    _id : string;
    _parts: DatasetSource[];

    constructor() {
        this._id = null;
        this._parts = [];
    }

    addPart(ds : DatasetSource) : void {
        this.parts.push(ds);
    }

    set id(id : string) {
        this._id = id;
    }

    get id() : string {
        return this._id;
    }

    get parts() : DatasetSource[] {
        return this._parts;
    }

    get type() : string {
        throw new Error();
    }
}