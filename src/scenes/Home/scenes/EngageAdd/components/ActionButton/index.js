import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toastr } from 'react-redux-toastr';
import { orderBy } from 'lodash';
import PropTypes from 'prop-types';
import { Picker } from 'emoji-mart';
import uuid from 'uuid/v4';
import Swal from 'sweetalert2';
import CreatableSelect from 'react-select/lib/Creatable';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';

import { getTagsState } from 'services/tags/selector';
import { isValidUrl } from 'services/utils';
import { getActiveWorkflows } from 'services/workflows/selector';
import { getAutomationsState } from '../../../Settings/scenes/Automations/services/selector';
import { addStepInfo, updateEngageInfo } from '../../services/actions';
import { getEngageAddState } from '../../services/selector';
import { addTag } from 'services/tags/actions';
import { getPageFromUrl } from 'services/pages/selector';

import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'components';

import './styles.css';
import Constants from '../../../../../../config/Constants';

const eligibleStepTypes = Object.keys(Constants.builderTypes).map(
    key => Constants.builderTypes[key].type
);
class ActionButton extends React.Component {
    constructor(props) {
        super(props);

        this.currentEmojiInputPos = -1;

        this.state = {
            actionType: this.getInitialActionType(),
            tags: this.props.item.tags || [],
            automationUid: this.props.item.automationUid || null,
            labelText: this.props.item.label || '',
            nextStepUid: this.props.item.nextStepUid || null,
            nextWorkflowStepUId:
                (this.props.item.actionType === 'postback' &&
                    this.props.item.nextStepUid) ||
                null,
            showEmojiBox: false,
            phone: this.props.item.phone || ''
        };
    }

    getInitialActionType = () => {
        const { engage, item } = this.props;

        if (!item.actionType) {
            return 'web_url';
        }
        if (item.actionType === 'postback') {
            return engage.steps.findIndex(
                step => step.stepUid === item.nextStepUid
            ) > -1
                ? 'postback_existing'
                : 'postback_existing_workflow';
        }
        return this.props.item.actionType;
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.addingTag) {
            Swal({
                title: 'Please wait...',
                text: 'We are adding a new tag to the page...',
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (this.props.addingTag) {
            Swal.close();
            if (nextProps.addingTagError) {
                Swal(nextProps.addingTagError);
            }
        }
    }

    _changeActionType = event => {
        let stateToUpdate = {
            actionType: event.target.value
        };

        if (!event.target.value.startsWith('postback')) {
            stateToUpdate = { ...stateToUpdate, automationUid: null };
        } else if (event.target.value === 'share') {
            stateToUpdate = {
                ...stateToUpdate,
                labelText: 'Share'
            };
        }
        this.setState(stateToUpdate);
    };

    _saveChanges = isStepEdit => {
        if (!this.state.labelText) {
            toastr.error('Error', 'Please enter button text');
            return;
        }

        if (this.state.actionType === 'phone_number') {
            if (!isValidPhoneNumber(this.state.phone)) {
                toastr.error('Error', 'please input valid phone number');
                return;
            }
        }
        if (
            this.state.actionType === 'postback_existing' &&
            !this.state.nextStepUid
        ) {
            toastr.error('Error', 'Please select one of the existing steps');
            return;
        }
        if (
            this.state.actionType === 'postback_existing_workflow' &&
            !this.state.nextWorkflowStepUId
        ) {
            toastr.error(
                'Error',
                'Please select one of the exitsting workflows'
            );
            return;
        }

        if (
            this.state.actionType === 'web_url' &&
            !isValidUrl(this.openUrlRef.value) &&
            !(
                this.openUrlRef.value.toLowerCase().startsWith('{') &&
                this.openUrlRef.value.toLowerCase().endsWith('}')
            )
        ) {
            toastr.error('Error', 'Please input a valid URL or Merge tag.');
            return;
        }
        // update tags value
        const tags = this.state.tags.map(tag => {
            const pageTag = this.props.pageTags.find(
                pageTag => pageTag.value === tag.value
            );

            if (!pageTag) {
                Swal(`The tag ${tag.value} was not added to this page.`);
                return tag;
            } else {
                return pageTag;
            }
        });

        this.setState({ tags });

        if (
            this.state.actionType === 'web_url' ||
            this.state.actionType === 'phone_number' ||
            this.state.actionType === 'share'
        ) {
            let actionBtn = {
                label: this.state.labelText,
                tags,
                automationUid: this.state.automationUid,
                actionType: this.state.actionType
            };

            if (this.state.actionType === 'web_url') {
                actionBtn = {
                    ...actionBtn,
                    openUrl: this.openUrlRef ? this.openUrlRef.value : ''
                };
            } else if (this.state.actionType === 'phone_number') {
                actionBtn = {
                    ...actionBtn,
                    phone: this.state.phone
                };
            }

            this.props.onSave(actionBtn);
        } else if (this.state.actionType === 'postback_existing_workflow') {
            this.props.onSave({
                label: this.state.labelText,
                tags,
                automationUid: this.state.automationUid,
                nextStepUid: this.state.nextWorkflowStepUId,
                actionType: 'postback'
            });
        } else {
            const newStepUid = uuid();
            if (this.state.actionType === 'sms' && (this.props.page && !this.props.page.smsAccount)) { } else {
                this.props.onSave({
                    label: this.state.labelText,
                    tags,
                    automationUid: this.state.automationUid,
                    nextStepUid:
                        this.state.actionType === 'postback_existing_workflow'
                            ? this.state.nextWorkflowStepUId
                            : this.state.actionType === 'postback_existing'
                                ? this.state.nextStepUid
                                : newStepUid,
                    actionType: 'postback'
                });
            }

            setTimeout(() => {
                let defaultStepTitle = undefined;
                Object.keys(Constants.builderTypes).map(key => {
                    if (
                        Constants.builderTypes[key].type ===
                        this.state.actionType
                    ) {
                        defaultStepTitle = Constants.builderTypes[key].label;
                    }
                });

                if (this.state.actionType === 'sms' && (this.props.page && !this.props.page.smsAccount)) {
                    toastr.error(
                        'Error',
                        `Please select an SMS billing plan to use this feature from settings.`
                    );
                    return false;
                } else {
                    if (eligibleStepTypes.includes(this.state.actionType)) {
                        console.log('this.state.actionType', this.state.actionType, this.props.page);
                        this.props.actions.addStepInfo(
                            newStepUid,
                            this.state.actionType,
                            defaultStepTitle
                        );
                    }
                    if (isStepEdit) {
                        this.props.actions.updateEngageInfo({
                            activeStep:
                                this.state.actionType === 'postback_existing'
                                    ? this.state.nextStepUid
                                    : newStepUid
                        });
                    }
                }
            }, 500);
        }
    };

    _addEmoji = event => {
        if (event.unified.length <= 5) {
            let emojiPic = String.fromCodePoint(`0x${event.unified}`);

            this.setState({
                labelText: [
                    this.state.labelText.slice(0, this.currentEmojiInputPos),
                    emojiPic,
                    this.state.labelText.slice(this.currentEmojiInputPos)
                ].join(''),
                showEmojiBox: false
            });
        } else {
            let sym = event.unified.split('-');
            let codesArray = [];
            sym.forEach(el => codesArray.push('0x' + el));

            let emojiPic = String.fromCodePoint(...codesArray);
            this.setState({
                labelText: [
                    this.state.labelText.slice(0, this.currentEmojiInputPos),
                    emojiPic,
                    this.state.labelText.slice(this.currentEmojiInputPos)
                ].join(''),
                showEmojiBox: false
            });
        }

        if (this.labelRef) {
            this.labelRef.focus();
        }
    };

    render() {
        const selectedAutomation = !!this.state.automationUid
            ? this.props.automations.find(
                automation => automation.uid === this.state.automationUid
            )
            : {};
        const selectedStepIndex = this.props.engage.steps.findIndex(
            step => step.stepUid === this.state.nextStepUid
        );
        const { actionType } = this.state;
        const { page } = this.props;

        let buttonActionTypes = [];
        
        if(page.source) {
            buttonActionTypes = Constants.builderActionTypesPages[page.source];
        }
        
        return (
            <div className="d-flex flex-column action-button-container p-4">
                <div className="d-flex justify-content-between action-header">
                    <span>Button Text</span>
                    <div
                        className="btn btn-link text-danger p-0"
                        onClick={() => this.props.onDeleteItem()}
                    >
                        <i className="fa fa-trash-o mr-3" />
                        Delete Item
                    </div>
                </div>
                <div className="position-relative d-flex align-items-center action-label-container">
                    <input
                        ref={ref => (this.labelRef = ref)}
                        type="text"
                        value={this.state.labelText}
                        onClick={event => {
                            this.currentEmojiInputPos =
                                event.target.selectionStart;
                        }}
                        onKeyUp={event => {
                            this.currentEmojiInputPos =
                                event.target.selectionStart;
                        }}
                        onChange={event => {
                            if (event.target.value.length <= 20) {
                                this.setState({
                                    labelText: event.target.value
                                });
                            }
                            this.currentEmojiInputPos =
                                event.target.selectionStart;
                        }}
                        disabled={this.state.actionType === 'share'}
                    />
                    <div className="d-flex align-items-center position-absolute">
                        <button
                            className="btn btn-link p-0"
                            onClick={() =>
                                this.state.actionType !== 'share' &&
                                this.setState({
                                    showEmojiBox: !this.state.showEmojiBox
                                })
                            }
                        >
                            <i className="fa fa-smile-o" />
                        </button>
                        <span
                            style={{
                                color:
                                    this.state.labelText.length === 20
                                        ? 'red'
                                        : 'inherit'
                            }}
                        >
                            {this.state.labelText.length}
                            /20
                        </span>
                    </div>
                </div>
                <div className="d-flex flex-column action-type-container">
                    <label className="mt-2">Button Action</label>
                    <div className="form-group row">
                        {buttonActionTypes.map((key, idx) => (
                            <label className="mt-2 col-6" key={idx}>
                                <input
                                    onChange={this._changeActionType}
                                    type="radio"
                                    value={Constants.builderActionTypes[key].type}
                                    checked={
                                        this.state.actionType ===
                                        Constants.builderActionTypes[key].type
                                    }
                                    disabled={key == "postback_existing" && this.props.engage.steps.length < 2}
                                />
                                <span className="pl-2">
                                    {Constants.builderActionTypes[key].label}
                                </span>
                            </label>
                        ))}
                    </div>
                    {this.state.actionType === 'web_url' && (
                        <div className="d-flex flex-column mb-3">
                            <label>URL</label>
                            <input
                                type="text"
                                ref={ref => (this.openUrlRef = ref)}
                                defaultValue={this.props.item.openUrl}
                            />
                        </div>
                    )}
                    {this.state.actionType === 'phone_number' && (
                        <div className="d-flex flex-column mb-3">
                            <label>Phone Number</label>
                            <PhoneInput
                                placeholder="Enter phone number"
                                value={this.state.phone}
                                onChange={phone => this.setState({ phone })}
                            />
                        </div>
                    )}
                    {this.state.actionType === 'postback_existing' && (
                        <div className="d-flex flex-column form-group mb-3">
                            <label>Select From Existing:</label>
                            <UncontrolledDropdown>
                                <DropdownToggle
                                    className="py-0 m-0 w-100 dropdown-toggle"
                                    caret
                                >
                                    <span>
                                        {this.state.nextStepUid
                                            ? this.props.engage.steps[
                                                selectedStepIndex
                                            ].name ||
                                            `Step ${selectedStepIndex + 1}`
                                            : 'Select...'}
                                    </span>
                                </DropdownToggle>

                                <DropdownMenu className="dropdown-menu" right>
                                    {this.props.engage.steps.map(
                                        (step, index) => {
                                            if (
                                                step.stepUid !==
                                                this.props.engage.activeStep
                                            ) {
                                                return (
                                                    <DropdownItem key={index}>
                                                        <div
                                                            onClick={() =>
                                                                this.setState({
                                                                    nextStepUid:
                                                                        step.stepUid
                                                                })
                                                            }
                                                        >
                                                            {step.name ||
                                                                `Step ${index +
                                                                1}`}
                                                        </div>
                                                    </DropdownItem>
                                                );
                                            }
                                        }
                                    )}
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </div>
                    )}
                    {this.state.actionType === 'postback_existing_workflow' && (
                        <div className="d-flex flex-column form-group mb-3">
                            <label>Select From Existing Workflow:</label>
                            <UncontrolledDropdown>
                                <DropdownToggle
                                    className="py-0 m-0 w-100 dropdown-toggle"
                                    caret
                                >
                                    <span>
                                        {this.state.nextWorkflowStepUId
                                            ? this.props.workflows.find(
                                                x =>
                                                    x.rootWorkflowStepUid ==
                                                    this.state
                                                        .nextWorkflowStepUId
                                            ).name
                                            : 'Select...'}
                                    </span>
                                </DropdownToggle>

                                <DropdownMenu className="dropdown-menu" right>
                                    {orderBy(
                                        this.props.workflows,
                                        //.filter(
                                        //    x => x.uid !== this.props.engage.uid
                                        //),
                                        'name',
                                        'asc'
                                    ).map((workflow, index) => (
                                        <DropdownItem key={index}>
                                            <div
                                                onClick={() =>
                                                    this.setState({
                                                        nextWorkflowStepUId: workflow.rootWorkflowStepUid
                                                    })
                                                }
                                            >
                                                {workflow.name}
                                            </div>
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </div>
                    )}
                </div>
                <div className="form-group tags-container">
                    <div className="d-flex justify-content-between align-items-center py-1">
                        <label>Tag User</label>
                        <span>Optional</span>
                    </div>
                    <CreatableSelect
                        isMulti
                        onChange={tags => this.setState({ tags })}
                        options={this.props.pageTags}
                        isClearable={false}
                        getOptionLabel={option =>
                            'uid' in option ? option.value : option.label
                        }
                        getOptionValue={option =>
                            (option.uid && option.uid.toString()) ||
                            option.value
                        }
                        onCreateOption={value => {
                            this.setState({
                                tags: this.state.tags.concat([
                                    { uid: value, value }
                                ])
                            });
                            this.props.actions.addTag(
                                this.props.match.params.id,
                                value
                            );
                        }}
                        value={this.state.tags}
                        isValidNewOption={label => {
                            if (!label) return false;

                            let returnValue = true;

                            this.props.pageTags.forEach(option => {
                                if (
                                    label.toLowerCase() ===
                                    option.value.toLowerCase()
                                )
                                    returnValue = false;
                            });

                            return returnValue;
                        }}
                    />
                </div>
                {actionType.startsWith('postback') && (
                    <div className="form-group">
                        <div className="d-flex justify-content-between align-items-center py-1">
                            <label>Trigger Automation</label>
                            <span>Optional</span>
                        </div>
                        <UncontrolledDropdown className="w-100">
                            <DropdownToggle
                                className="py-0 m-0 w-100 dropdown-toggle"
                                caret
                            >
                                <span>{selectedAutomation.name || ''}</span>
                            </DropdownToggle>

                            <DropdownMenu className="dropdown-menu" right>
                                {this.props.automations.map(
                                    (automation, index) => (
                                        <DropdownItem key={index}>
                                            <div
                                                onClick={() =>
                                                    this.setState({
                                                        automationUid:
                                                            automation.uid
                                                    })
                                                }
                                            >
                                                {automation.name}
                                            </div>
                                        </DropdownItem>
                                    )
                                )}
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </div>
                )}
                {this.state.actionType === 'postback_new' && (
                    <div className="d-flex flex-column">
                        <button
                            className="btn btn-light btn-edit-message mt-3 font-weight-normal"
                            onClick={() => this._saveChanges(true)}
                        >
                            Edit New Message
                        </button>
                    </div>
                )}
                <div
                    onClick={() => this._saveChanges(false)}
                    className="btn btn-primary btn-save text-white d-flex justify-content-center align-items-center mt-2"
                >
                    Save Changes
                </div>
                <Picker
                    style={{
                        display: this.state.showEmojiBox
                            ? 'inline-block'
                            : 'none',
                        position: 'absolute',
                        top: 98,
                        right: 0
                    }}
                    onSelect={this._addEmoji}
                    showSkinTones={false}
                    showPreview={false}
                />
            </div>
        );
    }
}

ActionButton.propTypes = {
    onSave: PropTypes.func.isRequired,
    onDeleteItem: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    pageTags: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.any,
            label: PropTypes.any
        })
    ).isRequired,
    automations: PropTypes.arrayOf(
        PropTypes.shape({
            uid: PropTypes.any.isRequired,
            pageUid: PropTypes.number.isRequired,
            active: PropTypes.bool,
            withinDay: PropTypes.number,
            total: PropTypes.number,
            name: PropTypes.string,
            tags: PropTypes.array,
            userUnsubscribe: PropTypes.bool,
            triggerIntegrations: PropTypes.array,
            notifyAdmins: PropTypes.array
        })
    ),
    actions: PropTypes.object.isRequired,
    engage: PropTypes.object.isRequired,
    showShareOption: PropTypes.bool,
    addingTag: PropTypes.bool.isRequired,
    addingTagError: PropTypes.any,
    steps: PropTypes.array.isRequired
};

ActionButton.defaultProps = {
    showShareOption: false
};

const mapStateToProps = (state, props) => ({
    pageTags: getTagsState(state).tags,
    addingTag: getTagsState(state).loading,
    addingTagError: getTagsState(state).error,
    automations: getAutomationsState(state).automations,
    engage: getEngageAddState(state),
    steps: getEngageAddState(state).steps,
    workflows: getActiveWorkflows(state, props),
    page: getPageFromUrl(state, props)
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            addStepInfo,
            updateEngageInfo,
            addTag
        },
        dispatch
    )
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(ActionButton)
);
