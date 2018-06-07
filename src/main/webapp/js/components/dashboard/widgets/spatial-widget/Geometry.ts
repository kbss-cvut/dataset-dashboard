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
        const _thisBB = this.boundingBox;
        this.polylines.push(polyline);
        polyline.position.forEach( _thisBB.add.bind(_thisBB) );
    }

    addPolygon(polygon: Polygon): void {
        this.polygons.push(polygon);
        const _thisBB = this.boundingBox;
        polygon.position.forEach( _thisBB.add.bind(_thisBB) );
    }

    addMultiPolygon(multipolygon: Multipolygon): void {
        const _thisBB = this.boundingBox;
        this.multipolygons.push(multipolygon);
        multipolygon.position.forEach((polygon) => {
            polygon.forEach(_thisBB.add.bind(_thisBB));
        });
    }
}
