import React, { Component, Fragment } from 'react';
import { Form, Input } from 'semantic-ui-react';

export default class Buttons extends Component {
    render() {
        return (
            <Fragment>
                <h3 className="heading">Json</h3>

                <label className="no-padding">HTML Code</label>
                <Form.TextArea placeholder="<some html code here>" />
            </Fragment>
        );
    }
}
