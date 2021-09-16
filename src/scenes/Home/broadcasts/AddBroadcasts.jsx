import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Radio, Form, Input } from 'semantic-ui-react';
import { Button, Grid } from '@material-ui/core';
import uuid from 'uuid/v4';
import ReactDatePicker from 'react-datepicker';
import moment from 'moment';
import $, { isArray } from 'jquery';
import { toastr } from 'react-redux-toastr';
import Swal from 'sweetalert2';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import { Block, Svg } from '../Layout';
// import { sequenceGraph } from 'assets/img';

import { getPageWorkflows } from 'services/workflows/workflowsActions';
import { getTagsState } from 'services/tags/selector';
import { getTags } from 'services/tags/actions';
import { getPageCampaigns } from 'services/campaigns/campaignsActions';
import { addBroadcast, getEligibleSubscribers } from 'services/broadcasts/broadcastsActions';
import { getSubscribers, getSubscribersState} from 'services/subscribers/selector';
import { clearPageSubscribers,  } from 'services/subscribers/subscribersActions';

import './AddBroadcasts.scss';

const conditionTypes = {
    // user_gender: {
    //     key: 'user_gender',
    //     value: 'Gender',
    //     defaultOption: 'user_gender',
    //     defaultValue: null
    // },
    user_subscribed: {
        key: 'user_subscribed',
        value: 'Subscribed Date',
        defaultOption: 'user_subscribed_after_date',
        defaultValue: moment().format('MMM D, YYYY')
    },
    user: {
        key: 'user',
        value: 'Trigger',
        defaultOption: 'user_subscribed_to_campaign',
        defaultValue: []
    },
    tag: {
        key: 'tag',
        value: 'Tag',
        defaultOption: 'user_tagged_as',
        defaultValue: []
    }
};

const conditionTypeOptions = {
    user_gender: {
        user_gender: 'is'
    },
    user_subscribed: {
        user_subscribed_after_date: 'After',
        user_subscribed_before_date: 'Before',
        user_subscribed_on_date: 'On'
    },
    user: {
        user_subscribed_to_campaign: 'Subscribed to trigger',
        user_not_subscribed_to_campaign: 'Not subscribed to trigger'
    },
    tag: {
        user_tagged_as: 'Has tag',
        user_not_tagged_as: "Hasn't"
    }
};

class AddBroadcast extends Component {
    constructor(props) {
        super(props);

        let type = this.props.match.params.type;
        if(type == 'messenger') type = 'marketing';

        this.state = {
            // workflowUid: 748,
            workflowUid: props.workflowUid,
            broadcastType: type,
            broadcastSubType: 'CONFIRMED_EVENT_UPDATE',
            scheduleType: 'immediately',
            timed: null,
            broadcastName: '',
            intention: '',
            showSelectConditions: false, // for condition
            conditionType: null, // for condition
            activeMenu: null,
            conditions: [],
            isSaveComplete: false,
            isAddingNewCondition: false,
            addingNewConditionOperator: 'OR',
            matchConditionOperator: 'AND',
        };
    }

    //#region life cycle
    componentDidMount = () => {
        if(this.props.workflowUid) {
        }
        else {
            this.props.history.push({
                pathname: `/page/${this.props.match.params.id}/broadcasts`
            });
            return;
        }
        this.props.actions.getPageWorkflows(this.props.match.params.id);
        this.props.actions.getPageCampaigns(this.props.match.params.id);
        this.props.actions.getTags(this.props.match.params.id);

        this.updateEligibleSubscribers([]);

        this.addListner();
    };

    UNSAFE_componentWillReceiveProps = nextProps => {
        const { isSaveComplete } = this.state;
        if (nextProps.loading) {
            this.setState({
                isSaveComplete: true
            });
            Swal({
                title: 'Please wait...',
                text: 'We are publishing broadcast...',
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (!nextProps.loading && isSaveComplete) {
            Swal.close();
            if (nextProps.error) {
                this.setState({
                    isSaveComplete: false
                });
            } else {
                this.props.history.push({
                    pathname: `/page/${this.props.match.params.id}/broadcasts`
                });
            }
        }

        let conditions = this.state.conditions || [],
            updateEligibleSubscribers = false;

        if(this.props.newBroadcastConditionTriggers.length > 0 && nextProps.workflowTriggers.length > 0) {
            if(conditions.filter(c => c.type == 'user' && c.option == 'user_subscribed_to_campaign').length == 0) {
                if(conditions.length > 0) conditions[conditions.length-1].operator='AND';
                conditions.push({
                    uid: uuid(),
                    type: 'user',
                    option: 'user_subscribed_to_campaign',
                    value: nextProps.workflowTriggers.filter(t => this.props.newBroadcastConditionTriggers.indexOf(t.uid) !== -1).map(t => ({uid: t.uid, name: t.triggerName}))
                });
                updateEligibleSubscribers = true;
            }
        }
        if(this.props.newBroadcastConditionTags.length > 0 && nextProps.tags.length > 0) {
            if(conditions.filter(c => c.type == 'tag' && c.option == 'user_tagged_as').length == 0) {
                let conditions = this.state.conditions;
                if(conditions.length > 0) conditions[conditions.length-1].operator='AND';
                conditions.push({
                    uid: uuid(),
                    type: 'tag',
                    option: 'user_tagged_as',
                    value: nextProps.tags.filter(t => this.props.newBroadcastConditionTags.indexOf(t.uid) !== -1).map(t => ({uid: t.uid, name: t.value}))
                });
                updateEligibleSubscribers = true;
            }
        }
        if(updateEligibleSubscribers) this.updateEligibleSubscribers(conditions);
        this.setState({ conditions });
    };
    //#endregion

    //#region functionality
    addListner = () => {
        $(document).mouseup(e => {
            const id =
                $(e.target)
                    .closest('.conditions-block')
                    .attr('id') || null;
            // console.log(id);
            if (!id) {
                this.setState({
                    showSelectConditions: false,
                    activeCondition: null
                });
            }
        });
    };

    openTypesMenu = uid => () => {
        this.setState({
            activeCondition: uid,
            activeMenu: 'types',
            showSelectConditions: true
        });
    };

    openOptionsMenu = uid => () => {
        this.setState({
            activeCondition: uid,
            activeMenu: 'options',
            showSelectConditions: false
        });
    };

    onSelectWorkflow = ({ uid }) => {
        // console.log('workflow', w);
        this.setState({
            workflowUid: uid
        });
    };

    handleName = broadcastName => {
        this.setState({
            broadcastName
        });
    };

    handleBroadcastType = broadcastType => {
        this.setState({
            broadcastType
        });
    };

    handleBroadcastSubType = broadcastSubType => {
        this.setState({
            broadcastSubType
        });
    };

    addConditionLogic = (operator) => e => {
        this.setState({addingNewConditionOperator: operator});
        this.toggleSelectConditionTypes(e);
    };

    handleCondition = (type, oldUid) => e => {
        this.setState(({ conditions }) => {
            const uid = uuid();

            const con = {
                uid,
                type,
                option: conditionTypes[type].defaultOption,
                value: isArray(conditionTypes[type].defaultValue) ? JSON.parse(JSON.stringify(conditionTypes[type].defaultValue)) : conditionTypes[type].defaultValue,
            };

            if (oldUid) {
                const ind = conditions.findIndex(c => c.uid === oldUid);
                if (ind !== -1) {
                    if (conditions[ind].type !== type) {
                        con.uid = oldUid;
                        conditions[ind] = con;
                    }
                }
            } else {
                // update last condition operator
                if(conditions.length > 0 && this.state.addingNewConditionOperator) {
                    conditions[conditions.length-1].operator = this.state.addingNewConditionOperator;
                    if(this.state.addingNewConditionOperator != this.state.matchConditionOperator) {
                        this.setState({
                            matchConditionOperator: null
                        });
                    }
                }
                conditions.push(con);
            }
            return {
                conditions,
                showSelectConditions: false,
                activeCondition: uid,
                activeMenu: 'options',
                isAddingNewCondition: null
            };
        });
    };

    removeCondition = (uid) => {
        const { conditions } = this.state;
        let index = conditions.findIndex(c => c.uid == uid);
        if(index === -1) return;
        if(index == 0) {    //first one

        }
        else if(index == conditions.length - 1) {    // last one
            conditions[index - 1].operator = null;
        }
        else {  // in the mid
            conditions[index-1].operator = conditions[index].operator;
        }
        conditions.splice(index, 1); 
        this.setState({ conditions });
        this.updateEligibleSubscribers(conditions);
    };

    handleSchedule = scheduleType => {
        this.setState({
            scheduleType
        });
    };

    updateConditionValue = (uid, value, type) => {
        const { conditions } = this.state;
        const ind = conditions.findIndex(c => c.uid === uid);
        if (ind === -1) {
            return false;
        }
        switch (type) {
            // case conditionTypes.user_gender.key:
            //     conditions[ind].value = value;
            //     this.setState({ activeCondition: null });
            //     break;
            case conditionTypes.user_subscribed.key:
                conditions[ind].value = value;
                this.setState({ activeCondition: null });
                break;
            case conditionTypes.user.key:
                if (conditions[ind].value) {
                    const oldValues = conditions[ind].value.map(v => v.uid);
                    if (oldValues.includes(value.uid)) {
                        conditions[ind].value = conditions[ind].value.filter(
                            v => v.uid !== value.uid
                        );
                    } else {
                        conditions[ind].value.push(value);
                    }
                } else {
                    conditions[ind].value = [value];
                }
                break;
            case conditionTypes.tag.key:
                if (conditions[ind].value) {
                    const oldValues = conditions[ind].value.map(v => v.uid);
                    if (oldValues.includes(value.uid)) {
                        conditions[ind].value = conditions[ind].value.filter(
                            v => v.uid !== value.uid
                        );
                    } else {
                        conditions[ind].value.push(value);
                    }
                } else {
                    conditions[ind].value = [value];
                }
                break;
            default:
                return null;
        }

        this.setState({
            conditions
        });
        this.updateEligibleSubscribers(conditions);
    };

    updateConditionOption = (uid, option) => {
        this.setState(({ conditions }) => {
            const ind = conditions.findIndex(c => c.uid === uid);
            if (ind !== -1) {
                conditions[ind].option = option;
            }

            this.updateEligibleSubscribers(conditions);

            return {
                conditions
            };
        });
    };

    toggleSelectConditionTypes = e => {
        e.stopPropagation();
        this.setState(({ showSelectConditions, activeMenu }) => {
            if (activeMenu) {
                return {
                    activeMenu: null,
                    showSelectConditions: true
                };
            } else {
                return {
                    showSelectConditions: !showSelectConditions,
                    activeMenu: null
                };
            }
        });
    };

    resetConditionOperator = (operator) => e => {
        this.setState(({ conditions }) => {
            conditions.forEach((c, i) => {
                if(i == conditions.length - 1) return;
                c.operator = operator;
            });

            this.updateEligibleSubscribers(conditions);

            return {
                matchConditionOperator: operator,
                conditions
            };
        });
    };
    //#endregion

    updateEligibleSubscribers = (conditions) => {
        const { broadcastType } = this.state;
        const filters = this.getTransformedConditions(conditions);
        this.props.actions.getEligibleSubscribers(this.props.pageId, broadcastType, filters);
    }

    //#region Save Broadcast
    getTransformedConditions = (conditions) => {
        const conditonsJson = [];
        conditions.map(c => {
            let item = null;
            switch (c.type) {
                // case conditionTypes.user_gender.key:
                //     conditonsJson.push({condition: c.option, variable: c.value});
                //     // conditonsJson[c.option] = c.value;
                //     break;
                case conditionTypes.user_subscribed.key:
                    item = {condition: c.option, variable: c.value ? new Date(c.value) : null};
                    // conditonsJson[c.option] = c.value
                    //     ? new Date(c.value)
                    //     : null;
                    break;
                case conditionTypes.user.key:
                    item = {condition: c.option, variable: c.value.map(v => v.uid)};
                    // conditonsJson[c.option] = c.value.map(v => v.uid);
                    break;
                case conditionTypes.tag.key:
                    item = {condition: c.option, variable: c.value.map(v => v.uid)};
                    // conditonsJson[c.option] = c.value.map(v => v.uid);
                    break;
                default:
                    return null;
            }
            conditonsJson.push(item);
            if(c.operator) conditonsJson.push({operator: c.operator});
        });
        // console.log('con', JSON.stringify(Object.keys(conditonsJson).length > 0 ? [conditonsJson] : []));
        return conditonsJson;
    };

    createBroadcast = () => {
        const {
            workflowUid,
            broadcastType,
            broadcastSubType,
            scheduleType,
            timed,
            intention
        } = this.state;
        const { workflows } = this.props;
        const triggerName = workflows.find(w => w.uid == workflowUid).name;

        let facebookMessagingType = 'UPDATE';
        let facebookMessagingTag = null;

        if (broadcastType === 'non-promotional') {
            facebookMessagingType = 'MESSAGE_TAG';
            facebookMessagingTag = broadcastSubType;
        }

        let fireAtUtc = null;
        let optimized = 0;
        if (scheduleType === 'timed') {
            fireAtUtc = timed;
        } else if (scheduleType === 'optimize') {
            optimized = 1;
        }

        return {
            type: 'broadcast',
            triggerName,
            workflowUid,
            options: {
                broadcastType,
                intention,
                facebookMessagingType,
                facebookMessagingTag,
                fireAtUtc,
                optimized,
                conditionsJson: this.getTransformedConditions(this.state.conditions)
            }
        };
    };

    checkBroadcastValidations = broadcast => {
        const { conditions, scheduleType, timed, intention } = this.state;
        let isValid = true;
        if (scheduleType === 'timed' && !timed) {
            toastr.warning('select valid schedule date and time');
            isValid = false;
        }

        if (
            !intention ||
            (intention && !intention.trim()) ||
            (intention && intention.length < 16)
        ) {
            toastr.warning(
                'please provide message details and it must be more than 15 words.'
            );
            isValid = false;
        }
        conditions.map(c => {
            if (isValid && !c.value) {
                toastr.warning('Select valid value for condition');
                isValid = false;
            }
        });
        return isValid;
    };

    handleSave = () => {
        const broadcast = this.createBroadcast();
        // console.log('broadcast', broadcast, JSON.stringify(broadcast));
        // return false;
        const isValidBroadcast = this.checkBroadcastValidations(broadcast);
        if (isValidBroadcast) {
            this.props.actions.addBroadcast(
                this.props.match.params.id,
                broadcast
            );
        }
    };

    onGoBack = () => {
    //   this.props.history.push(
    //     `/page/${this.props.match.params.id}/broadcasts`
    //   );

        const { workflowUid, broadcastType } = this.state;

        let type = 'broadcast-messenger';
        if(broadcastType == 'sms') type = 'broadcast-sms';
        else if(broadcastType == 'smtp') type = 'broadcast-smtp';
        console.log(`/page/${this.props.match.params.id}/workflows/${this.props.workflowUid}/edit?type=${type}`);
        this.props.history.push({
            pathname: `/page/${this.props.match.params.id}/workflows/${this.props.workflowUid}/edit`,
            search: `?type=${type}`
        });
    };
    //#endregion Save Broadcast

    //#region render
    renderConditionTypes = uid => {
        const { showSelectConditions, conditions } = this.state;
        if (showSelectConditions) {
            return (
                <Block className="con-drop-main">
                    {Object.keys(conditionTypes).map(key => (
                        <span
                            key={key}
                            onClick={this.handleCondition(key, uid)}
                        >
                            {conditionTypes[key].value}
                        </span>
                    ))}
                </Block>
            );
        }
        return null;
    };

    renderConditionPopup = condition => {
        return (
            <Block
                className="genderPopup"
                id="con-op_367e5821-850c-4ea4-bb4c-ced96df581f8"
            >
                <Block className="popleft">
                    <Block role="list" className="ui list">
                        {this.renderConditionOptions(condition)}
                    </Block>
                </Block>
                <Block className="popright">
                    {this.renderConditionOptionValues(condition)}
                </Block>
            </Block>
        );
    };

    renderConditionOptions = ({ type, uid, option }) => {
        return Object.keys(conditionTypeOptions[type]).map(op => (
            <Block key={op} role="listitem" className="item">
                <a
                    href="#"
                    className={`${op === option ? 'active' : ''}`}
                    onClick={() => this.updateConditionOption(uid, op)}
                >
                    {conditionTypeOptions[type][op]}
                </a>
            </Block>
        ));
    };

    renderConditionOptionValues = ({ type, uid, value }) => {
        switch (type) {
            // case conditionTypes.user_gender.key:
            //     return (
            //         <Block className="list">
            //             <a
            //                 href="#"
            //                 className={`${value === 'male' ? 'active' : ''}`}
            //                 onClick={() =>
            //                     this.updateConditionValue(uid, 'female', type)
            //                 }
            //             >
            //                 <span>male</span>
            //             </a>
            //             <a
            //                 href="#"
            //                 className={`${value === 'female' ? 'active' : ''}`}
            //                 onClick={() =>
            //                     this.updateConditionValue(uid, 'female', type)
            //                 }
            //             >
            //                 <span>female</span>
            //             </a>
            //         </Block>
            //     );
            case conditionTypes.user_subscribed.key:
                const selectedDate = value ? new Date(value) : new Date();
                return (
                    <ReactDatePicker
                        selected={selectedDate}
                        onChange={date =>
                            this.updateConditionValue(
                                uid,
                                moment(date).format('MMM D, YYYY'),
                                type
                            )
                        }
                    />
                );
            case conditionTypes.user.key:
                const { workflowTriggers } = this.props;
                const selectedTriggers = value.map(v => v.uid);
                return (
                    <Block className="list">
                        {workflowTriggers &&
                            workflowTriggers.map(t => (
                                <a
                                    key={t.uid}
                                    href="#"
                                    className={`${
                                        selectedTriggers.includes(t.uid)
                                            ? 'active'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        this.updateConditionValue(
                                            uid,
                                            { uid: t.uid, name: t.triggerName },
                                            type
                                        )
                                    }
                                >
                                    <span>{t.triggerName}</span>
                                </a>
                            ))}
                    </Block>
                );
            case conditionTypes.tag.key:
                const { tags } = this.props;
                const selectedTags = value.map(v => v.uid);
                return (
                    <Block className="list">
                        {tags &&
                            tags.map(t => (
                                <a
                                    key={t.uid}
                                    href="#"
                                    className={`${
                                        selectedTags.includes(t.uid)
                                            ? 'active'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        this.updateConditionValue(
                                            uid,
                                            { uid: t.uid, name: t.value },
                                            type
                                        )
                                    }
                                >
                                    <span>{t.value}</span>
                                </a>
                            ))}
                    </Block>
                );
            default:
                return null;
        }
    };

    renderConditions = () => {
        const { conditions, activeCondition, activeMenu } = this.state;
        // console.log('conditions', conditions);

        return conditions.map(c => (
            <Block key={c.uid}>
                <Grid container className="genderBlock render-conditions" justify="flex-start" alignItems="stretch" spacing={1}>
                    <Grid item xs={4}>
                        <Block
                            className="poplink link"
                            onClick={this.openTypesMenu(c.uid)}
                        >
                            <label>{conditionTypes[c.type].value}</label>
                            <div><ExpandMoreIcon /></div>
                        </Block>
                    </Grid>
                    <Grid item xs={4}>
                        <Block
                            className="poplink link error-txt"
                            onClick={this.openOptionsMenu(c.uid)}
                        >
                            <label>{conditionTypeOptions[c.type][c.option]}</label>
                            <div><ExpandMoreIcon /></div>
                        </Block>
                    </Grid>
                    <Grid item xs={4}>
                        {c.type === conditionTypes.user_subscribed.type ? (
                            <Block
                                className={'poplink link error-txt value' +  (!c.value || (isArray(c.value) && c.value.length == 0) ? ' null' : '')}
                                onClick={this.openOptionsMenu(c.uid)} // className={}
                            >
                                <label>{c.value &&
                                isArray(c.value) &&
                                c.value.length > 0
                                    ? c.value.map((v, i) => {
                                        if (i === 0) {
                                            return v.name;
                                        }
                                        return `, ${v.name}`;
                                    })
                                    : c.value}</label>
                                <div><ExpandMoreIcon /></div>
                            </Block>
                        ) : (
                            <Block
                            className={'poplink link error-txt value' +  (!c.value || (isArray(c.value) && c.value.length == 0) ? ' null' : '')}
                                onClick={this.openOptionsMenu(c.uid)}
                            >
                                <label>{c.value &&
                                isArray(c.value) &&
                                c.value.length > 0
                                    ? c.value.map((v, i) => {
                                        if (i === 0) {
                                            return v.name;
                                        }
                                        return `, ${v.name}`;
                                    })
                                    : c.value}</label>
                                <div><ExpandMoreIcon /></div>
                            </Block>
                        )}
                    </Grid>
                    <Block className="delete-condition-container" onClick={() => this.removeCondition(c.uid)}>
                        <DeleteIcon />
                    </Block>
                </Grid>
                {c.uid === activeCondition &&
                    activeMenu === 'options' &&
                    this.renderConditionPopup(c)}
                {c.uid === activeCondition &&
                    activeMenu === 'types' &&
                    this.renderConditionTypes(c.uid)}
                {c.operator && <Grid container justify="flex-start" alignItems="center" className="condition-operator-container">
                    <Block className="hr-dash"></Block>
                    <Block className="operator-label">{c.operator}</Block>
                    <Block className="hr-dash"></Block>
                </Grid>}
            </Block>
        ));
    };
    //#endregion

    render() {
        // const { workflows } = this.props;
        const {
            // workflowUid,
            broadcastType,
            broadcastSubType,
            // broadcastName,
            scheduleType,
            activeMenu,
            intention,
            timed,
            isAddingNewCondition,
            conditions
        } = this.state;
        return (
            <Block className="inner-box-main addbroad-outer-main mt-0">
                <Block className="addbroad-outer">
                    <Block className="addbroad-head">
                        <h2 className="title-head">
                            Broadcast Details
                        </h2>
                        <Button variant="outlined" className="btn-back" startIcon={<KeyboardBackspaceIcon />} onClick={this.onGoBack}>
                            Back
                        </Button>
                    </Block>
                    <Block className="addbroad-outer-form">
                        <Form>
                            {(broadcastType != 'sms' && broadcastType != 'email' ) && <Block className="addbroad-outer-block">
                                <Block className="addbroad-outer-block-heading">
                                    <h4 className="title-head">
                                        {' '}
                                        Contact Type{' '}
                                    </h4>
                                </Block>
                                <Block className="addbroad-outer-block-in">
                                    <Form.Field>
                                        <label>
                                            <input type="radio" disabled={broadcastType == 'sms' || broadcastType == 'email'}  checked={ broadcastType === 'marketing' } onChange={() => this.handleBroadcastType('marketing')} />
                                            <span className="font-bold">{' '}Marketing{' '}</span>
                                            <span style={{ color: '#969696' }}>(This is a message intended to promote a product of some kind, and is only allowed to be sent for 24 hours someone last was active with your page)</span>
                                        </label>
                                    </Form.Field>
                                    <Form.Field>
                                        <label>
                                            <input type="radio" disabled={broadcastType == 'sms' || broadcastType == 'email'} checked={broadcastType ==='non-promotional'} onChange={() => this.handleBroadcastType('non-promotional')} />
                                            <span className="font-bold">{' '}Non Promotional{' '}</span>
                                            <span style={{ color: '#969696' }}>Non Promotional Content that falls under specific categories can be sent via this option</span>
                                        </label>
                                    </Form.Field>
                                    {broadcastType === 'non-promotional' && (
                                        <Block className="addbroad-inner-col1">
                                            <Form.Field>
                                                <label>
                                                    <input type="radio" checked={broadcastSubType === 'CONFIRMED_EVENT_UPDATE'} onChange={() => this.handleBroadcastSubType('CONFIRMED_EVENT_UPDATE')}/>
                                                    <span className="font-bold">{' '}CONFIRMED_EVENT_UPDATE{' '}</span>
                                                    <span style={{ color: '#969696'}}>Send the user reminders or updates for an event they have registered for (e.g., RSVPed purchased tickets). This tag may be used for upcoming events and events in progress.</span>
                                                </label>
                                            </Form.Field>
                                            <Form.Field>
                                                <label>
                                                    <input type="radio" checked={ broadcastSubType === 'POST_PURCHASE_UPDATE' } onChange={() => this.handleBroadcastSubType('POST_PURCHASE_UPDATE')} />
                                                    <span className="font-bold">{' '}POST_PURCHASE_UPDATE{' '}</span>
                                                    <span style={{ color: '#969696' }}>Notify the user of an update on a recent purchase.</span>
                                                </label>
                                            </Form.Field>
                                            <Form.Field>
                                                <label>
                                                    <input type="radio" checked={broadcastSubType === 'ACCOUNT_UPDATE' } onChange={() => this.handleBroadcastSubType('ACCOUNT_UPDATE')} />
                                                    <span className="font-bold">{' '}ACCOUNT_UPDATE{' '}</span>
                                                    <span style={{color: '#969696' }}>Notify the user of a non-recurring change to their application or account</span>
                                                </label>
                                            </Form.Field>
                                        </Block>
                                    )}
                                </Block>
                            </Block>}

                            <Block className="addbroad-outer-block" >
                                <Block className="addbroad-outer-block-heading">
                                    <h4 className="title-head">{' '}Message Details{' '}</h4>
                                </Block>

                                <Block className="addbroad-outer-block-in">
                                    <Block className="w-100 uiinput-w-100">
                                        <Input focus placeholder="Describe" value={intention} onChange={(e, { value }) => this.setState({ intention: value }) } />
                                    </Block>
                                </Block>
                            </Block>

                            <Block className="addbroad-outer-block condition-outer" >
                                <Block className="addbroad-outer-block-heading">
                                    <h4 className="title-head"> Schedule </h4>
                                </Block>

                                <Block className="addbroad-outer-block-in">
                                    <Block className="add-block-v-fields">
                                        <Form.Field>
                                            <Radio label="Immediately" checked={ scheduleType === 'immediately' } onChange={() =>
                                                    this.handleSchedule( 'immediately' )
                                                }/>
                                        </Form.Field>
                                        <Form.Field>
                                            <Radio label="Timed" checked={ scheduleType === 'timed' } onChange={() =>
                                                    this.handleSchedule('timed')
                                                } />
                                        </Form.Field>
                                        <Form.Field>
                                            <Radio label="Optimization Timing" checked={ scheduleType === 'optimize' } onChange={() =>
                                                    this.handleSchedule('optimize')
                                                }/>
                                        </Form.Field>
                                    </Block>
                                    <Block>
                                        {scheduleType === 'immediately' && (
                                            <span>This will send your broadcast immediately and as quickly as we can</span>
                                        )}
                                        {scheduleType === 'optimize' && (
                                            <span>Open Optimization timing will distribute your message to your subscribers at the time they are most likely to engage. We will send your broadcast in batches based on each individual subscribers most recent activity, increasing the chances that the time they receive the message is the best time for them</span>
                                        )}
                                        {scheduleType === 'timed' && (
                                            <Block>
                                                <ReactDatePicker selected={ timed ? moment(moment.utc(timed).toDate()).local().toDate(): null}
                                                    showTimeSelect
                                                    timeFormat="HH:mm"
                                                    timeIntervals={15}
                                                    dropdownMode={'select'}
                                                    onChange={timed =>
                                                        this.setState({ timed })
                                                    }
                                                    dateFormat="MMMM d, yyyy h:mm aa"
                                                    className="condition-datepicker"
                                                    placeholderText="Select Date And Time"
                                                    // minTime={new Date(2000, 1, 1, 8, 30)}
                                                    // maxMax={new Date(2000, 1, 1, 17, 30)}
                                                />
                                            </Block>
                                        )}
                                    </Block>
                                </Block>
                            </Block>

                            <Block className="addbroad-outer-block condition-outer">
                                <Block className="addbroad-outer-block-heading">
                                    <h4 className="title-head"> Condition </h4>
                                </Block>

                                <Block className="addbroad-outer-block-in">
                                    <Block className="w-100 uiinput-w-100 d-inline-block">
                                        <Block
                                            className="conditions-block"
                                            id="conditions-block"
                                        >
                                            <Block className="condition-operator-reset-container">
                                                <Button className={this.state.matchConditionOperator == 'AND' ? 'active' : ''} onClick={this.resetConditionOperator('AND')}>Match All</Button>
                                                <Button className={this.state.matchConditionOperator == 'OR' ? 'active' : ''} onClick={this.resetConditionOperator('OR')}>Match Any</Button>
                                            </Block>
                                            {this.renderConditions()}
                                            <Block className="conditionBlock">
                                                {!isAddingNewCondition && <Button
                                                    className="btn-add-condition"
                                                    onClick={ (e) => conditions.length == 0 ? this.toggleSelectConditionTypes(e) : this.setState({ isAddingNewCondition: true}) }
                                                    startIcon={<AddCircleOutlineIcon />}
                                                >
                                                    Add Condition
                                                </Button>}
                                                {isAddingNewCondition &&
                                                <Block className="condition-operator-container">
                                                    <Block className="vertical-dash"></Block>
                                                    <Button className="btn-add-condition btn-add-operator" onClick={ this.addConditionLogic('OR') }>OR</Button>
                                                    <Button className="btn-add-condition btn-add-operator" onClick={ this.addConditionLogic('AND') }>AND</Button>
                                                </Block>}
                                                {!activeMenu &&
                                                    this.renderConditionTypes()}
                                            </Block>
                                        </Block>
                                    </Block>
                                </Block>
                            </Block>
                            <Block className="addbroad-outer-block-btn w-100 addbroad-footer">
                                <Block className="eligible-subscribers-block">
                                    Eligible Subscribers: <span>{this.props.eligibleSubscribersCount ? this.props.eligibleSubscribersCount : 0}</span>
                                </Block>
                                <Button
                                    onClick={this.handleSave}
                                    className=""
                                    variant="contained"
                                    color="primary"
                                    loading={this.props.loading ? this.props.loading : false}
                                >
                                    Save & Broadcast
                                </Button>
                            </Block>
                        </Form>
                    </Block>
                </Block>
            </Block>
        );
    }
}

const mapStateToProps = (state, props) => ({
    workflows: state.default.workflows.workflows,
    tags: getTagsState(state).tags,
    workflowTriggers: state.default.campaigns.campaigns,
    workflowUid: state.default.scenes.engageAdd.uid,
    loading: state.default.broadcasts.loading,
    error: state.default.broadcasts.error,
    newBroadcastConditionCustomFields: state.default.broadcasts.newBroadcastConditionCustomFields,
    newBroadcastConditionTags: state.default.broadcasts.newBroadcastConditionTags,
    newBroadcastConditionTriggers: state.default.broadcasts.newBroadcastConditionTriggers,
    pageId: (props && parseInt(props.match.params.id)) || 0,
    subscriberPaging: getSubscribersState(state).paging,
    eligibleSubscribersCount: state.default.broadcasts.eligibleSubscribersCount
    // loading: state.default.workflows.loading,
    // error: state.default.workflows.error,
    // loadingTemplate: state.default.settings.templates.loading,
    // errorTemplate: state.default.settings.templates.error
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            getPageWorkflows,
            getTags,
            getPageCampaigns,
            addBroadcast,
            clearPageSubscribers, 
            getEligibleSubscribers,
            // deletePageWorkflow,
            // updateEngageInfo,
            // deleteEngageInfo
        },
        dispatch
    )
});

export default connect(mapStateToProps, mapDispatchToProps)(AddBroadcast);
