'use strict';

import proj4 from "proj4";

const EPSG_5514 = "http://www.opengis.net/def/crs/EPSG/0/5514"
proj4.defs(EPSG_5514, "+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=589,76,480,0,0,0,0 +units=m +no_defs");

class GeoUtils {
    //TODO: See GML

    static checkConvertible(x, y) {
        return (-400000 > x > -1000000) && (-900000 > y > -1400000);
    }

    static processPolygonPart(coords) {
        let [x, y] = coords.split(' ');
        if (GeoUtils.checkConvertible(x, y)) {
            return GeoUtils.convertFromSJSTK(x, y);
        }
        else return [x, y];
    }

    // ===== processing polygon in WKT =====
    static parsePolygonFromWKT(geometry, id) {
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
            position: polygon
        };
    };

    // ===== processing multipolygons in WKT =====
    static parseMultiPolygonFromWKT(geometry, id) {
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
            position: multipolygon
        };
    }

    // ===== processing point in WKT =====
    static parsePointFromWKT(geometry, id) {
        let coords = geometry.split('((')[1].split('))')[0];
        let [x, y] = coords.split(' ');
        if (GeoUtils.checkConvertible(x, y)) {
            return {id: id, position: GeoUtils.convertFromSJSTK(x, y)};
        }
        else return {id: id, position: [x, y], name: id};
    }

    // ===== processing of points in gml =====
    static parsePointFromGML(xmlDoc, id) {
        const coords = xmlDoc.getElementsByTagName("gml:Point")[0].getElementsByTagName('gml:pos')[0].textContent;
        let [x, y] = coords.split(' ');
        let [lng, lat] = [Number(x), Number(y)]
        if (xmlDoc.getElementsByTagName("gml:Point")[0].getAttribute('srsName') == EPSG_5514) {
            [lng, lat] = GeoUtils.convertFromSJSTK(lng, lat);
        }
        return ({
            id: id,
            position: {lng: lng, lat: lat},
            name: id
        });
    }

    static parsePolygonFromGML(xmlDOc, id) {
        return 0;
    }

    //TODO: processing of GML data

    // ===== function for coversion of points from 5514 =====
    static convertFromSJSTK(lng, lat) {
        const pos = proj4(EPSG_5514, 'EPSG:4326', [lng, lat]);
        return [pos[1], pos[0]];
    }
}
export default GeoUtils;
