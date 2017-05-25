'use strict';

import React from "react";
import DatasetSourceStore from "../../../../stores/DatasetSourceStore";
import Actions from "../../../../actions/Actions";
import {TreeNode} from "rc-tree";
import LoadingWrapper from "../../../misc/LoadingWrapper";
import {render} from "react-dom";
import {Map, Marker, Popup, TileLayer} from "react-leaflet";


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

        var points;
        var data = this.state.data;
        var i = 0;
        data.forEach((point) => {
            points[i]['coords'] = point["http://www.opengis.net/ont/geosparql#asGML"][0]['@value'];
            points[i]['id'] = point["http://www.opengis.net/ont/geosparql#asGML"][0]['@value'];
            var xmlDoc;
            if (window.DOMParser){
                var parser = new DOMParser();
                xmlDoc = parser.parseFromString(points[i]['coords']);
            }
            else // Internet Explorer
            {
                xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async=false;
                xmlDoc.loadXML(points[i]['coords']);
            }
            points[i]['srs']=xmlDoc.getElementsByTagName("gml:Point")[0].getAttributeByName('srsName')[0].nodeValue;
            console.log(points[i]['srs']);
            i++;
        });
        // calculate mean coordinates as position,
        // render coords with id as label
        const position = [49.0, 14.5];

        return (
            <Map center={position} zoom={13} style={{height: 500}}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                />
                <Marker position={position}>
                    <Popup>
                        <span>A pretty CSS3 popup. <br/> Easily customizable.</span>
                    </Popup>
                </Marker>
            </Map>
        );
    }
}
//window.ReactDOM.render(<SimpleExample />, document.getElementById('mask-container'));
export default LoadingWrapper(SpatialWidget, {maskClass: 'mask-container'});
