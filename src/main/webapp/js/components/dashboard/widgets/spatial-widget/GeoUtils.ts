'use strict';

import * as proj4 from "proj4";
import Point from "./model/Point";
import Polygon from "./model/Polygon";
import Multipolygon from "./model/Multipolygon";
import {Runtime} from "inspector";

const EPSG_5514 = "http://www.opengis.net/def/crs/EPSG/0/5514"
proj4.defs(EPSG_5514, "+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=589,76,480,0,0,0,0 +units=m +no_defs");

export default class GeoUtils {
    //TODO: See GML

    static checkConvertible(x : number, y : number) : boolean {
        return (-400000 > x && x > -1000000) && (-900000 > y && y > -1400000);
    }

    static processPolygonPart(coords : string ) : number[] {
        let [xN, yN] = GeoUtils.getCoords(coords);
        if (GeoUtils.checkConvertible(xN, yN)) {
            return GeoUtils.convertFromSJSTK(xN, yN);
        }
        else return [ xN, yN ];
    }

    static getCoords(coords : string ) : number[] {
        let [x, y] = coords.split(' ');
        return [Number.parseInt(x), Number.parseInt(y)];
    }

    // ===== processing polygon in WKT =====
    static parsePolygonFromWKT(geometry : string, id : string) : Polygon {
        let coords = geometry.split('((')[1].split('))')[0];
        let polygon = [];
        coords.split(',').forEach((polpart) => {
            let pol = [];
            polpart.split('),(').forEach((coords) => {
                pol.push(GeoUtils.processPolygonPart(coords));
            })
            polygon.push(pol);
        })
        return {
            id: id,
            position: polygon,
            name: id
        };
    };

    // ===== processing multipolygons in WKT =====
    static parseMultiPolygonFromWKT(geometry : string, id : string) : Multipolygon {
        let coords = geometry.split('(((')[1].split(')))')[0];
        let multipolygon = [];
        coords.split(')),((').forEach((polygon) => {
            // polygon w/ hole as two polygons
            polygon.split('),(').forEach((polpart) => {
                let pol = [];
                polpart.split(',').forEach((coords) => {
                    pol.push(GeoUtils.processPolygonPart(coords));
                })
                multipolygon.push(pol);
            })
        })
        return {
            id: id,
            position: multipolygon,
            name: id
        };
    }

    // ===== processing point in WKT =====
    static parsePointFromWKT(geometry : string, id : string) : Point {
        let coords = geometry.split('((')[1].split('))')[0];
        let [xN, yN] = GeoUtils.getCoords(coords);
        if (GeoUtils.checkConvertible(xN, yN)) {
            return {id: id, position: GeoUtils.convertFromSJSTK(xN, yN)};
        }
        else return {id: id, position: [xN, yN], name: id};
    }

    //TODO: processing polyline un WKT
    //TODO: processing line un WKT

    //TODO: processing polygon in GML
    //TODO: processing multipolygon in GML
    //TODO: processing polyline in GML
    //TODO: processing line in GML

    // ===== processing of points in gml =====
    static parsePointFromGML(xmlDoc, id : string) : Point {
        const coords = xmlDoc.getElementsByTagName("gml:Point")[0].getElementsByTagName('gml:pos')[0].textContent;
        let [x, y] = coords.split(' ');
        let [lng, lat] = [Number(x), Number(y)]
        if (xmlDoc.getElementsByTagName("gml:Point")[0].getAttribute('srsName') == EPSG_5514) {
            [lng, lat] = GeoUtils.convertFromSJSTK(lng, lat);
        }
        return ({
            id: id,
            position: [lng, lat] ,
            name: id
        });
    }

    static parsePolygonFromGML(xmlDOc, id) : Polygon {
        throw new Error();
    }

    //TODO: processing of GML data

    // ===== function for coversion of points from 5514 =====
    static convertFromSJSTK(lng : number, lat : number) : number[] {
        const pos = proj4(EPSG_5514, 'EPSG:4326', [lng, lat]);
        return [pos[1], pos[0]];
    }
}