'use strict';

import React, {Component} from "react";
import {Map, Marker, Polygon, Popup, TileLayer} from "react-leaflet";
import Geometry from "./Geometry";
import GeoUtils from "./GeoUtils";
import BoundingBox from "./BoundingBox";

class GeoSparqlMap extends React.Component {

    processGeometry(geometry,g) {
        Object.keys(geometry).forEach(function (key) {
            let val = key.toString();
            let id;
            switch (val) {
                case "http://www.opengis.net/ont/geosparql#asGML":
                    var parser = new DOMParser();
                    //geometryValue = geometry["http://www.opengis.net/ont/geosparql#asGML"][0]['@value'];
                    const xmlDoc = parser.parseFromString(geometry["http://www.opengis.net/ont/geosparql#asGML"][0]['@value'], 'text/xml');
                    id = geometry['@id'];
                    if (xmlDoc.getElementsByTagName("gml:Point") != null) g.points.push(GeoUtils.parsePointFromGML(xmlDoc, id));
                    if (xmlDoc.getElementsByTagName("gml:Polygon") != null) g.polygons.push(GeoUtils.parsePolygonFromGML(xmlDoc, id));
                    break;
                case "http://www.opengis.net/ont/geosparql#asWKT":
                    const geometryValue = geometry["http://www.opengis.net/ont/geosparql#asWKT"][0]['@value'];
                    id = geometry['@id'];
                    if (geometryValue.split('(')[0] == 'POLYGON') g.polygons.push(GeoUtils.parsePolygonFromWKT(geometryValue, id));
                    if (geometryValue.split('(')[0] == 'MULTIPOLYGON') g.multipolygons.push(GeoUtils.parseMultiPolygonFromWKT(geometryValue, id));
                    if (geometryValue.split('(')[0] == 'POINT') g.points.push(GeoUtils.parsePointFromWKT(geometryValue, id));
                    break;
            }
        });
    }



    render() {
        const data = this.props.data;
        let g = new Geometry();

        // ===== get geometry data into proper structure =====
        data.forEach((geometry) => {
            if (window.DOMParser) {
                this.processGeometry(geometry,g);
            }
            else // Internet Explorer
            {
                let xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = false;
                this.processGeometry(geometry,g);
            }
        });

        //TODO: render data in a map

        //get geometry objects

        //SITUATION --- g object holds all geometries divided by the type (polygons and holes are stored as two polygons)
        // polygons -- array of arrays (polygons with holes)
        // multipolygons -- array of arrays of arrays (multipolygons with holes)

        //create geometry layer for publication

        let markers = [];
        let polygons = [];
        let polylines = [];
        let multipolygons = [];
        let bb = new BoundingBox();

        // ====== get minimum bounds and put data into map object =====

        if (g.points.length != 0) {
            console.log("POINT1: "+g.points[0].position)
            bb.add(g.points[0].position)
            g.points.forEach((point) => {
                markers.push(
                    <Marker key={point.id} position={point.position}>
                        <Popup>
                            <span>{point.name}</span>
                        </Popup>
                    </Marker>);
                console.log("POINT2: "+point.position)
                bb.add(point.position)
            })
        }

        if (g.polylines.length != 0) {

        }

        if (g.polygons.length != 0) {

        }

        if (g.multipolygons.length != 0) {
            console.log("POLYGON1: "+g.multipolygons[0].position[0][0])
            bb.add(g.multipolygons[0].position[0][0]);
            g.multipolygons.forEach((multipolygon) => {
                multipolygons.push(<Polygon key={multipolygon.id} color="blue" positions={multipolygon.position}/>);
                multipolygon.position.forEach((polygon) => {
                    polygon.forEach((point) => {
                        console.log("POLYGON2: "+point)
                        bb.add(point);
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


        let bounds = L.polyline(bb.getBounds());

        // ====== create map with layers and vizualize ======
        return <Map bounds={bounds._latlngs} style={{height: 500}}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
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
