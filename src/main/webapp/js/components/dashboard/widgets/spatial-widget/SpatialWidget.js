'use strict';

import React from "react";
import DatasetSourceStore from "../../../../stores/DatasetSourceStore";
import Actions from "../../../../actions/Actions";
import LoadingWrapper from "../../../misc/LoadingWrapper";
import SelectGeoSparqlFeature from "./SelectGeoSparqlFeature";
import GeoSparqlMap from "./GeoSparqlMap";


// TODO 1) při načtení vyber featueType a zobraz
// TODO 4) dodělej načítání dat pro GML i WKT struktury
// TODO 5) možnost zobrazovat víc features najednou

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
        this.selectDatasetSource();
    };

    selectDatasetSource() {
        this.props.loadingOn();
        Actions.executeQueryForDatasetSource(DatasetSourceStore.getSelectedDatasetSource().id, "spatial/get_features_with_geometry");
        //TODO: vyber featureType co má nejmíň ale víc než deset a ten zobraz defaultně
    }

    _onDataLoaded = (data) => {
        if (data === undefined) {
            return
        }
        if (data.action === Actions.executeQueryForDatasetSource) {
            if (data.queryName === "spatial/get_feature_geometry") {
                this.setState({geometries: data.content});
                this.props.loadingOff();
            } else if (data.queryName === "spatial/get_features_with_geometry") {
                this.setState({featuresWithGeometry: data.content});
                this.props.loadingOff();

            }
        } else if (data.action === Actions.selectDatasetSource) {
            this.selectDatasetSource();
        }
    };

    componentWillUnmount() {
        this.unsubscribe();
    };

    // runs when featuretype selected from menu
    featureTypeIriSelect(iri) {
        this.props.loadingOn();
        Actions.executeQueryForDatasetSource(
            DatasetSourceStore.getSelectedDatasetSource().id,
            "spatial/get_feature_geometry",
            {object_type: "<"+iri+">"}
        );
        this.setState({value : iri,geometries:[]})
    };

    render() {
        return (
            <div>
                {this.state.featuresWithGeometry.length > 0 ?
                    <div>
                        <SelectGeoSparqlFeature
                            onChange={(iri) => this.featureTypeIriSelect(iri)}
                            options={this.state.featuresWithGeometry}
                            value={this.state.value}/>
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
