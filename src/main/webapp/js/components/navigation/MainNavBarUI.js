'use strict';

import * as React from "react";
import {Button, Modal, Nav, Navbar, NavItem} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import {PersistentLinkContainer} from "./PersistentLinkContainer";
import {SelectedDatasetSourcesLabel} from "./SelectedDatasetSourcesLabel";

export class MainNavBarUI extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (<Navbar>
            <Modal show={this.props.showModal} onHide={() => this.props.onHideModal()}>
                <Modal.Header closeButton>
                    <Modal.Title>Select Dataset Source</Modal.Title>
                </Modal.Header>
                <Modal.Body>{this.props.content}</Modal.Body>
            </Modal>
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
                <Button onClick={() => this.props.onShowModal()}><SelectedDatasetSourcesLabel/></Button>
            </Navbar.Text>
        </Navbar>);
    }
}
