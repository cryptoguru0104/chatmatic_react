import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toastr } from 'react-redux-toastr';
import PropTypes from 'prop-types';
import moment from 'moment';
import Swal from 'sweetalert2';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { deleteCampaign } from 'services/campaigns/campaignsActions';
import { updateNewCampaignInfo } from '../../../CampaignsAdd/services/actions';
import { getCampaignAdd } from '../../../CampaignsAdd/services/selector';
import { getPageCampaigns } from '../../../../../../services/campaigns/selector';

/** import components */
import {
    UncontrolledCollapse,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'components';
import Clicked from '../../../../components/Messages/Clicked/Clicked';
import Sent from '../../../../components/Messages/Sent/Sent';
import Opened from '../../../../components/Messages/Opened/Opened';
import ProgressCircle from '../../../../components/ProgressCircle/ProgressCircle';

/** import assets */
import imgMsg from 'assets/images/icon-messages.png';
import activeLandingIcon from 'assets/images/icon-active-landing.png';
import activeScanIcon from 'assets/images/icon-active-scan.png';
import activeRefurlIcon from 'assets/images/icon-active-refurl.png';

const getWidgetType = (type, approvalMethod) => {
    let widgetType = '';

    switch (type) {
        case 'followup_message':
            widgetType = 'Follow Up';
            break;
        case 'landing_page':
        case 'buttons':
            widgetType = 'Button';
            break;
        case 'checkbox':
            widgetType = 'Checkbox';
            break;
        case 'scan_refurl':
            widgetType = 'Scan Code';
            break;
        case 'm_dot_me':
            widgetType = 'M.Me Link';
            break;
        default:
            console.log('type', type);
            return;
    }
    return widgetType;
};

const getWidgetIcon = type => {
    switch (type) {
        case 'landing_page':
            return activeLandingIcon;
        case 'scan_refurl':
            return activeScanIcon;
        default:
            return activeRefurlIcon;
    }
};

class Collapse extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            copied: false
        };
    }

    _deleteCampaign = () => {
        Swal({
            title: 'Are you sure?',
            text: `Please verify that you want to delete the following campaign: ${this.props.campaignName}`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete my campaign',
            cancelButtonText: 'No, I want to keep it',
            confirmButtonColor: '#f02727'
        }).then(result => {
            if (result.value) {
                this.props.actions.deleteCampaign(
                    this.props.pageId,
                    this.props.uid
                );
            }
        });
    };

    _editCampaign = () => {
        const { url } = this.props.match;

        if (this.props.campaignAdd.type) {
            Swal({
                title: 'Unsaved Campaign Detected',
                text:
                    'It looks like you were working on a campaign but never saved it. ' +
                    'Would you like to delete your unsaved changes or continue where you left off?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Delete all my unsaved changes',
                cancelButtonText: 'Continue where I left off',
                confirmButtonColor: '#f02727'
            }).then(result => {
                if (result.value) {
                    const campaign =
                        this.props.campaigns.find(
                            campaign => campaign.uid === this.props.uid
                        ) || {};

                    this.props.actions.updateNewCampaignInfo(
                        this.props.pageId,
                        campaign,
                        false
                    );
                    this.props.history.push(`${url}/add/${this.props.type}`);
                } else {
                    const currentCampaignType = this.props.campaignAdd.type;

                    this.props.history.push(
                        `${url}/add/${currentCampaignType}`
                    );
                }
            });
        } else {
            const campaign =
                this.props.campaigns.find(
                    campaign => campaign.uid === this.props.uid
                ) || {};

            this.props.history.push(`${url}/add/${this.props.type}`);
            this.props.actions.updateNewCampaignInfo(
                this.props.pageId,
                campaign,
                false
            );
        }
    };

    _copyUrl = () => {
        this.setState({ copied: true });
        toastr.success('Success!', 'Copied');
    };

    render() {
        const { collapse } = this.props;
        const {
            campaignName,
            subscriptions,
            impressions,
            conversions,
            type,
            approvalMethod,
            createdAtUtc,
            messagesClicked,
            messagesRead,
            messagesSent,
            totalSubscribers,
            todaySubscribers,
            mMeUrl,
            publicId
        } = this.props;
        const createdAt = moment(createdAtUtc).format('DD/MM/YYYY');
        const scanCodeDownloadUrl = `${process.env.REACT_APP_MEDIA_SERVER}/public/messenger_codes/${publicId}/messenger-codes.zip`;
        const campaignLink =
            type === 'landing_page'
                ? `${process.env.REACT_APP_PUBLIC_URL}c/?id=${publicId}`
                : mMeUrl;

        return (
            <div className="list-group-item list-group-item-action p-0 border-top-0">
                <div className="py-2 px-3">
                    <div className="d-flex">
                        <div className="flex-grow-0">
                            <small style={{ zIndex: 10000 }}>
                                <UncontrolledDropdown nav inNavbar>
                                    <DropdownToggle nav>
                                        <i className="fa fa-ellipsis-h mr-2" />
                                    </DropdownToggle>

                                    <DropdownMenu>
                                        {type !== 'scan_refurl' && (
                                            <DropdownItem>
                                                <CopyToClipboard
                                                    text={campaignLink}
                                                    onCopy={this._copyUrl}
                                                >
                                                    <span>
                                                        Get campaign link
                                                    </span>
                                                </CopyToClipboard>
                                            </DropdownItem>
                                        )}
                                        {type === 'scan_refurl' && (
                                            <DropdownItem>
                                                <span
                                                    onClick={() =>
                                                        window.open(
                                                            scanCodeDownloadUrl
                                                        )
                                                    }
                                                >
                                                    Download scan codes
                                                </span>
                                            </DropdownItem>
                                        )}
                                        <DropdownItem>
                                            <div onClick={this._editCampaign}>
                                                Edit campaign
                                            </div>
                                        </DropdownItem>
                                        <DropdownItem>
                                            <div onClick={this._deleteCampaign}>
                                                Delete campaign
                                            </div>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </small>
                        </div>
                        <div
                            className="flex-grow-1 flex-shrink-1"
                            id={`heading${collapse}`}
                            role="button"
                            data-toggle="collapse"
                            data-target={`#collapse${collapse}`}
                            aria-expanded="true"
                            data-parent="#accordion"
                            aria-controls={`collapse${collapse}`}
                        >
                            <div className="row">
                                <div className="col-4">
                                    <small>{campaignName}</small>
                                </div>
                                <div className="col-2">
                                    <small>{subscriptions}</small>
                                </div>
                                <div className="col-2">
                                    <small>{impressions}</small>
                                </div>
                                <div className="col-2">
                                    <small>{conversions}</small>
                                </div>
                                <div className="col-2">
                                    <small>
                                        {getWidgetType(type, approvalMethod)}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <UncontrolledCollapse toggler={`heading${collapse}`}>
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5>
                                    {' '}
                                    {campaignName}{' '}
                                    <small className="text-muted">
                                        Created {createdAt}
                                    </small>{' '}
                                </h5>
                                <div className="d-flex align-items-center">
                                    <span className="text-muted mr-1">
                                        Type:
                                    </span>
                                    <img
                                        src={getWidgetIcon(type)}
                                        alt=""
                                        width={15}
                                        height={15}
                                        className="mx-2"
                                        style={{ objectFit: 'contain' }}
                                    />
                                    {getWidgetType(type, approvalMethod)}
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-3 d-flex pl-sm-5 align-items-center">
                                    <ProgressCircle progress="70" />

                                    <div className="d-flex flex-column">
                                        <h4 className="text-primary m-0">
                                            {totalSubscribers}
                                        </h4>
                                        <small className="font-weight-bold">
                                            TOTAL SUBSCRIBERS
                                        </small>
                                        <small>
                                            <span className="font-weight-bold">
                                                {todaySubscribers}
                                            </span>{' '}
                                            <span className="text-muted">
                                                TODAY
                                            </span>
                                        </small>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="list-group-item border rounded px-2 py-3 d-flex justify-content-around align-items-center">
                                        <div className="d-flex justify-content-center align-items-center">
                                            <img
                                                src={imgMsg}
                                                alt=""
                                                className="mr-2"
                                            />
                                            <Sent number={messagesSent} />
                                        </div>
                                        <Opened
                                            sent={messagesSent}
                                            opened={messagesRead}
                                        />
                                        <Clicked
                                            sent={messagesSent}
                                            clicked={messagesClicked}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </UncontrolledCollapse>
            </div>
        );
    }
}

Collapse.propTypes = {
    uid: PropTypes.number.isRequired,
    publicId: PropTypes.string,
    enabled: PropTypes.number,
    createdAtUtc: PropTypes.string,
    type: PropTypes.string,
    campaignName: PropTypes.string,
    workflowUid: PropTypes.number,
    presubmitTitle: PropTypes.string,
    presubmitBody: PropTypes.string,
    presubmitImage: PropTypes.string,
    approvalMethod: PropTypes.string,
    checkboxPluginButtonText: PropTypes.string,
    postsubmitType: PropTypes.string,
    postsubmitRedirectUrl: PropTypes.string,
    postsubmitRedirectUrlButonText: PropTypes.string,
    postsubmitContentTitle: PropTypes.string,
    postsubmitContentBody: PropTypes.string,
    postsubmitContentImage: PropTypes.string,
    impressions: PropTypes.number,
    conversions: PropTypes.number,
    mMeUrl: PropTypes.string,
    subscriptions: PropTypes.number,
    pageId: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired,
    campaignAdd: PropTypes.object.isRequired,
    campaigns: PropTypes.array.isRequired,
    messagesSent: PropTypes.number,
    messagesRead: PropTypes.number,
    messagesClicked: PropTypes.number,
    totalSubscribers: PropTypes.number,
    todaySubscribers: PropTypes.number
};

Collapse.defaultProps = {
    totalSubscribers: 0,
    todaySubscribers: 0
};

const mapStateToProps = state => ({
    campaignAdd: getCampaignAdd(state),
    campaigns: getPageCampaigns(state)
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            deleteCampaign,
            updateNewCampaignInfo
        },
        dispatch
    )
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Collapse)
);
