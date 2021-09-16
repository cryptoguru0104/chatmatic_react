import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import DatePicker from 'react-datepicker';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import _ from 'lodash';
import moment from 'moment';
import { Collapse } from 'components';
import Gender from './components/Gender';
import Type from './components/Type';
import HasTag from './components/HasTag';
import SubscribedCampaign from './components/SubscribedCampaign';
import SubscriberDate from './components/SubscriberDate';

import { getPageCampaigns as getCampaigns } from 'services/campaigns/campaignsActions';
import { getPageSubscribersBroadcastCount } from 'services/subscribers/subscribersActions';
import { getPageCampaigns } from 'services/campaigns/selector';
import { getEngageAddState } from '../../services/selector';
import {
    addBroadcastCondition,
    updateBroadcast,
    saveBroadcast
} from '../../services/actions';
import { formatBroadcast } from 'services/utils';

import logo from 'assets/images/icon-messages-lg.png';
import './styles.css';
const NON_PROMOTIONAL_TAGS = [
    {
        description:
            "Send the user reminders or updates for an event they have registered for (e.g., RSVP'ed, purchased tickets). This tag may be used for upcoming events and events in progress.",
        tag: 'CONFIRMED_EVENT_UPDATE'
    },
    {
        description: 'Notify the user of an update on a recent purchase.',
        tag: 'POST_PURCHASE_UPDATE'
    },
    {
        description:
            'Notify the user of a non-recurring change to their application or account',
        tag: 'ACCOUNT_UPDATE'
    }
];
const broadcastTypes = [
    {
        key: 'marketing',
        label: 'Marketing',
        disabled: false,
        description:
            '(This is a message intended to promote a product of some kind, and is only allowed to be sent for 24 hours after someone last was active with your page).'
    },
    {
        key: 'notification',
        label: 'Notification',
        disabled: false,
        description:
            '(This is a message that can contain updates and notifications that you would like your subscribers to receive. ' +
            'Make sure your subscribers explicitly subscribed for these notifications, and do not use this as a way to announce contests/ sales/ deals. ' +
            "This message will be sent to everyone you select below regardless of how long it's been since they subscribed)."
    },
    {
        key: 'non-promotional',
        label: 'Non Promotional',
        disabled: false,
        description:
            'Non Promotional Content that falls under specific categories can be sent via this option'
    }
];

class BroadcastSelect extends React.Component {
    componentDidMount() {
        this.props.actions.getCampaigns(this.props.match.params.id);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.loadingCampaigns || nextProps.loadingWorkflows) {
            Swal({
                title: 'Please wait...',
                text: 'Loading...',
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (this.props.loadingCampaigns || this.props.loadingWorkflows) {
            Swal.close();

            if (nextProps.errorCampaigns) {
                toastr.error(
                    'Campaigns Loading Error',
                    nextProps.errorCampaigns
                );
            }
            if (nextProps.errorWorkflows) {
                toastr.error(
                    'Workflows Loading Error',
                    nextProps.errorWorkflows
                );
            }
            if (nextProps.errorSubscribers) {
                toastr.error(
                    'Subscribers Loading Error',
                    nextProps.errorSubscribers
                );
            }

            const broadcast = nextProps.broadcasts.find(
                broadcast => broadcast.workflowUid === nextProps.engageAdd.uid
            );

            if (!nextProps.engageAdd.uid || !broadcast || !broadcast.uid) {
                this.props.history.push(
                    `/page/${this.props.match.params.id}/engages/add/builder`
                );
            } else {
                this.props.actions.updateBroadcast(broadcast);
            }
        }

        if (nextProps.engageAdd.loading) {
            Swal({
                title: 'Please wait...',
                text: 'Saving broadcast...',
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (this.props.engageAdd.loading) {
            Swal.close();

            if (nextProps.engageAdd.error) {
                toastr.error('Saving Error', nextProps.engageAdd.error);
            } else {
                this.props.history.push(
                    `/page/${this.props.match.params.id}/engages`
                );
            }
        }
    }

    componentDidUpdate(prevProps) {
        const { actions, broadcast, match } = this.props;

        const conditions = (formatBroadcast(broadcast) || {}).conditions || [];
        const prevConditions =
            (formatBroadcast(prevProps.broadcast) || {}).conditions || [];

        if (
            broadcast.broadcastType &&
            (broadcast.broadcastType !== prevProps.broadcast.broadcastType ||
                JSON.stringify(conditions) !== JSON.stringify(prevConditions))
        ) {
            actions.getPageSubscribersBroadcastCount(
                match.params.id,
                broadcast.broadcastType,
                conditions
            );
        }
    }

    _updateBroadcast = () => {
        const {
            broadcastType,
            facebookMessagingTag,
            intention,
            startTime,
            conditions
        } = this.props.broadcast;

        if (
            !broadcastType ||
            (broadcastType == 'non-promotional' && !facebookMessagingTag) ||
            !intention ||
            !startTime ||
            (conditions &&
                conditions.length > 0 &&
                !conditions[conditions.length - 1].value)
        ) {
            toastr.warning('Please fill in all the required input fields.');
        } else if (this.props.broadCastSubscribersCount <= 0) {
            Swal({
                title: 'No subscribers will be reached.',
                text:
                    'It does not look like your engagement will be sent to anyone according to the conditions you set forth.' +
                    'We can attempt to broadcast it anyway, but it looks like this may not be what you want. Would you like to continue?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Broadcast my engagement anyway',
                cancelButtonText:
                    'Woops, I want to go back and change something',
                confirmButtonColor: '#274BF0'
            }).then(result => {
                if (result.value) {
                    this.props.actions.saveBroadcast(
                        this.props.match.params.id
                    );
                }
            });
        } else {
            this.props.actions.saveBroadcast(this.props.match.params.id);
        }
    };

    _renderConditions = () => {
        if (this.props.broadcast && this.props.broadcast.conditions) {
            return this.props.broadcast.conditions.map((condition, index) => {
                switch (condition.type) {
                    case 'user_gender':
                        return <Gender conditionIndex={index} key={index} />;
                    case 'hasTag':
                        return <HasTag conditionIndex={index} key={index} />;
                    case 'ifUser':
                        return (
                            <SubscribedCampaign
                                conditionIndex={index}
                                key={index}
                            />
                        );
                    case 'subscribed_date':
                        return (
                            <SubscriberDate
                                conditionIndex={index}
                                key={index}
                            />
                        );
                    default:
                        return <Type conditionIndex={index} key={index} />;
                }
            });
        }
    };
    _renderSendTimeDescription = () => {
        const { broadcast } = this.props;
        if (broadcast.startTime === 'immediately') {
            return (
                <span>
                    This will send your broadcast immediately and as quickly as
                    we can
                </span>
            );
        } else if (broadcast.startTime == 'optimized') {
            return (
                <span>
                    Open Optimization timing will distribute your message to
                    your subscribers at the time they are most likely to engage.
                    We will send your broadcast in batches based on each
                    individual subscribers most recent activity, increasing the
                    chances that the time they receive the message is the best
                    time for them
                </span>
            );
        } else {
            return (
                <DatePicker
                    selected={
                        this.props.broadcast.startTime
                            ? moment(
                                  moment
                                      .utc(this.props.broadcast.startTime)
                                      .toDate()
                              )
                                  .local()
                                  .toDate()
                            : null
                    }
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dropdownMode={'select'}
                    onChange={date =>
                        this.props.actions.updateBroadcast({ startTime: date })
                    }
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="condition-datepicker"
                    placeholderText="Select Date And Time"
                />
            );
        }
    };
    render() {
        if (!this.props.broadcast) {
            return <div />;
        }
        const { actions, broadcast, broadCastSubscribersCount } = this.props;

        return (
            <div className="position-relative">
                <div className="d-flex bg-white broadcast-select-container">
                    <div className="d-flex flex-column select-left-container">
                        <p className="select-content-title">
                            Please Describe The Type Of Message You Are Sending
                        </p>
                        <div className="d-flex flex-column select-content">
                            <div className="message-types-container">
                                {broadcastTypes.map((broadcastType, index) => (
                                    <label key={index} className="message-type">
                                        <input
                                            onChange={event =>
                                                actions.updateBroadcast({
                                                    broadcastType:
                                                        event.target.value
                                                })
                                            }
                                            type="radio"
                                            value={broadcastType.key}
                                            checked={
                                                broadcast.broadcastType ===
                                                broadcastType.key
                                            }
                                            disabled={broadcastType.disabled}
                                        />
                                        <span>
                                            <span className="type-label">
                                                {broadcastType.label}
                                            </span>
                                            <span className="type-description">
                                                {broadcastType.description}
                                            </span>
                                        </span>
                                    </label>
                                ))}
                                <Collapse
                                    isOpen={
                                        broadcast.broadcastType ==
                                        'non-promotional'
                                    }
                                >
                                    <label className="ml-3 mb-0">
                                        Please select one of the following:
                                    </label>
                                    {NON_PROMOTIONAL_TAGS.map(t => (
                                        <label
                                            key={t.tag}
                                            className="mx-3 message-type"
                                        >
                                            <input
                                                onChange={event =>
                                                    actions.updateBroadcast({
                                                        facebookMessagingTag:
                                                            event.target.value
                                                    })
                                                }
                                                type="radio"
                                                value={t.tag}
                                                checked={
                                                    broadcast.facebookMessagingTag ===
                                                    t.tag
                                                }
                                            />
                                            <span>
                                                <span className="type-label ml-1">
                                                    {t.tag}
                                                </span>
                                                <span className="type-description">
                                                    {t.description}
                                                </span>
                                            </span>
                                        </label>
                                    ))}
                                </Collapse>
                            </div>

                            <div className="form-group message-details-container">
                                <label htmlFor="intention" className="mt-2 m-0">
                                    Message Details
                                </label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Describe"
                                        id="intention"
                                        value={
                                            this.props.broadcast.intention || ''
                                        }
                                        onChange={event =>
                                            this.props.actions.updateBroadcast({
                                                intention: event.target.value
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="send-time-options">
                                <label>When Should we send your message?</label>
                                <div className="d-flex">
                                    <label
                                        key="immediately"
                                        className="mr-5 d-flex align-items-center send-time-option"
                                    >
                                        <input
                                            onChange={event =>
                                                this.props.actions.updateBroadcast(
                                                    {
                                                        startTime: 'immediately'
                                                    }
                                                )
                                            }
                                            type="radio"
                                            checked={
                                                this.props.broadcast
                                                    .startTime === 'immediately'
                                            }
                                        />
                                        <span className="ml-2">
                                            Immediately
                                        </span>
                                    </label>
                                    <label
                                        key="timely"
                                        className="mr-5 d-flex align-items-center send-time-option"
                                    >
                                        <input
                                            onChange={event =>
                                                this.props.actions.updateBroadcast(
                                                    { startTime: '' }
                                                )
                                            }
                                            type="radio"
                                            checked={
                                                broadcast.startTime !==
                                                    'immediately' &&
                                                broadcast.startTime !==
                                                    'optimized'
                                            }
                                        />
                                        <span className="ml-2">Timed</span>
                                    </label>
                                    <label
                                        key="optimized"
                                        className="d-flex align-items-center send-time-option"
                                    >
                                        <input
                                            onChange={event =>
                                                this.props.actions.updateBroadcast(
                                                    { startTime: 'optimized' }
                                                )
                                            }
                                            type="radio"
                                            checked={
                                                broadcast.startTime ==
                                                'optimized'
                                            }
                                        />
                                        <span className="ml-2">
                                            Optimization Timing
                                        </span>
                                    </label>
                                </div>
                                {this._renderSendTimeDescription()}
                            </div>

                            <div className="d-flex flex-column conditions-container">
                                <span className="conditions-title">
                                    Conditions
                                </span>
                                {this._renderConditions()}
                                <button
                                    className="btn btn-light text-primary font-weight-normal btn-add-condition"
                                    onClick={() =>
                                        this.props.actions.addBroadcastCondition()
                                    }
                                    disabled={
                                        this.props.broadcast &&
                                        this.props.broadcast.conditions &&
                                        this.props.broadcast.conditions
                                            .length >= 1 &&
                                        !this.props.broadcast.conditions[
                                            this.props.broadcast.conditions
                                                .length - 1
                                        ].value
                                    }
                                >
                                    Add a Condition
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="select-right-container">
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <img src={logo} alt="" />
                            <p className="text-center">
                                Please Customize The Details For Who Should Get
                                This Message
                            </p>
                        </div>
                    </div>
                </div>
                <div className="w-100 position-absolute action-buttons-container">
                    <div className="w-100 d-flex justify-content-between align-items-end">
                        <span className="subscribers-count">
                            {`Currently ${broadCastSubscribersCount} Subscribers in This Campaign`}
                        </span>
                        <div>
                            <Link
                                className="btn btn-previous"
                                to={`/page/${this.props.pageId}/engages/add`}
                            >
                                <i className="fa fa-arrow-left mr-3" />
                                Previous
                            </Link>
                            <button
                                className="btn btn-schedule"
                                onClick={this._updateBroadcast}
                            >
                                Schedule/ Complete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

BroadcastSelect.propTypes = {
    broadcasts: PropTypes.array.isRequired,
    campaigns: PropTypes.array.isRequired,
    broadCastSubscribersCount: PropTypes.number.isRequired,
    engageAdd: PropTypes.object.isRequired,
    loadingCampaigns: PropTypes.bool.isRequired,
    errorCampaigns: PropTypes.any,
    loadingWorkflows: PropTypes.bool.isRequired,
    errorWorkflows: PropTypes.any,
    loadingSubscribers: PropTypes.bool.isRequired,
    errorSubscribers: PropTypes.any,
    broadcast: PropTypes.any,
    actions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    broadcasts: state.default.workflows.broadcasts,
    campaigns: getPageCampaigns(state),
    broadCastSubscribersCount:
        state.default.subscribers.broadCastSubscribersCount,
    engageAdd: state.default.scenes.engageAdd,
    loadingCampaigns: state.default.campaigns.loading,
    errorCampaigns: state.default.campaigns.error,
    loadingWorkflows: state.default.workflows.loading,
    errorWorkflows: state.default.workflows.error,
    loadingSubscribers: state.default.subscribers.loading,
    errorSubscribers: state.default.subscribers.error,
    broadcast: getEngageAddState(state).broadcast
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            addBroadcastCondition,
            updateBroadcast,
            saveBroadcast,
            getCampaigns,
            getPageSubscribersBroadcastCount
        },
        dispatch
    )
});

export default connect(mapStateToProps, mapDispatchToProps)(BroadcastSelect);
