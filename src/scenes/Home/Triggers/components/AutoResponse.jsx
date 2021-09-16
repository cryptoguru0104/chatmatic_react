import React, { Component, Fragment } from 'react';
import { Form, Input, Checkbox } from 'semantic-ui-react';

export default class Buttons extends Component {
    render() {
        return (
            <Fragment>
                <h3 className="heading">Auto Response</h3>

                <Form.Field className="">
                    <Input placeholder="Type some text here..." type="text" />
                </Form.Field>
            </Fragment>
        );
    }
}
