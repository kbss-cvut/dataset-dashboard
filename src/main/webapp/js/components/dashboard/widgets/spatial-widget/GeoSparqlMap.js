'use strict';

import React from "react";
import {Map, Marker, Polygon, Popup, TileLayer} from "react-leaflet";
import proj4 from "proj4";
import Geometry from "./Geometry";

proj4.defs("http://www.opengis.net/def/crs/EPSG/0/5514", "+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=589,76,480,0,0,0,0 +units=m +no_defs");

class GeoSparqlMap extends React.Component {
    render() {
        const data = this.props.data;
        let i = 0;
        let g = new Geometry();

        // ===== get geometry data into proper structure =====
        data.forEach((geometry) => {
            let xmlDoc;
            let geometryValue;
            let id;
            let name;
            if (window.DOMParser) {
                var parser = new DOMParser();
                Object.keys(geometry).forEach(function (key) {
                    let val = key.toString();
                    switch (val) {
                        case "http://www.opengis.net/ont/geosparql#asGML":
                            //geometryValue = geometry["http://www.opengis.net/ont/geosparql#asGML"][0]['@value'];
                            xmlDoc = parser.parseFromString(geometry["http://www.opengis.net/ont/geosparql#asGML"][0]['@value'], 'text/xml');
                            id = geometry['@id'];
                            if (xmlDoc.getElementsByTagName("gml:Point") != null) g.points.push(parsePointFromGML(xmlDoc, id));
                            if (xmlDoc.getElementsByTagName("gml:Polygon") != null) g.polygons.push(parsePolygonFromGML(xmlDoc, id));

                        case "http://www.opengis.net/ont/geosparql#asWKT":
                            geometryValue = geometry["http://www.opengis.net/ont/geosparql#asWKT"][0]['@value'];
                            id = geometry['@id'];
                            if (geometryValue.split('(')[0] == 'POLYGON') g.polygons.push(parsePolygonFromWKT(geometryValue, id));
                            if (geometryValue.split('(')[0] == 'MULTIPOLYGON') g.multipolygons.push(parseMultiPolygonFromWKT(geometryValue, id));
                            if (geometryValue.split('(')[0] == 'POINT') g.points.push(parsePointFromWKT(geometryValue, id));
                    }
                });
            }
            else // Internet Explorer
            {
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = false;

                Object.keys(geometry).forEach(function (key) {
                    let val = key.toString();
                    switch (val) {
                        case "http://www.opengis.net/ont/geosparql#asGML":
                            //geometryValue = geometry["http://www.opengis.net/ont/geosparql#asGML"][0]['@value'];
                            xmlDoc = parser.parseFromString(geometry["http://www.opengis.net/ont/geosparql#asGML"][0]['@value'], 'text/xml');
                            id = geometry['@id'];
                            if (xmlDoc.getElementsByTagName("gml:Point") != null) g.points.push(parsePointFromGML(xmlDoc, id));
                            if (xmlDoc.getElementsByTagName("gml:Polygon") != null) g.polygons.push(parsePolygonFromGML(xmlDoc, id));

                        case "http://www.opengis.net/ont/geosparql#asWKT":
                            geometryValue = geometry["http://www.opengis.net/ont/geosparql#asWKT"][0]['@value'];
                            id = geometry['@id'];
                            if (geometryValue.split('(')[0] == 'POLYGON') g.polygons.push(parsePolygonFromWKT(geometry, id));
                            if (geometryValue.split('(')[0] == 'MULTIPOLYGON') g.multipolygons.push(parseMultiPolygonFromWKT(geometryValue, id));
                            if (geometryValue.split('(')[0] == 'POINT') g.points.push(parsePointFromWKT(geometry, id));
                    }
                });
            }


            //TODO: See GML


            // ===== processing polygon in WKT =====
            function parsePolygonFromWKT(geometry, id) {
                let coords = geometry.split('((')[1].split('))')[0];
                let polygon = [];
                coords.split(',').forEach((polpart) => {
                    let pol = [];
                    polpart.split('),(').forEach((coords) => {
                        let x = coords.split(' ')[0];
                        let y = coords.split(' ')[1];
                        if ((-400000 > x > -1000000) && (-900000 > y > -1400000)) {
                            pol.push(convertFromSJSTK(x, y));
                        }
                        else pol.push([x, y]);
                    })
                    polygon.push(pol);
                })
                return {
                    id: id,
                    position: polygon
                };
            };

            // ===== processing multipolygons in WKT =====
            function parseMultiPolygonFromWKT(geometry, id) {
                let coords = geometry.split('(((')[1].split(')))')[0];
                let multipolygon = [];
                coords.split(')),((').forEach((polygon) => {
                    // polygon w/ hole as two polygons
                    polygon.split('),(').forEach((polpart) => {
                        let pol = [];
                        polpart.split(',').forEach((coords) => {
                            let x = coords.split(' ')[0];
                            let y = coords.split(' ')[1];
                            if ((-400000 > x > -1000000) && (-900000 > y > -1400000)) {
                                pol.push(convertFromSJSTK(x, y));
                            }
                            else pol.push([x, y]);
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
            function parsePointFromWKT(geometry, id) {
                let coords = geometry.split('((')[1].split('))')[0];
                let x = coords.split(' ')[0];
                let y = coords.split(' ')[1];
                if ((-400000 > x > -1000000) && (-900000 > y > -1400000)) {
                    return {id: id, position: convertFromSJSTK(x, y)};
                }
                else return {id: id, position: [x, y], name: id};
            };


            // ===== processing of points in gml =====
            function parsePointFromGML(xmlDoc, id) {
                var coords = xmlDoc.getElementsByTagName("gml:Point")[0].getElementsByTagName('gml:pos')[0].textContent;
                var lng = Number(coords.split(' ')[0]);
                var lat = Number(coords.split(' ')[1]);
                if (xmlDoc.getElementsByTagName("gml:Point")[0].getAttribute('srsName') == "http://www.opengis.net/def/crs/EPSG/0/5514") {
                    [lng, lat] = convertFromSJSTK(lng, lat);
                }
                return ({
                    id: id,
                    position: {lng: lng, lat: lat},
                    name: id
                });
            }

            function parsePolygonFromGML(xmlDOc, id) {
                return 0;
            }

            //TODO: processing of GML data


            // ===== function for coversion of points from 5514 =====
            function convertFromSJSTK(lng, lat) {
                let pos = [lng, lat];
                pos = proj4('http://www.opengis.net/def/crs/EPSG/0/5514', 'EPSG:4326', pos);
                return [pos[1], pos[0]];
            }


        });


        //TODO: render data in a map

        //get geometry objects

        //SITUATION --- g object holds all geometries divided by the type (polygons and holes are stored as two polygons)
        // polygons -- array of arrays (polygons with holes)
        // multipolygons -- array of arrays of arrays (multipolygons with holes)

        //create geometry layer for publication

        let position;
        let markers = [];
        let polygons = [];
        let polylines = [];
        let multipolygons = [];
        let xmin = null;
        let xmax = null;
        let ymin = null;
        let ymax = null;


        // ====== get minimum bounds and put data into map object =====

        if (g.points.length != 0) {
            position = g.points[0].position;
            if (xmin == null) xmin = position[0];
            if (ymin == null) ymin = position[1];
            if (xmax == null) xmax = position[0];
            if (ymax == null) ymax = position[1];
            g.points.forEach((point) => {
                markers.push(
                    <Marker key={point.id} position={point.position}>
                        <Popup>
                            <span>{point.name}</span>
                        </Popup>
                    </Marker>);
                if (point[0] < xmin) xmin = point[0];
                if (point[1] < ymin) ymin = point[1];
                if (point[0] > xmax) xmax = point[0];
                if (point[1] > ymax) ymax = point[1];
            })
        }

        if (g.polylines.length != 0) {

        }

        if (g.polygons.length != 0) {

        }

        if (g.multipolygons.length != 0) {
            position = g.multipolygons[0].position[0][0];
            if (xmin == null) xmin = position[0];
            if (ymin == null) ymin = position[1];
            if (xmax == null) xmax = position[0];
            if (ymax == null) ymax = position[1];
            g.multipolygons.forEach((multipolygon) => {
                multipolygons.push(<Polygon key={multipolygon.id} color="blue" positions={multipolygon.position}/>);
                multipolygon.position.forEach((polygon) => {
                    polygon.forEach((point) => {
                        if (point[0] < xmin) xmin = point[0];
                        if (point[1] < ymin) ymin = point[1];
                        if (point[0] > xmax) xmax = point[0];
                        if (point[1] > ymax) ymax = point[1];
                    })
                })
            })
        }


        // ====== how to push markers =====
        // markers.push(
        //     <Marker key={point.id} position={point.position}>
        //         <Popup>
        //             <span>{point.name}</span>
        //         </Popup>
        //     </Marker>);


        let bbox = [[xmin, ymin], [xmax, ymax]];
        let bounds = L.polyline(bbox);

        // ====== create map with layers and vizualize ======
        return <Map bounds={bounds._latlngs} style={{height: 500}}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMapXXXZZZ</a> contributors'
                url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            />
            {markers}
            {/*{polygons}*/}
            {/*{polylines}*/}
            {multipolygons}
        </Map>;
    }
}
export default GeoSparqlMap;
