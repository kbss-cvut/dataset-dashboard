'use strict';

import BoundingBox from "../../../../../../js/components/dashboard/widgets/spatial-widget/BoundingBox";

describe("A BoundingBox Test", function() {
    it("null upon creation", function() {
        const b = new BoundingBox();
        expect(b.getBounds()).toEqual([[null,null],[null,null]]);
    });
    it("add two points", function() {
        const b = new BoundingBox();
        b.add([-1,2])
        b.add([-3,1])
        expect(b.getBounds()).toEqual([[-3,1],[-1,2]]);
    });
    it("add five points", function() {
        const b = new BoundingBox();
        b.add([-1,2])
        b.add([8,3])
        b.add([-6,9])
        b.add([-1,0])
        b.add([-3,1])
        expect(b.getBounds()).toEqual([[-6,0],[8,9]]);
    });
});