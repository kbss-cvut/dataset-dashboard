'use strict';

import * as React from "react";
import {MapContainer as Map, Marker, Polygon, Popup, TileLayer} from "react-leaflet";
import Geometry from "./Geometry";
import GeoUtils from "./GeoUtils";
import * as L from "leaflet";
import Point from "./model/Point";
import {LatLngTuple} from "leaflet";

interface Props {
    data: any
}

interface State {
    geometry: any
}

export default class GeoSparqlMap extends React.Component<Props, State> {

    constructor(props:Props) {
        super(props);
        this.state = {
            geometry: new Geometry()
        }
    }

    componentWillMount() {
        const g = this.state.geometry;
        // ===== get geometry data into proper structure =====
        this.props.data.forEach((geometry: any) => {
            if (!(window as any).DOMParser) {
                // Internet Explorer
                let xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = false;
            }
            this.processGeometry(geometry, g);
        });
        this.setState({geometry: g});
    }

    processGeometry(geometry:any, g: Geometry) {
        Object.keys(geometry).forEach(function (key) {
            let val = key.toString();
            let id = geometry['@id'];
            switch (val) {
                case "http://www.opengis.net/ont/geosparql#asGML":
                    var parser = new DOMParser();
                    //geometryValue = geometry["http://www.opengis.net/ont/geosparql#asGML"][0]['@value'];
                    const xmlDoc = parser.parseFromString(geometry["http://www.opengis.net/ont/geosparql#asGML"][0]['@value'], 'text/xml');
                    try {
                        if (xmlDoc.getElementsByTagName("gml:Point") != null) g.addPoint(GeoUtils.parsePointFromGML(xmlDoc, id));
                        if (xmlDoc.getElementsByTagName("gml:Polygon") != null) g.addPolygon(GeoUtils.parsePolygonFromGML(xmlDoc, id));
                    } catch (e) {
                        console.warn("Error in processing polygons.", e)
                    }
                    break;
                case "http://www.opengis.net/ont/geosparql#asWKT":
                    const geometryValue = geometry["http://www.opengis.net/ont/geosparql#asWKT"][0]['@value'];
                    try {
                        if (geometryValue.split('(')[0] == 'POLYGON') g.addPolygon(GeoUtils.parsePolygonFromWKT(geometryValue, id));
                        else if (geometryValue.split('(')[0] == 'MULTIPOLYGON') g.addMultiPolygon(GeoUtils.parseMultiPolygonFromWKT(geometryValue, id));
                        else if (geometryValue.split('(')[0] == 'POINT') g.addPoint(GeoUtils.parsePointFromWKT(geometryValue, id));
                    } catch (e) {
                        console.warn("Error in processing poins.", e)
                    }
                    break;
            }
        });
    }

    createPopup(href: string, title?: string) {
        return (<Popup>
            <span><a target="_blank" href={href}>{title}</a></span>
        </Popup>);
    }

    createPoint(point: Point) {
        return (<Marker key={point.id} position={point.position as LatLngTuple}>
            {this.createPopup(point.id, point.name)}
        </Marker>);
    }

    createPolyline(polyline: any) {
        console.log("Polyline rendering not implemented")
        return (<div></div>);
    }

    createPolygon(polygon: any) {
        console.log("Polygon rendering not implemented")
        return (<div></div>);
    }

    createMultiPolygon(multipolygon: any) {
        return (<Polygon key={multipolygon.id} color="blue" positions={multipolygon.position}>
            {this.createPopup(multipolygon.id, multipolygon.name)}
        </Polygon>);
    }

    render() {
        const g: Geometry = this.state.geometry;
        let bounds = L.polyline(g.boundingBox.getBounds() as LatLngTuple[]);
        if (g.boundingBox.isDefined.bind(g.boundingBox)()) {
            return <Map bounds={bounds.getBounds()} style={{height: "80vh"}}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                />
                {g.points.map((o) => this.createPoint(o))}
                {g.polylines.map((o) => this.createPolyline(o))}
                {g.polygons.map((o) => this.createPolygon(o))}
                {g.multipolygons.map((o) => this.createMultiPolygon(o))}
            </Map>;
        } else {
            return <div>Invalid bounds {g.boundingBox.getBounds()}</div>
        }
    }
}
