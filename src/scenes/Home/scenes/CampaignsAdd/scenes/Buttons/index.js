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
import { updateNewCampaignInfo } from '../../services/actions';
import { updateEngageInfo } from '../../../EngageAdd/services/actions';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { FacebookProvider, SendToMessenger } from 'react-facebook';
import { domainRegex } from '../../../../../Home/scenes/Settings/scenes/Domains/components/Domains';

const BUTTON_COLORS = [
    { name: 'Blue', value: 'blue' },
    { name: 'White', value: 'white' }
];
const BUTTON_SIZES = [
    { name: 'Standard', value: 'standard' },
    { name: 'Large', value: 'large' },
    { name: 'XLarge', value: 'xlarge' }
];
class Buttons extends React.Component {
    state = {
        campaignName: this.props.campaignAdd.campaignName || '',
        buttonColor: 'blue',
        buttonSize: 'large',
        htmlCode: '',
        engageOption: 'existingEngage',
        refParameter: `campaign::${this.props.campaignAdd.publicId || ''}`,
        postsubmitRedirectUrl:
            this.props.campaignAdd.postsubmitRedirectUrl || '',
        workflowUid: this.props.campaignAdd.workflowUid || null
    };
    componentDidMount() {
        this.setState({
            htmlCode: this._getHtmlCode()
        });
    }
    _getHtmlCode() {
        const { pageId, pageInfo } = this.props;
        const {
            buttonColor,
            buttonSize,
            refParameter,
            postsubmitRedirectUrl
        } = this.state;

        let htmlCode = `<script>window.fbAsyncInit=function(){FB.init({appId:'${process.env.REACT_APP_FACEBOOK_APP_ID}',autoLogAppEvents:true,xfbml:true,version:'v6.0'});`;
        if (postsubmitRedirectUrl) {
            htmlCode += `FB.Event.subscribe('send_to_messenger',function(e){if(e.event=='opt_in'){window.location.replace('${postsubmitRedirectUrl}')}})`;
        }
        htmlCode += `};</script><script async defer src="https://connect.facebook.net/en_US/sdk.js"></script> <div className="fb-send-to-messenger" messenger_app_id="${process.env.REACT_APP_FACEBOOK_APP_ID}" page_id="${pageInfo.fbId}" data-ref="${refParameter}" color="${buttonColor}" size="${buttonSize}"> </div>`;

        return htmlCode;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            campaignName: nextProps.campaignAdd.campaignName || '',
            refParameter: `campaign::${nextProps.campaignAdd.publicId || ''}`,
            postsubmitRedirectUrl:
                nextProps.campaignAdd.postsubmitRedirectUrl || '',
            workflowUid: nextProps.campaignAdd.workflowUid || null
        });
    }
    componentDidUpdate(prevProps, prevState) {
        const { pageId, pageInfo } = this.props;
        const {
            buttonColor,
            buttonSize,
            refParameter,
            postsubmitRedirectUrl
        } = this.state;
        if (
            buttonColor !== prevState.buttonColor ||
            buttonSize !== prevState.buttonSize ||
            refParameter !== prevState.refParameter ||
            postsubmitRedirectUrl !== prevState.postsubmitRedirectUrl
        ) {
            console.log('set componentdidupdate');
            this.setState({
                htmlCode: this._getHtmlCode()
            });
        }
    }
    _campaignNameChange = event => {
        this.setState({ campaignName: event.target.value });
    };

    _postsubmitRedirectUrlChange = event => {
        this.setState({ postsubmitRedirectUrl: event.target.value });
    };

    _changeEngageOption = event => {
        this.setState({ engageOption: event.target.value });
    };

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

    _submit = () => {
        const { campaignName, postsubmitRedirectUrl, workflowUid } = this.state;

        if (!campaignName) {
            toastr.warning(
                'Campaign Name Missing!',
                'You must provide your campaign with a name.'
            );
        } else if (!workflowUid) {
            toastr.warning(
                'Engagement Missing!',
                'You must select an engagement that will be launched when someone subscribes to this campaign.'
            );
        } else if (
            !!postsubmitRedirectUrl &&
            !domainRegex.test(postsubmitRedirectUrl)
        ) {
            toastr.error(
                'Invalid Redirect URL',
                "Please enter a valid URL. inlcuding the protocol identifier (e.g. 'https://' or 'http://')"
            );
        } else {
            //this.props.nextStep();
            this.props.actions.updateNewCampaignInfo(
                this.props.pageId,
                {
                    workflowUid: this.state.workflowUid,
                    campaignName: this.state.campaignName,
                    postsubmitRedirectUrl: postsubmitRedirectUrl
                },
                true
            );
        }
    };
    render() {
        const { campaignAdd, loading, pageInfo } = this.props;
        const {
            buttonColor,
            buttonSize,
            campaignName,
            engageOption,
            htmlCode,
            refParameter,
            postsubmitRedirectUrl
        } = this.state;
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
                        <div className="form-group campaign-name-container">
                            <label className="ml-0">Campaign Name</label>
                            <input
                                type="text"
                                className="form-control"
                                onChange={this._campaignNameChange}
                                maxLength={64}
                                name="campaignName"
                                value={campaignName}
                                placeholder="Add Campaign Name Here"
                            />
                        </div>
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
                        <div className="form-group campaign-name-container">
                            <label className="ml-0">
                                Redirect to URL (optional)
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                onChange={this._postsubmitRedirectUrlChange}
                                maxLength={64}
                                name="postsubmitRedirectUrl"
                                value={postsubmitRedirectUrl}
                                placeholder="Set Redirect URL after Button is clicked"
                            />
                        </div>
                        <div className="pt-3 text-right">
                            <button
                                className="btn btn-primary btn-next"
                                onClick={this._submit}
                            >
                                Save and Complete
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex-fill card ml-2 d-flex flex-column shadow-sm">
                    <h5 className="text-center card-title p-4 m-0">
                        How to Use It{' '}
                        <a
                            className="btn btn-primary help"
                            href="https://developers.facebook.com/docs/messenger-platform/plugin-reference/send-to-messenger"
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
                                <div className="row mb-5">
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="ml-0">
                                                Button Color
                                            </label>
                                            <Select
                                                onChange={e => {
                                                    this.setState({
                                                        buttonColor: e.value
                                                    });
                                                }}
                                                options={BUTTON_COLORS}
                                                getOptionLabel={option =>
                                                    option.name
                                                }
                                                getOptionValue={option =>
                                                    option.value
                                                }
                                                value={BUTTON_COLORS.find(
                                                    x => x.value == buttonColor
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
                                            <SendToMessenger
                                                color={buttonColor}
                                                dataRef={refParameter}
                                                messengerAppId={
                                                    process.env
                                                        .REACT_APP_FACEBOOK_APP_ID
                                                }
                                                pageId={pageInfo.fbId}
                                                size={buttonSize}
                                            />
                                        </FacebookProvider>{' '}
                                    </div>
                                </div>
                                <hr />
                            </div>
                            <div className="px-3 pt-3 d-flex flex-row align-items-center">
                                <div className="flex-fill mr-3">
                                    <div className="form-group">
                                        <label className="ml-0">
                                            HTML Code to insert
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
                        </>
                    )}
                </div>
            </div>
        );
    }
}

Buttons.propTypes = {
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
    connect(mapStateToProps, mapDispatchToProps)(Buttons)
);
