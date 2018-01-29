'use strict';

import React from "react";
import DatasetSourceStore from "../../../../stores/DatasetSourceStore";
import Actions from "../../../../actions/Actions";
import LoadingWrapper from "../../../misc/LoadingWrapper";
import SelectGeoSparqlFeature from "./SelectGeoSparqlFeature";
import GeoSparqlMap from "./GeoSparqlMap";


// TODO 1) při načtení vyber featueType a zobraz
// TODO 2) při vybrání jiného source reinicializovat mapové okno
// TODO 3) zkontroluj funkčnost GML u ruianu (sample okresy)
// TODO 4) dodělej načítání dat pro GML i WKT struktury
class SpatialWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            geometries: [],
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
                this.setState({geometries: data.jsonLD});
            } else if (data.queryName === "spatial/get_features_with_geometry") {
                this.props.loadingOff();
                this.setState({featuresWithGeometry: data.jsonLD});
            }
        } else if (data.action === Actions.selectDatasetSource) {
            this.props.loadingOn();
            Actions.executeQueryForDatasetSource(data.datasetSource.id, "spatial/get_features_with_geometry");
            //TODO: vyber featureType co má nejmíň ale víc než deset a ten zobraz defaultně
        }
    };

    componentWillUnmount() {
        this.unsubscribe();
    };

    // runs when featuretype selected from menu
    featureTypeSelect(event) {
        Actions.executeQueryForDatasetSource(
            DatasetSourceStore.getSelectedDatasetSource().id,
            "spatial/get_feature_geometry",
            {object_type: "<"+event.target.value+">"}
        );
    };

    render() {
        return (
            <div>
                {this.state.featuresWithGeometry.length > 0 ?
                    <div>
                        <SelectGeoSparqlFeature
                            onChange={(event) => this.featureTypeSelect(event)}
                            options={this.state.featuresWithGeometry}/>
                            {this.state.geometries.length > 0 ?
                                <GeoSparqlMap
                                    data={this.state.geometries}/> :
                                <div>No Geometries</div>}
                    </div> :
                    <div>No Features With Geometry Found</div>
                }
            </div>
        );
    }
}
export default LoadingWrapper(SpatialWidget, {maskClass: 'mask-container'});
