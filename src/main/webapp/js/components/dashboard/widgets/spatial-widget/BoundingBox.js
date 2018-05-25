'use strict';

export default class BoundingBox {
    min = [null,null];
    max = [null,null];

    add(p) {
        if (!p || !p[0] || !p[1]) {
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

    getBounds() {
        return [this.min, this.max];
    }
}