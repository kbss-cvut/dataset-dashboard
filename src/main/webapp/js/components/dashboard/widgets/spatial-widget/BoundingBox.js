'use strict';

class BoundingBox {
    min = [null,null];
    max = [null,null];

    add([x, y]) {
        if ((this.min[0] === null) || (x < this.min[0])) this.min[0] = x;
        if ((this.min[1] === null) || (y < this.min[1])) this.min[1] = y;
        if ((this.max[0] === null) || (x > this.max[0])) this.max[0] = x;
        if ((this.max[1] === null) || (y > this.max[1])) this.max[1] = y;
    }

    getBounds() {
        return [this.min, this.max];
    }
}

export default BoundingBox;
