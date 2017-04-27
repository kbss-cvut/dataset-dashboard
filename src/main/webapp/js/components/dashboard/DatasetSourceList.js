'use strict';

import React from "react";
import DatasetSourceStore from "../../stores/DatasetSourceStore";
import Actions from "../../actions/Actions";
import {Table} from "react-bootstrap";
import {BootstrapTable,TableHeaderColumn} from "react-bootstrap-table";
import DatasetSourceLink from "./DatasetSourceLink";

class DatasetSourceList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            datasetSources: [],
        };
    };

    componentWillMount() {
        Actions.getAllDatasetSources();
        this.unsubscribe = DatasetSourceStore.listen(this._onDataLoaded);
    };

    _onDataLoaded = (data) => {
        if (data === undefined) {
            return
        }

        if (data.action == Actions.getAllDatasetSources) {
            this.setState({
                datasetSources: data.datasetSources,
            });
        }
    };

    componentWillUnmount() {
        this.unsubscribe();
    };

    render() {
        const options = {
            page: 1,  // which page you want to show as default
            sizePerPageList: [ {
                text: '5', value: 5
            }, {
                text: '10', value: 10
            }, {
                text: '100', value: 100
            } ], // you can change the dropdown list for size per page
            sizePerPage: 5,  // which size per page you want to locate as default
            pageStartIndex: 1, // where to start counting the pages
            paginationSize: 3,  // the pagination bar size.
            // prePage: 'Prev', // Previous page button text
            // nextPage: 'Next', // Next page button text
            // firstPage: 'First', // First page button text
            // lastPage: 'Last', // Last page button text
            paginationShowsTotal: true,  // Accept bool or function
            paginationPosition: 'bottom',  // default is bottom, top and both is all available
            hideSizePerPage: true, // You can hide the dropdown for sizePerPage
            alwaysShowAllBtns: true, // Always show next and previous button
            withFirstAndLast: true // Hide the going to First and Last page button
        };

        return (
                <div><BootstrapTable
                    data={ this.state.datasetSources }
                    options={ options }
                    pagination={true}
                striped condensed hover>
                    <TableHeaderColumn dataField='hash' isKey>#</TableHeaderColumn>
                    <TableHeaderColumn dataField='id'
                                       dataFormat={ (cell, row) => { return (
                                           <DatasetSourceLink datasetSource={ row } /> ); }
                                       }>Dataset Source</TableHeaderColumn>
                    </BootstrapTable></div>
        );
    }
}

export default DatasetSourceList;
