'use strict';

import BoundingBox from './BoundingBox';

export default class Geometry {
    points;
    polygons;
    multipolygons;
    polylines;

    boundingBox;

    constructor() {
        this.points=[];
        this.polygons=[];
        this.multipolygons=[];
        this.polylines=[];
        this.boundingBox = new BoundingBox();
    };

    addPoint(point) {
        this.points.push(point);
        this.boundingBox.add(point);
    }

    addPolyline(polyline) {
        this.polylines.push(polyline);
        // TODO update bounding box
    }

    addPolygon(polygon) {
        this.polygons.push(polygon);
        // TODO update bounding box
    }

    addMultiPolygon(multipolygon) {
        this.multipolygons.push(multipolygon);
        multipolygon.position.forEach((polygon) => {
            polygon.forEach((point) => {
                this.boundingBox.add(point);
            })
        });
    }
}
