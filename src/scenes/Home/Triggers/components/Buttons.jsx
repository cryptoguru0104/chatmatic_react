import React, { Component, Fragment } from 'react';
import { Form, Dropdown, Input } from 'semantic-ui-react';
import { FacebookProvider, SendToMessenger } from 'react-facebook';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getPageFromUrl } from 'services/pages/selector';
import { getCampaignAdd } from '../services/selector';

class Buttons extends Component {
    constructor(props) {
        super(props);
        let options = {
            color: 'blue',
            size: 'large',
            redirectUrl: '',
            refParameter: 'campaign::',
            fbId: null
        };

        if (props.defaultOptions) {
            options = {
                ...options,
                ...props.defaultOptions
            };
        }

        this.state = {
            options
        };
    }

    componentDidMount = () => {
        this.setState(
            ({ options }) => ({
                options: {
                    ...options,
                    refParameter: `campaign::${this.props.campaignAdd
                        .publicId || ''}`,
                    fbId: this.props.pageInfo ? this.props.pageInfo.fbId : null
                }
            }),
            () => this.updateOptions()
        );
    };

    updateOptions = () => {
        const { options } = this.state;
        console.log('options', options);
        this.props.updateOptions(options);
    };

    handleRedirectUtl = redirectUrl => {
        this.setState(
            ({ options }) => ({
                options: { ...options, redirectUrl }
            }),
            () => this.updateOptions()
        );
    };

    handleButtonSize = size => {
        this.setState(
            ({ options }) => ({
                options: { ...options, size }
            }),
            () => this.updateOptions()
        );
    };

    handleButtonColor = color => {
        this.setState(
            ({ options }) => ({
                options: { ...options, color }
            }),
            () => this.updateOptions()
        );
    };

    render() {
        const {
            options: { color, redirectUrl, size, refParameter }
        } = this.state;
        const { pageInfo } = this.props;

        return (
            <Fragment>
                <h3 className="heading">Button</h3>
                <Form.Field className="">
                    <label className="no-padding">Color</label>
                    <Dropdown
                        selection
                        value={color}
                        onChange={(e, { value }) =>
                            this.handleButtonColor(value)
                        }
                        options={[
                            { key: 1, value: 'blue', text: 'Blue' },
                            {
                                key: 2,
                                value: 'white',
                                text: 'White'
                            }
                        ]}
                    />
                </Form.Field>
                <Form.Field className="">
                    <label className="no-padding">Size</label>
                    <Dropdown
                        selection
                        value={size}
                        onChange={(e, { value }) =>
                            this.handleButtonSize(value)
                        }
                        options={[
                            {
                                key: 1,
                                value: 'standard',
                                text: 'Standard'
                            },
                            {
                                key: 2,
                                value: 'large',
                                text: 'Large'
                            },
                            {
                                key: 3,
                                value: 'xlarge',
                                text: 'Xlarge'
                            }
                        ]}
                    />
                </Form.Field>
                <Form.Field className="">
                    <label className="no-padding">Redirect Url</label>
                    <Input
                        placeholder=""
                        value={redirectUrl}
                        onChange={(e, { value }) =>
                            this.handleRedirectUtl(value)
                        }
                    />
                </Form.Field>
                <Form.Field className="">
                    <label className="no-padding">Preview</label>
                    {/* <Button className="btn btn-default blue-bg">
                        Button Preview
                    </Button> */}
                    <div className="text-center">
                        <FacebookProvider
                            appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                        >
                            <SendToMessenger
                                color={color}
                                dataRef={refParameter}
                                messengerAppId={
                                    process.env.REACT_APP_FACEBOOK_APP_ID
                                }
                                pageId={pageInfo.fbId}
                                size={size}
                            />
                        </FacebookProvider>
                    </div>
                </Form.Field>
            </Fragment>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        // workflows: getGeneralWorkflows(state),
        // campaignAdd: getCampaignAdd(state),
        // loading: state.default.scenes.campaignAdd.loading,
        pageId: ownProps.match.params.id,
        campaignAdd: getCampaignAdd(state),
        pageInfo: getPageFromUrl(state, ownProps)
    };
};

export default withRouter(connect(mapStateToProps, {})(Buttons));
