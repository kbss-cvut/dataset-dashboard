'use strict';

export default class BoundingBox {
    min : number[] = [null,null];
    max : number[] = [null,null];

    add(p) {
        if (!p || p[0] === undefined || p[1] === undefined ) {
            console.log("Invalid point : " + p);
            return;
        }

        const x = p[0];
        const y = p[1];

        if ((this.min[0] === null) || (x < this.min[0])) this.min[0] = x;
        if ((this.min[1] === null) || (y < this.min[1])) this.min[1] = y;
        if ((this.max[0] === null) || (x > this.max[0])) this.max[0] = x;
        if ((this.max[1] === null) || (y > this.max[1])) this.max[1] = y;
    }

    isDefined() : boolean {
        return this.min[0] != undefined
            && this.min[1] != undefined
            && this.max[0] != undefined
            && this.max[1] != undefined;
    }

    getBounds() : number[][] {
        return [this.min, this.max];
    }
}