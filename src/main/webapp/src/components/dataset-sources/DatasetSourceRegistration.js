'use strict';

import * as React from "react";
import {Button, ControlLabel, FormControl, FormGroup, Panel} from "react-bootstrap";
import Actions from "../../actions/Actions";

const urlRegexPattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locater

class DatasetSourceRegistration extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            endpointUrl: '',
        };
    };

    handleClick() {
        Actions.registerDatasetSourceEndpoint(this.state.endpointUrl);
    };

    getValidationState() {
        const lengthE = this.state.endpointUrl.length;
        if ( (lengthE == 0) || (!urlRegexPattern.test(this.state.endpointUrl)))
            return 'error';
        else
            return 'success';
    };

    setSparqlEndpointUrl(e) {
        this.setState({endpointUrl: e.target.value});
    };

    render() {
        let title = <div>
            <Button onClick={ () => this.setState({open: !this.state.open})}>
                Register a dataset source
            </Button>
        </div>
        return (
            <Panel header={title} collapsible expanded={this.state.open}>
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
        );
    }
}
export default DatasetSourceRegistration;
