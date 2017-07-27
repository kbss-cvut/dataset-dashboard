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

// import {
//     interaction, layer, custom, control, //name spaces
//     Interactions, Overlays, Controls,     //group
//     Map, Layers, Overlay, Util    //objects
// } from "react-openlayers";

proj4.defs("http://www.opengis.net/def/crs/EPSG/0/5514","+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=589,76,480,0,0,0,0 +units=m +no_defs");

class SpatialWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        }
    };

    componentWillMount() {
        this.unsubscribe = DatasetSourceStore.listen(this._onDataLoaded);
    };

    _onDataLoaded = (data) => {
        if (data === undefined) {
            return
        }
        if (data.action === Actions.selectDatasetSource) {
            this.props.loadingOn();
            Actions.executeQueryForDatasetSource(data.datasetSource.hash, "spatial/get_feature_geometry");
        } else if (data.queryName === "spatial/get_feature_geometry") {

            // if (data.jsonLD) {
            //     data.jsonLD.forEach((point) => {
            //         console.log(point['@id']);
            //         console.log(point["http://www.opengis.net/ont/gml#id"][0]['@value']);
            //         console.log(point["http://www.opengis.net/ont/geosparql#asGML"][0]['@value']);
            //     });
            // }

            this.setState({
                data: data.jsonLD
            });
            this.props.loadingOff();
        }
    };

    componentWillUnmount() {
        this.unsubscribe();
    };

    render() {
        if (this.state.data.length === 0) {
            return <div>No data</div>;
        }

        // create coords array with coords only,
        // parse it from xml to numbers,
        // attach to id,

        var points = [];
        var data = this.state.data;
        var i = 0;
        data.forEach((point) => {
            // vymysli lepsi dadovy model
            var xmlDoc;
            if (window.DOMParser){
                var parser = new DOMParser();
                xmlDoc = parser.parseFromString(point["http://www.opengis.net/ont/geosparql#asGML"][0]['@value'],'text/xml');
            }
            else // Internet Explorer
            {
                xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async=false;
                xmlDoc.loadXML(point["http://www.opengis.net/ont/geosparql#asGML"][0]['@value']);
            }
            var coords = xmlDoc.getElementsByTagName("Point")[0].getElementsByTagName('pos')[0].textContent;
            var lng = Number(coords.split(' ')[0]);
            var lat = Number(coords.split(' ')[1]);
            if (xmlDoc.getElementsByTagName("Point")[0].getAttribute('srsName') == "http://www.opengis.net/def/crs/EPSG/0/5514"){
                let pos = [lng, lat];
                pos = proj4('http://www.opengis.net/def/crs/EPSG/0/5514', 'EPSG:4326', pos);
                lng = pos[0];
                lat = pos[1];
            }
            points.push({
                id    :   point["http://www.opengis.net/ont/gml#id"][0]['@value'],
                position: {lng: lng, lat: lat},
                name  :   point["http://schema.org/name"][0]['@value']
            });


        });

        // transformace souradnic do epsg 3857
        //console.log(points[0].crs);
        // calculate mean coordinates as position,
        // render coords with id as label
        // set srs to srs
        //const position = [49.0, 14.5];
        let position = points[0].position;
        // let popup = points[0].id;

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
        let bounds = L.polyline([[ymin,xmin],[ymax, xmax]]);
        console.log(bounds.position);
        return (
            <Map bounds={bounds} style={{height:500}}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                />
                {markers}
            </Map>

        );
    }
}
//window.ReactDOM.render(<SimpleExample />, document.getElementById('mask-container'));
export default LoadingWrapper(SpatialWidget, {maskClass: 'mask-container'});
