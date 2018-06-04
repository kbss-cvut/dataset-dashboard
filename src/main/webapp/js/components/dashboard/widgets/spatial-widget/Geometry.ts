'use strict';

import BoundingBox from './BoundingBox';
import Polygon from "./model/Polygon";
import Point from "./model/Point";
import Multipolygon from "./model/Multipolygon";
import Polyline from "./model/Polyline";

export default class Geometry {
    points: Point[];
    polygons: Polygon[];
    multipolygons: Multipolygon[];
    polylines: Polyline[];

    boundingBox: BoundingBox;

    constructor() {
        this.points = [];
        this.polygons = [];
        this.multipolygons = [];
        this.polylines = [];
        this.boundingBox = new BoundingBox();
    };

    addPoint(point: Point): void {
        this.points.push(point);
        this.boundingBox.add(point);
    }

    addPolyline(polyline: Polyline): void {
        this.polylines.push(polyline);
        polyline.position.forEach( this.boundingBox.add );
    }

    addPolygon(polygon: Polygon): void {
        this.polygons.push(polygon);
        polygon.position.forEach( this.boundingBox.add );
    }

    addMultiPolygon(multipolygon: Multipolygon): void {
        this.multipolygons.push(multipolygon);
        multipolygon.position.forEach((polygon) => {
            polygon.forEach(this.boundingBox.add);
        });
    }
}
