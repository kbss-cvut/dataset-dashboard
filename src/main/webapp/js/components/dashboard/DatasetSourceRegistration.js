'use strict';

import Ajax from '../../utils/Ajax';
import React from "react";
import Actions from "../../actions/Actions"
import {Button, Panel, ControlLabel, FormControl, FormGroup} from "react-bootstrap";

class DatasetSourceRegistration extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            endpointUrl: '',
            // addAlsoGraphsAsDatasetSources: false
        };
    };

    checkUrl(string) {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locater
        return pattern.test(string);
    };

    handleClick() {
        Actions.registerDatasetSourceEndpoint(this.state.endpointUrl);
        if (this.state.addAlsoGraphsAsDatasetSources) {
            Ajax.get(this.state.endpointUrl+"?query=SELECT ?G { GRAPH ?G {?s ?p ?o} }").end(function (data) {
                console.log(data);
            });
        }
    };

    getValidationState() {
        const lengthE = this.state.endpointUrl.length;
        if (lengthE == 0 || !this.checkUrl(this.state.endpointUrl)) return 'error';
        else return 'success';
    };

    setSparqlEndpointUrl(e) {
        this.setState({endpointUrl: e.target.value});
    };

    // setAddAlsoGraphsAsDatasetSources(e) {
    //     this.setState({addAlsoGraphsAsDatasetSources: e.target.value});
    // };

    render() {
        return (
        <Panel header="Register a dataset source">
            <form>
                <FormGroup
                    controlId="formGraph"
                    validationState={this.getValidationState()}>
                    <ControlLabel>Endpoint URL</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.endpointUrl}
                        placeholder="Enter SPARQL Endpoint URL"
                        onChange={(val) => this.setSparqlEndpointUrl(val)}
                    />
                    <Button onClick={() => this.handleClick()}>
                        Add
                    </Button>
                    <FormControl.Feedback />
                </FormGroup>
            </form>
        </Panel>
        //     <Checkbox
        // value={this.state.addAlsoGraphsAsDatasetSources}
        // onChange={(val) => this.setAddAlsoGraphsAsDatasetSources(val)}
        // inline> Add graphs as dataset sources
        // </Checkbox>
        );
    }
}
export default DatasetSourceRegistration;
