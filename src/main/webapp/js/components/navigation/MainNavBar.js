'use strict';

import React from "react";
import MainNavBarUI from "./MainNavBarUI";
import Dialog from 'react-bootstrap-dialog';
import DatasetSourceTree from '../dataset-sources/DatasetSourceTree';
import RefreshDatasetSourcesButton from '../dataset-sources/RefreshDatasetSourcesButton';

export default class MainNavBar extends React.Component {

    changeDatasetSource(e) {
        this.dialog.show({
            title: 'Select Dataset Source',
            body: <div><RefreshDatasetSourcesButton/><DatasetSourceTree/></div>,
            actions: [
                Dialog.OKAction()
            ],
            bsSize: 'large',
            onHide: (dialog) => {
                dialog.hide()
            }
        })
    }

    renderDialog(e) {
        this.dialog = e
    }

    render() {
        return (<MainNavBarUI renderDialog={(e) => this.renderDialog(e)}
                              onChangeDatasetSource={(e) => this.changeDatasetSource(e)}/>);
    }
}
