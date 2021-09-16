import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Checkbox } from 'semantic-ui-react';
import { toastr } from 'react-redux-toastr';
import $ from 'jquery';
import { withRouter } from 'react-router-dom';

import { uniqid } from 'services/utils';

const copyHtml = () => {
    const temp = $('<input>');
    $('body').append(temp);
    temp.val($('#ref-link').val()).select();
    document.execCommand('copy');
    temp.remove();
    toastr.success('Copy HTML', 'Code is copied to clipboard');
};

class MDotMe extends Component {
    constructor(props) {
        super(props);

        let options = {
            isCustomRef: false,
            customRef: '',
            publicId: uniqid()
        };

        if (props.defaultOptions) {
            options = {
                ...options,
                ...props.defaultOptions,
                isCustomRef: props.defaultOptions !== null
            };
        }

        this.state = {
            options
        };
    }

    componentDidMount = () => {
        this.updateOptions();
    };

    updateOptions = () => {
        const { options } = this.state;
        console.log('options', options);
        this.props.updateOptions(options);
    };

    handleIsCustomRef = isCustomRef => {
        this.setState(
            ({ options }) => ({
                options: { ...options, isCustomRef }
            }),
            () => this.updateOptions()
        );
    };

    handleCustomRef = customRef => {
        this.setState(
            ({ options }) => ({
                options: { ...options, customRef }
            }),
            () => this.updateOptions()
        );
    };

    render() {
        const {
            options: { isCustomRef, customRef, publicId }
        } = this.state;
        const { pages } = this.props;

        const id = this.props.match.params.id;
        const activePage = pages.find(p => p.uid === Number(id));
        let refLink = `https://m.me/${activePage.fbId}?ref=${
            isCustomRef ? customRef || '' : publicId
        }`;

        return (
            <Fragment>
                <h3 className="heading">M Dot Me</h3>
                {/* <Form.Field className="">
                    <label className="no-padding">URL</label>
                    <Input placeholder="Enter URL" type="text" />
                </Form.Field> */}
                <Form.Field>
                    <label className="p-0">Your Messenger Ref URL</label>
                    <Input
                        className="text-color-blue"
                        placeholder="Enter URL"
                        readOnly
                        id="ref-link"
                        value={refLink}
                    />
                    <p
                        onClick={copyHtml}
                        className="text-left mt-2 text-color-blue"
                    >
                        Copy URL to clipboard
                    </p>
                </Form.Field>
                <Form.Field>
                    <Checkbox
                        checked={isCustomRef}
                        label="Add Custom Ref"
                        onChange={(e, { checked }) =>
                            this.handleIsCustomRef(checked)
                        }
                    />
                </Form.Field>
                {isCustomRef && (
                    <Form.Field className="">
                        <Input
                            placeholder="Add Custom Ref"
                            type="text"
                            value={customRef}
                            onChange={(e, { value }) =>
                                this.handleCustomRef(value)
                            }
                        />
                    </Form.Field>
                )}
            </Fragment>
        );
    }
}

export default withRouter(
    connect(state => ({
        pages: state.default.pages.pages
    }))(MDotMe)
);
