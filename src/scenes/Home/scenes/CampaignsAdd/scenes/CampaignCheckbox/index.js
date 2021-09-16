import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import './styles.css';
import { toastr } from 'react-redux-toastr';
import { getGeneralWorkflows } from 'services/workflows/selector';
import { getCampaignAdd } from '../../services/selector';
import { getPageFromUrl } from 'services/pages/selector';
import {
    default as Domains,
    domainRegex
} from '../../../Settings/scenes/Domains/components/Domains';
import { updateNewCampaignInfo } from '../../services/actions';
import { updateEngageInfo } from '../../../EngageAdd/services/actions';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { FacebookProvider, MessengerCheckbox } from 'react-facebook';
import uuidv1 from 'uuid/v1';
const BUTTON_SKINS = [
    { name: 'Light', value: 'light' },
    { name: 'Dark', value: 'dark' }
];
const BUTTON_SIZES = [
    { name: 'Standard', value: 'standard' },
    { name: 'Large', value: 'large' },
    { name: 'XLarge', value: 'xlarge' }
];
class CampaignCheckbox extends React.Component {
    state = {
        campaignName: this.props.campaignAdd.campaignName || '',
        buttonSkin: 'light',
        buttonSize: 'large',
        htmlCode: '',
        engageOption: 'existingEngage',
        refParameter: `campaign::${this.props.campaignAdd.publicId || ''}`,
        workflowUid: this.props.campaignAdd.workflowUid || null
    };
    _userRef = uuidv1();
    componentDidMount() {
        const { pageId, pageInfo } = this.props;
        const { buttonSkin, buttonSize, refParameter } = this.state;
        this.setState({
            htmlCode: this._getHtmlCode()
        });
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            campaignName: nextProps.campaignAdd.campaignName || '',
            refParameter: `campaign::${nextProps.campaignAdd.publicId || ''}`,
            workflowUid: nextProps.campaignAdd.workflowUid || null
        });
    }
    componentDidUpdate(prevProps, prevState) {
        const { pageInfo } = this.props;
        const { buttonSkin, buttonSize, refParameter } = this.state;
        if (
            buttonSkin !== prevState.buttonSkin ||
            buttonSize !== prevState.buttonSize ||
            refParameter !== prevState.refParameter
        ) {
            this.setState({
                htmlCode: this._getHtmlCode()
            });
        }
    }
    _campaignNameChange = event => {
        this.setState({ campaignName: event.target.value });
    };

    _domainChange = event => {
        this.setState({ domain: event.target.value });
    };

    _changeEngageOption = event => {
        this.setState({ engageOption: event.target.value });
    };

    _getHtmlCode = () => {
        const { pageInfo } = this.props;
        const { buttonSkin, buttonSize, refParameter } = this.state;
        return (
            `<div className="fb-messenger-checkbox" origin="" page_id="${pageInfo.fbId}" messenger_app_id="${process.env.REACT_APP_FACEBOOK_APP_ID}" user_ref="" ref="${refParameter}" prechecked="true" allow_login="true" skin="${buttonSkin}" size="${buttonSize}"></div>` +
            `<script> window.fbMessengerPlugins = window.fbMessengerPlugins || { init : function() { FB.init({ appId: "1678638095724206", xfbml: true, version: "v6.0" }); }, callable : [] }; window.fbMessengerPlugins.callable.push( function() { var ruuid, fbPluginElements = document.querySelectorAll(".fb-messenger-checkbox[page_id='${pageInfo.fbId}']"); if (fbPluginElements) { for( i = 0; i < fbPluginElements.length; i++ ) { ruuid = 'cf_' + (new Array(16).join().replace(/(.|$)/g, function(){return ((Math.random()*36)|0).toString(36)[Math.random()<.5?"toString":"toUpperCase"]();})); fbPluginElements[i].setAttribute('user_ref', ruuid) ; fbPluginElements[i].setAttribute('origin', window.location.href); window.confirmOptIn = function() { FB.AppEvents.logEvent('MessengerCheckboxUserConfirmation', null, { app_id:"${process.env.REACT_APP_FACEBOOK_APP_ID}", page_id:"${pageInfo.fbId}", ref:"${refParameter}", user_ref: ruuid }); }; } } }); window.fbAsyncInit = window.fbAsyncInit || function() { window.fbMessengerPlugins.callable.forEach( function( item ) { item(); } ); window.fbMessengerPlugins.init(); }; setTimeout( function() { (function(d, s, id){ var js, fjs = d.getElementsByTagName(s)[0]; if (d.getElementById(id)) { return; } js = d.createElement(s); js.id = id; js.src = "//connect.facebook.net/en_US/sdk.js"; fjs.parentNode.insertBefore(js, fjs); }(document, 'script', 'facebook-jssdk')); }, 0); </script>`
        );
    };

    // _getScriptCode = () => {
    //     const { pageInfo } = this.props;
    //     const { refParameter } = this.state;
    //     return `<script> window.fbMessengerPlugins = window.fbMessengerPlugins || { init : function() { FB.init({ appId: "1678638095724206", xfbml: true, version: "v6.0" }); }, callable : [] }; window.fbMessengerPlugins.callable.push( function() { var ruuid, fbPluginElements = document.querySelectorAll(".fb-messenger-checkbox[page_id='${pageInfo.fbId}']"); if (fbPluginElements) { for( i = 0; i < fbPluginElements.length; i++ ) { ruuid = 'cf_' + (new Array(16).join().replace(/(.|$)/g, function(){return ((Math.random()*36)|0).toString(36)[Math.random()<.5?"toString":"toUpperCase"]();})); fbPluginElements[i].setAttribute('user_ref', ruuid) ; fbPluginElements[i].setAttribute('origin', window.location.href); window.confirmOptIn = function() { FB.AppEvents.logEvent('MessengerCheckboxUserConfirmation', null, { app_id:"${process.env.REACT_APP_FACEBOOK_APP_ID}", page_id:"${pageInfo.fbId}", ref:"${refParameter}", user_ref: ruuid }); }; } } }); window.fbAsyncInit = window.fbAsyncInit || function() { window.fbMessengerPlugins.callable.forEach( function( item ) { item(); } ); window.fbMessengerPlugins.init(); }; setTimeout( function() { (function(d, s, id){ var js, fjs = d.getElementsByTagName(s)[0]; if (d.getElementById(id)) { return; } js = d.createElement(s); js.id = id; js.src = "//connect.facebook.net/en_US/sdk.js"; fjs.parentNode.insertBefore(js, fjs); }(document, 'script', 'facebook-jssdk')); }, 0); </script>`;
    // };

    _goToEngageBuilder = workflowUid => {
        if (!!workflowUid) {
            const workflow = this.props.workflows.find(
                workflow => workflow.uid === workflowUid
            );

            this.props.actions.updateEngageInfo({
                ...workflow,
                activeStep: workflow.steps[0].stepUid
            });
        } else {
            this.props.actions.updateEngageInfo({
                workflowType: 'general',
                name: '',
                steps: [],
                activeStep: '',
                uid: null,
                broadcast: {}
            });
        }

        this.props.history.push({
            pathname: `/page/${this.props.match.params.id}/engages/${
                workflowUid ? workflowUid : 'add'
            }/builder`,
            state: {
                redirectTo: this.props.location.pathname
            }
        });
    };

    _renderMessageAlert = () => {
        if (!this.state.workflowUid) {
            return (
                <span className="d-flex align-items-center align-items-center warning-alert">
                    <i className="fa fa-times-circle-o mr-3" />
                    Please select an engagement from the list below
                </span>
            );
        } else {
            const engagementName = this.props.workflows.find(
                workflow => workflow.uid === this.state.workflowUid
            ).name;
            return (
                <div className="d-flex flex-column align-items-center">
                    <span className="d-flex align-items-center align-items-center success-alert">
                        <i className="fa fa-check-circle-o mr-3" />
                        {`Using Engagement: ${engagementName}`}
                    </span>
                    <button
                        className="btn btn-edit-engagement text-white"
                        onClick={() =>
                            this._goToEngageBuilder(this.state.workflowUid)
                        }
                    >
                        Edit Engagement
                    </button>
                </div>
            );
        }
    };

    _renderMessageSelection = () => {
        const { engageOption } = this.state;
        if (engageOption === 'existingEngage') {
            return (
                <div className="message-selection d-flex flex-column">
                    <div
                        className="d-flex justify-content-center w-100 alert-container"
                        style={{
                            minHeight: !this.state.workflowUid ? 64 : 115
                        }}
                    >
                        {this._renderMessageAlert()}
                    </div>
                    <div className="d-flex flex-column mt-3 p-2 message-list">
                        {this.props.workflows.map((workflow, index) => (
                            <span
                                className="engage-item"
                                key={index}
                                onClick={() =>
                                    this.setState({ workflowUid: workflow.uid })
                                }
                                style={{
                                    color:
                                        workflow.uid === this.state.workflowUid
                                            ? 'white'
                                            : 'inherit',
                                    backgroundColor:
                                        workflow.uid === this.state.workflowUid
                                            ? '#274bf0'
                                            : 'inherit'
                                }}
                            >
                                {workflow.name}
                            </span>
                        ))}
                    </div>
                </div>
            );
        } else {
            return (
                <div className="d-flex justify-content-center mt-3 flex-grow-1">
                    <button
                        className="btn btn-primary btn-new-message"
                        style={{ height: 45 }}
                        onClick={() => this._goToEngageBuilder(null)}
                    >
                        Launch Message Builder
                    </button>
                </div>
            );
        }
    };

    _submit = e => {
        e.preventDefault();
        const { campaignName, domain, workflowUid } = this.state;
        if (!campaignName) {
            toastr.warning(
                'Campaign Name Missing!',
                'You must provide your campaign with a name.'
            );
        }
        // else if (!domain) {
        //     toastr.warning(
        //         "Website Domain Required!",
        //         "Please enter your website domain where this will be hosted"
        //     );
        // } else if (!domainRegex.test(domain)) {
        //     toastr.warning(
        //         "Invalid Website Domain",
        //         "This appears to be an invalid domain. Format should be www.yoursite.com or yoursite.com"
        //     );
        // }
        else if (!workflowUid) {
            toastr.warning(
                'Engagement Missing!',
                'You must select an engagement that will be launched when someone subscribes to this campaign.'
            );
        } else {
            //this.props.nextStep();
            this.props.actions.updateNewCampaignInfo(
                this.props.pageId,
                {
                    workflowUid: this.state.workflowUid,
                    campaignName: this.state.campaignName
                },
                true
            );
        }
    };
    renderCampaignStep = () => {
        const { campaignName, domain, engageOption } = this.state;
        return (
            <>
                <div className="form-group campaign-name-container">
                    <label className="ml-0">Campaign Name</label>
                    <input
                        type="text"
                        className="form-control"
                        onChange={this._campaignNameChange}
                        maxLength={64}
                        name="campaignName"
                        value={campaignName}
                        placeholder="Add Campaign Name Here - Required"
                    />
                </div>
                {/* <div className="form-group campaign-name-container">
                    <label className="ml-0">Website domain</label>
                    <input
                        type="text"
                        className="form-control"
                        onChange={this._domainChange}
                        name="domain"
                        value={domain}
                        placeholder="e.g. yoursite.com - Required"
                    />
                </div> */}
                <div className="d-flex flex-row justify-content-start message-option">
                    <label className="d-flex align-items-center mr-5">
                        <input
                            onChange={this._changeEngageOption}
                            type="radio"
                            value="existingEngage"
                            checked={engageOption === 'existingEngage'}
                        />
                        <span className="pl-2">
                            Select Existing Automation Or Message
                        </span>
                    </label>
                    <label className="d-flex align-items-center">
                        <input
                            onChange={this._changeEngageOption}
                            type="radio"
                            value="newEngage"
                            checked={engageOption === 'newEngage'}
                        />
                        <span className="pl-2">Create New</span>
                    </label>
                </div>
                {this._renderMessageSelection()}
                <div className="pt-3 text-right">
                    <button
                        className="btn btn-primary btn-next"
                        onClick={this._submit}
                    >
                        Save
                    </button>
                </div>
            </>
        );
    };

    render() {
        const { campaignAdd, loading, pageInfo } = this.props;
        const { buttonSkin, buttonSize, htmlCode, refParameter } = this.state;
        if (loading) {
            Swal({
                title: 'Please wait...',
                text: campaignAdd.uid
                    ? 'Saving Campaign...'
                    : 'We are creating a new campaign...',
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });

            return <div />;
        } else {
            Swal.close();
        }
        return (
            <div className="d-flex flex-row buttons-container">
                <div className="flex-fill card d-flex flex-column mr-2 shadow-sm">
                    <h5 className="text-center card-title p-4 m-0">
                        Submit Action
                    </h5>
                    <div className="body flex-grow-1 p-3 d-flex flex-column">
                        {this.renderCampaignStep()}
                    </div>
                </div>
                <div className="flex-fill card ml-2 d-flex flex-column shadow-sm">
                    <h5 className="text-center card-title p-4 m-0">
                        How to Use It{' '}
                        <a
                            className="btn btn-primary help"
                            href="https://developers.facebook.com/docs/messenger-platform/discovery/checkbox-plugin"
                            target="_blank"
                        >
                            <i className="fa fa-question-circle" />
                        </a>
                    </h5>
                    {campaignAdd.uid && (
                        <>
                            <div className="body flex-grow-1 p-3">
                                {false && (
                                    <div className="form-group">
                                        <label className="ml-0">
                                            Ref Parameter
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            onChange={e =>
                                                this.setState({
                                                    refParameter: e.target.value
                                                })
                                            }
                                            value={refParameter}
                                        />
                                    </div>
                                )}
                                <div className="row mb-3">
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="ml-0">Skin</label>
                                            <Select
                                                onChange={e => {
                                                    this.setState({
                                                        buttonSkin: e.value
                                                    });
                                                }}
                                                options={BUTTON_SKINS}
                                                getOptionLabel={option =>
                                                    option.name
                                                }
                                                getOptionValue={option =>
                                                    option.value
                                                }
                                                value={BUTTON_SKINS.find(
                                                    x => x.value == buttonSkin
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="ml-0">
                                                Button Size
                                            </label>
                                            <Select
                                                onChange={e => {
                                                    this.setState({
                                                        buttonSize: e.value
                                                    });
                                                }}
                                                options={BUTTON_SIZES}
                                                getOptionLabel={option =>
                                                    option.name
                                                }
                                                getOptionValue={option =>
                                                    option.value
                                                }
                                                value={BUTTON_SIZES.find(
                                                    x => x.value == buttonSize
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <label className="ml-0">
                                            Allowed Website Domains: Limit is 50
                                            websites.
                                        </label>
                                        <div>
                                            <Domains />
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div className="mb-5">
                                    <label className="ml-0">Preview:</label>
                                    <div className="text-center">
                                        <FacebookProvider
                                            appId={
                                                process.env
                                                    .REACT_APP_FACEBOOK_APP_ID
                                            }
                                        >
                                            <MessengerCheckbox
                                                skin={buttonSkin}
                                                messengerAppId={
                                                    process.env
                                                        .REACT_APP_FACEBOOK_APP_ID
                                                }
                                                pageId={pageInfo.fbId}
                                                size={buttonSize}
                                            />
                                        </FacebookProvider>
                                    </div>
                                </div>
                                <hr />
                            </div>
                            <div className="px-3 pt-3 d-flex flex-row align-items-center">
                                <div className="flex-fill mr-3">
                                    <div className="form-group">
                                        <label className="ml-0">
                                            HTML Code to insert:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            readOnly
                                            value={htmlCode}
                                        />
                                    </div>
                                </div>
                                <div className="ml-auto">
                                    <CopyToClipboard
                                        text={htmlCode}
                                        onCopy={() => {
                                            this.setState({ copied: true });
                                            toastr.success(
                                                'Copied',
                                                'Copied to Clipboard'
                                            );
                                        }}
                                    >
                                        <button className="btn btn-primary btn-next">
                                            <i className="fa fa-copy mr-1" />
                                            Copy
                                        </button>
                                    </CopyToClipboard>
                                </div>
                            </div>
                            <div className="px-3 pt-3 d-flex flex-row align-items-center">
                                <div className="flex-fill mr-3">
                                    <div className="form-group">
                                        <label className="ml-0">
                                            JS Code to confirm opt-in:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            readOnly
                                            value="window.confirmOptin();"
                                        />
                                    </div>
                                </div>
                                <div className="ml-auto">
                                    <CopyToClipboard
                                        text="window.confirmOptin();"
                                        onCopy={() => {
                                            this.setState({ copied: true });
                                            toastr.success(
                                                'Copied',
                                                'Copied to Clipboard'
                                            );
                                        }}
                                    >
                                        <button className="btn btn-primary btn-next">
                                            <i className="fa fa-copy mr-1" />
                                            Copy
                                        </button>
                                    </CopyToClipboard>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }
}

CampaignCheckbox.propTypes = {
    actions: PropTypes.object.isRequired,
    campaignAdd: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    pageId: PropTypes.string.isRequired,
    pageInfo: PropTypes.object,
    workflows: PropTypes.array.isRequired
};

const mapStateToProps = (state, ownProps) => {
    return {
        workflows: getGeneralWorkflows(state),
        campaignAdd: getCampaignAdd(state),
        loading: state.default.scenes.campaignAdd.loading,
        pageId: ownProps.match.params.id,
        pageInfo: getPageFromUrl(state, ownProps)
    };
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            updateNewCampaignInfo,
            updateEngageInfo
        },
        dispatch
    )
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(CampaignCheckbox)
);
