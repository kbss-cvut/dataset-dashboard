'use strict';

import React from "react";
import MainNavBarUI from "./MainNavBarUI";
import DatasetSourceTree from '../dataset-sources/DatasetSourceTree';
import RefreshDatasetSourcesButton from '../dataset-sources/RefreshDatasetSourcesButton';

export default class MainNavBar extends React.Component {

    constructor(props)
    {
        super(props);
        this.state = {};
    }

    render() {
        const content = <div><RefreshDatasetSourcesButton/><DatasetSourceTree/></div>
        return (<MainNavBarUI content={content}
                              showModal={this.state.show}
                              onShowModal={()=>{this.setState({show:true})}}
                              onHideModal={()=>{this.setState({show:false})}} /> );
    }
}
