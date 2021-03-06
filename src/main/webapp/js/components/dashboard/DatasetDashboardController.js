'use strict';

import * as React from "react";
import {Grid, Jumbotron, Row} from "react-bootstrap";
import {DatasetDashboard} from "./DatasetDashboard";
import {DatasetSourceStore} from "../../stores/DatasetSourceStore";
import {MainNavBar} from "../navigation/MainNavBar";
import Actions from "../../actions/Actions";
import {EntityFilter} from "./EntityFilter";
// import {ReactTooltip} from "react-tooltip";

export class DatasetDashboardController extends React.Component {

    constructor(props) {
        super(props);
        this.state={datasetSource:null}
    }

    componentDidMount() {
        this.unsubscribe = DatasetSourceStore.listen(this._onDataLoaded);
        this.setState({datasetSource: DatasetSourceStore.getSelectedDatasetSource()});
    };

    _onDataLoaded = (data) => {
        if (data === undefined) {
            return
        }

        if ( data.action === Actions.selectDatasetSource ) {
            this.setState({datasetSource: data.datasetSource})
        }
    }

    componentWillUnmount() {
        this.unsubscribe();
    };

    render() {
        const x=  (
            <div><MainNavBar/>
                {this.state.datasetSource ? <Grid fluid={true}>
                    <Row>
                        <EntityFilter/>
                    </Row>
                    <Row>
                        <DatasetDashboard
                            datasetSource={this.state.datasetSource}/>
                    </Row>
                    </Grid> :
                    <Jumbotron>
                        <h1>Welcome</h1>
                        <p>
                            This tool allows you to explore RDF Dataset Sources. Please select a dataset source first
                        </p>
                    </Jumbotron>
                    }
                {/*<ReactTooltip className="tooltipContent" />*/}
            </div>
        );
        // ReactTooltip.rebuild();
        return x;
    }
}
