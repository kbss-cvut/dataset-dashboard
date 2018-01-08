'use strict';

import React from "react";
import DatasetSourceStore from "../../../../stores/DatasetSourceStore";
import Actions from "../../../../actions/Actions";
import {TreeNode} from "rc-tree";
import LoadingWrapper from "../../../misc/LoadingWrapper";
import {render} from "react-dom";
import {Map, Marker, Popup, TileLayer} from "react-leaflet";
import proj4 from "proj4";
import ClusterLayer from 'react-leaflet-cluster-layer';
import * as console from "../../../../utils/Logger";
import {FormGroup, ControlLabel, FormControl} from "react-bootstrap";
import Geometry from "./Geometry";

// import {
//     interaction, layer, custom, control, //name spaces
//     Interactions, Overlays, Controls,     //group
//     Map, Layers, Overlay, Util    //objects
// } from "react-openlayers";

proj4.defs("http://www.opengis.net/def/crs/EPSG/0/5514", "+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=589,76,480,0,0,0,0 +units=m +no_defs");

class SpatialWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            featuresWithGeometry: [],
        }
    };

    componentWillMount() {
        this.unsubscribe = DatasetSourceStore.listen(this._onDataLoaded);
    };

    _onDataLoaded = (data) => {
        if (data === undefined) {
            return
        }
        if (data.action === Actions.executeQueryForDatasetSource) {
            if (data.queryName === "spatial/get_feature_geometry") {

                this.setState({
                    data: data.jsonLD
                });

            } else if (data.queryName === "spatial/get_features_with_geometry") {
                let featuresWithGeometry = data.jsonLD;
                //console.log(featuresWithGeometry);
                this.props.loadingOff();
                this.setState({featuresWithGeometry: featuresWithGeometry});
            }
        } else if (data.action === Actions.selectDatasetSource) {
            this.props.loadingOn();
            Actions.executeQueryForDatasetSource(data.datasetSource.id, "spatial/get_features_with_geometry");
            //TODO: vyber featureType co má nejmíň ale víc než deset a ten zobraz defaultně
        }
    };

    // runs when featuretype selected from menu
    featureTypeSelect(event) {
        Actions.executeQueryForDatasetSource(DatasetSourceStore.getSelectedDatasetSource().id, "spatial/get_feature_geometry", {object_type: event.target.value});
    }
    ;

    componentWillUnmount() {
        this.unsubscribe();
    }
    ;

    render() {
        if (this.state.featuresWithGeometry.length === 0) {
            return <div>No data</div>;
        }

        var listOfSelectOptions = this.state.featuresWithGeometry;
          //create rollout menu
        var selectOptions = [];
        listOfSelectOptions.forEach((item) => {
            selectOptions.push(<option key={item["@id"]} value={item["@id"]}>{item["@id"]}
                ({item["http://own.schema.org/haveNumberOfInstances"][0]["@value"]})</option>)
        });

        const cSelect = <FormGroup controlId="formControlsSelect">
            <ControlLabel>Select</ControlLabel>
            <FormControl componentClass="select" placeholder="Select type"
                         onChange={this.featureTypeSelect}>
                <option value="select">Select type</option>
                {selectOptions}
            </FormControl>
        </FormGroup>;


        let cMap = <div>No data</div>
        if (this.state.data.length > 0) {

            let i = 0;
            let data = this.state.data;
            let g = new Geometry();


            data.forEach((geometry) => {
                let xmlDoc;
                let geometryValue;
                if (window.DOMParser) {
                    var parser = new DOMParser();
                    Object.keys(geometry).forEach(function (key) {
                        let val = key.toString();
                        switch (val) {
                            case "http://www.opengis.net/ont/geosparql#asGML":
                                //geometryValue = geometry["http://www.opengis.net/ont/geosparql#asGML"][0]['@value'];
                                xmlDoc = parser.parseFromString(geometry["http://www.opengis.net/ont/geosparql#asGML"][0]['@value'], 'text/xml');
                                if (xmlDoc.getElementsByTagName("Point") != null) g.points.push(parsePointFromGML(xmlDoc));
                                if (xmlDoc.getElementsByTagName("Polygon") != null) g.polygons.push(parsePolygonFromGML(xmlDoc));

                            case "http://www.opengis.net/ont/geosparql#asWKT":
                                geometryValue = geometry["http://www.opengis.net/ont/geosparql#asWKT"][0]['@value'];
                                if (geometryValue.split('(')[0] == 'POLYGON') g.polygons.push(parsePolygonFromWKT(geometryValue));
                                if (geometryValue.split('(')[0] == 'MULTIPOLYGON') g.multipolygons.push(parseMultiPolygonFromWKT(geometryValue));
                                if (geometryValue.split('(')[0] == 'POINT') g.points.push(parsePointFromWKT(geometryValue));
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
                                if (xmlDoc.getElementsByTagName("Point") != null) g.points.push(parsePointFromGML(xmlDoc));
                                if (xmlDoc.getElementsByTagName("Polygon") != null) g.polygons.push(parsePolygonFromGML(xmlDoc));

                            case "http://www.opengis.net/ont/geosparql#asWKT":
                                geometryValue = geometry["http://www.opengis.net/ont/geosparql#asWKT"][0]['@value'];
                                if (geometryValue.split('(')[0] == 'POLYGON') g.polygons.push(parsePolygonFromWKT(geometry));
                                if (geometryValue.split('(')[0] == 'MULTIPOLYGON') g.multipolygons.push(parseMultiPolygonFromWKT(geometryValue));
                                if (geometryValue.split('(')[0] == 'POINT') g.points.push(parsePointFromWKT(geometry));
                        }
                    });
                }



                //TODO: g.points and g.polygons need other information than geometry representation
                //TODO: See GML


                // processing polygon in WKT
                function parsePolygonFromWKT(geometry) {
                    let coords = geometry.split('((')[1].split('))')[0];
                    let polygon = [];
                    coords.split(',').forEach((polpart) => {
                        let pol = [];
                        polpart.split('),(').forEach((coords) =>{
                            let x = coords.split(' ')[0];
                            let y = coords.split(' ')[1];
                            if ((-400000 > x > -1000000) && (-900000 > y > -1400000)) {
                                pol.push(convertFromSJSTK(x, y));
                            }
                            else pol.push([x, y]);
                        })
                        polygon.push(pol);
                    })
                    return polygon;
                };

                // processing multipolygons in WKT
                function parseMultiPolygonFromWKT(geometry) {
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
                    return multipolygon;
                }

                // processing point in WKT
                function parsePointFromWKT(geometry) {
                    let coords = geometry.split('((')[1].split('))')[0];
                    let x = coords.split(' ')[0];
                    let y = coords.split(' ')[1];
                    if ((-400000 > x > -1000000) && (-900000 > y > -1400000)) {
                        return convertFromSJSTK(x, y);
                    }
                    else return [x, y];
                };


                // processing of points in gml
                function parsePointFromGML(xmlDoc) {

                    var coords = xmlDoc.getElementsByTagName("Point")[0].getElementsByTagName('pos')[0].textContent;
                    var lng = Number(coords.split(' ')[0]);
                    var lat = Number(coords.split(' ')[1]);
                    if (xmlDoc.getElementsByTagName("Point")[0].getAttribute('srsName') == "http://www.opengis.net/def/crs/EPSG/0/5514") {
                        [lng, lat] = convertFromSJSTK(lng, lat);
                    }
                    return({
                        id: geometry["http://www.opengis.net/ont/gml#id"][0]['@value'],
                        position: {lng: lng, lat: lat},
                        name: geometry["http://schema.org/name"][0]['@value']
                    });
                }

                //TODO: processing of GML data


                //function for coversion of points from 5514
                function convertFromSJSTK(lng, lat){
                    let pos = [lng, lat];
                    pos = proj4('http://www.opengis.net/def/crs/EPSG/0/5514', 'EPSG:4326', pos);
                    return [pos[0], pos[1]];
                }



            });


            //TODO: render data in a map

            //get geometry objects

            //SITUATION --- g object holds all geometries divided by the type (polygons and holes are stored as two polygons)
            // polygons -- array of arrays (polygons with holes)
            // multipolygons -- array of arrays of arrays (multipolygons with holes)

            //create geometry layer for publication
            
            // get minimum bounds of map for points
            let position = g.points[0].position;
            let markers = [];
            let xmin = position[0];
            let xmax = position[0];
            let ymin = position[1];
            let ymax = position[1];
            points.forEach((point) => {
                markers.push(
                    <Marker key={point.id} position={point.position}>
                        <Popup>
                            <span>{point.name}</span>
                        </Popup>
                    </Marker>);
                if (point.position[0] < xmin) xmin = point.position[0];
                if (point.position[1] < ymin) ymin = point.position[1];
                if (point.position[0] > xmax) xmax = point.position[0];
                if (point.position[1] > ymax) ymax = point.position[1];
            });
            let bounds = L.polyline([[ymin, xmin], [ymax, xmax]]);
            console.log(bounds.position);

            //create map with layer as markers and vizualize
            cMap = <Map bounds={bounds} style={{height: 500}}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                />
                {markers}
            </Map>;
        }

        return (
            <div>
                {cSelect}
                {cMap}
            </div>
        );
    }

}
//window.ReactDOM.render(<SimpleExample />, document.getElementById('mask-container'));
export default LoadingWrapper(SpatialWidget, {maskClass: 'mask-container'});
