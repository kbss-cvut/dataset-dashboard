'use strict';

import * as React from "react";
import {Button, Modal, Nav, Navbar, NavItem} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import {PersistentLinkContainer} from "./PersistentLinkContainer";
import {SelectedDatasetSourcesLabel} from "./SelectedDatasetSourcesLabel";

interface Props {
    showModal : boolean,
    onShowModal : () => void,
    onHideModal : () => void,
    content : string
}

export const MainNavBarUI: React.SFC<Props> = props => {
    return (<Navbar>
        <Modal show={props.showModal} onHide={() => props.onHideModal()}>
            <Modal.Header closeButton>
                <Modal.Title>Select Dataset Source</Modal.Title>
            </Modal.Header>
            <Modal.Body>{props.content}</Modal.Body>
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
            <Button onClick={() => props.onShowModal()}><SelectedDatasetSourcesLabel/></Button>
        </Navbar.Text>
    </Navbar>);
}
