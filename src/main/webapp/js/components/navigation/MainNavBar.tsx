'use strict';

import * as React from "react";
import {MainNavBarUI} from "./MainNavBarUI";
import DatasetSourceTree from '../dataset-sources/DatasetSourceTree';
import {RefreshDatasetSourcesButton} from '../dataset-sources/RefreshDatasetSourcesButton';

interface State {
    show: boolean
}

export class MainNavBar extends React.Component<{}, State> {

    constructor(props) {
        super(props);
        this.state = {show: false};
    }

    render() {
        return (<MainNavBarUI showModal={this.state.show}
                              onShowModal={() => {
                                  this.setState({show: true})
                              }}
                              onHideModal={() => {
                                  this.setState({show: false})
                              }}
                              content={
                                  <div>
                                      <RefreshDatasetSourcesButton/>
                                      <DatasetSourceTree/>
                                  </div>
                              }
        />);
    }
}
