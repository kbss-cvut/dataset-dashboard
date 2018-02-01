'use strict';

import React from "react";
import {Nav, Navbar, NavItem, Button} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import PersistentLinkContainer from "./PersistentLinkContainer";
import SelectedDatasetSourcesLabel from "./SelectedDatasetSourcesLabel";
import Dialog from 'react-bootstrap-dialog';

const MainNavBarUI = (props) => (
    <Navbar>
        <Navbar.Header>
            <LinkContainer to="/home"><Navbar.Brand>Dataset Dashboard</Navbar.Brand></LinkContainer>
        </Navbar.Header>
        <Nav>
            <LinkContainer to="/namespaces"><NavItem>Namespaces</NavItem></LinkContainer>
        </Nav>
        <Nav pullRight>
            <PersistentLinkContainer/>
        </Nav>
        <Navbar.Text pullRight>
            <Button onClick={props.onChangeDatasetSource}><SelectedDatasetSourcesLabel/></Button>
        </Navbar.Text>
        <Dialog ref={(e) => props.renderDialog(e)} />
    </Navbar>
);

export default MainNavBarUI;
