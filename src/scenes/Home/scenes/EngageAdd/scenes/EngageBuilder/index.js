import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { toastr } from "react-redux-toastr";
import CreatableSelect from "react-select/lib/Creatable";
import uuidv1 from "uuid/v1";
import _ from "lodash";

import StepNavigator from "./components/StepNavigator";
import ToolboxItems from "./components/ToolboxItems";
import StepBoard from "./components/StepBoard";

import { isValidUrl } from "services/utils";
import { getCurrentStep, getEngageAddState } from "../../services/selector";
import {
    updateEngageInfo,
    deleteEngageInfo,
    addEngage,
    deleteStepInfo,
    updateEngage,
    updateBroadcast,
    getWidgetTypes,
} from '../../services/actions';

import { updateNewCampaignInfo } from '../../../CampaignsAdd/services/actions';
import { getPageWorkflows } from 'services/workflows/workflowsActions';
import { getCustomFields } from 'services/customfields/actions';
import { getTags } from 'services/tags/actions';
import { getAutomations } from '../../../Settings/scenes/Automations/services/actions';
import { updatePersistentMenu } from '../../../Settings/scenes/PersistentMenu/services/actions';
import { getIntegrationTypes, getIntegrations } from '../../../Settings/scenes/Integrations/services/actions';

import Constants from 'config/Constants';
import './styles.css';
import pencilIcon from 'assets/images/icon-pencil.png';
import editIcon from 'assets/images/icon-edit.png';
import Select from 'react-select';
import { components } from 'react-select/lib';
const { Option } = components;

const messageTypes = Object.keys(Constants.messageType).map(
    i => Constants.messageType[i]
);

const customSingleValue = ({ data }) => (
    <div className="input-select">
        <div className="input-select__single-value">
            {data.image && (
                <span className="input-select__icon">
                    <img src={data.image} />
                </span>
            )}
            <span>{data.label}</span>
        </div>
    </div>
);
const IconOption = props => (
    <Option {...props}>
        {props.data.image && (
            <span className="input-select__icon">
                <img src={props.data.image} />
            </span>
        )}
        {props.data.label}
    </Option>
);
class EngageBuilder extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: this.props.name,
            workflowType: this.props.workflowType,
            keywords:
                this.props.keywords && typeof this.props.keywords === "object"
                    ? this.props.keywords.map(keyword => {
                          const value = uuidv1();
                          return { label: keyword, value };
                      })
                    : [],
            keywordsOption: this.props.keywordsOption,
            isCompletedSave: false,
            orphanSteps: []
        };
    }

    componentDidMount() {
        const engageId = this.props.match.params.engageId;
        if (
            engageId !== "add" &&
            (!this.props.workflowType || !this.props.name)
        ) {
            this.props.actions.getPageWorkflows(this.props.match.params.id);
        }

        this.props.actions.getCustomFields(this.props.match.params.id);
        this.props.actions.getTags(this.props.match.params.id);
        this.props.actions.getAutomations(this.props.match.params.id);
        this.props.actions.getWidgetTypes(this.props.match.params.id);
        this.props.actions.getIntegrationTypes(this.props.match.params.id);
        this.props.actions.getIntegrations(this.props.match.params.id);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (
            nextProps.loadingTags ||
            nextProps.loadingAutomations ||
            (nextProps.loadingWorkflows && !this.props.workflowType)
        ) {
            Swal({
                title: "Please wait...",
                text: "Loading...",
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });

            return <div />;
        } else if (
            this.props.loadingTags ||
            this.props.loadingAutomations ||
            (this.props.loadingWorkflows && !this.props.workflowType)
        ) {
            Swal.close();

            if (nextProps.errorTags) {
                toastr.error(nextProps.errorTags);
            }
            if (nextProps.errorAutomations) {
                toastr.error(nextProps.errorAutomations);
            }
            if (nextProps.errorWorkflows) {
                toastr.error(nextProps.errorWorkflows);
            } else if (
                this.props.match.params.engageId !== "add" &&
                (!this.props.workflowType || !this.props.name)
            ) {
                const workflow = nextProps.workflows.find(
                    workflow =>
                        workflow.uid ===
                        parseInt(this.props.match.params.engageId, 10)
                );

                if (!workflow) {
                    toastr.error("The workflow doesn't exist in the page.");

                    this.props.history.push({
                        pathname: `/page/${this.props.match.params.id}/engages/`
                    });
                } else {
                    this.props.actions.updateEngageInfo({
                        name: workflow.name,
                        workflowType: workflow.workflowType,
                        activeStep: workflow.steps[0].stepUid,
                        steps: workflow.steps,
                        uid: workflow.uid,
                        keywords: workflow.keywords || "",
                        keywordsOption: workflow.keywordsOption || ""
                    });
                }
            }
        }

        if (
            nextProps.name &&
            this.props.currentStep !== nextProps.currentStep &&
            this.stepNameRef
        ) {
            this.stepNameRef.value = nextProps.currentStep.name;
        }

        if (nextProps.loading) {
            Swal({
                title: "Please wait...",
                text: "We are saving the message...",
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (this.props.loading) {
            Swal.close();

            if (!this.props.error && !!nextProps.error) {
                Swal({
                    title: "Message Saving Error",
                    text: nextProps.error,
                    type: "error",
                    showCancelButton: true,
                    cancelButtonText: "Close"
                });
            }

            if (this.state.isCompletedSave) {
                if (!!nextProps.error) {
                    this.setState({ isCompletedSave: false });
                } else {
                    this.props.actions.getPageWorkflows(
                        this.props.match.params.id
                    );
                    this._engageComplete(nextProps.uid);
                }
            }
        }

        if (this.props.workflowType !== nextProps.workflowType) {
            this.setState({
                name: nextProps.name,
                workflowType: nextProps.workflowType,
                keywords:
                    nextProps.keywords && typeof nextProps.keywords === "object"
                        ? nextProps.keywords.map(keyword => {
                              const value = uuidv1();
                              return { label: keyword, value };
                          })
                        : [],
                keywordsOption: nextProps.keywordsOption,
                isCompletedSave: false,
                orphanSteps: []
            });
        }
    }

    componentDidMount() {
        this.setState({ orphanSteps: this._filterOrphanSteps() });
    }

    componentDidUpdate(prevProps) {
        if (this.props.steps !== prevProps.steps) {
            this.setState({ orphanSteps: this._filterOrphanSteps() });
        }
    }

    _checkRequiredFields = () => {
        let isValid = true;

        this.props.steps.forEach((step, index) => {
            if (step.items.length === 0) {
                toastr.warning(
                    `You must add at least one item to ${step.name ||
                        "Step " + (index + 1)}.`
                );
                isValid = false;
            }
            step.items.forEach(item => {
                switch (item.type) {
                    case "card":
                        if (
                            !item.mediaUid ||
                            !item.headline ||
                            !item.description
                        ) {
                            toastr.warning(
                                `You must fill in all the required fields of Card in ${step.name ||
                                    "Step " + (index + 1)}.`
                            );
                            isValid = false;
                        }
                        if (item.imageLink && !isValidUrl(item.imageLink)) {
                            toastr.warning(
                                `You must input valid URL of Card in ${step.name ||
                                    "Step " + (index + 1)}.`
                            );
                            isValid = false;
                        }
                        break;
                    case "carousel":
                        item.items.forEach(carouselItem => {
                            if (
                                !carouselItem.mediaUid ||
                                !carouselItem.headline ||
                                !carouselItem.description
                            ) {
                                toastr.warning(
                                    `You must fill in all the required fields of Carousel in ${step.name ||
                                        "Step " + (index + 1)}.`
                                );
                                isValid = false;
                            }
                            if (item.imageLink && !isValidUrl(item.imageLink)) {
                                toastr.warning(
                                    `You must input valid URL of Carousel in ${step.name ||
                                        "Step " + (index + 1)}.`
                                );
                                isValid = false;
                            }
                        });
                        break;
                    case "video":
                    case "image":
                    case "audio":
                        if (!item.mediaUid) {
                            toastr.warning(
                                `You must upload a ${
                                    item.type
                                } in ${step.name || "Step " + (index + 1)}.`
                            );
                            isValid = false;
                        }
                        break;
                    case "text":
                        if (!item.textMessage) {
                            toastr.warning(
                                `You must type any message on Text in ${step.name ||
                                    "Step " + (index + 1)}.`
                            );
                            isValid = false;
                        }
                        break;
                    case "free_text_input":
                        if (!item.textMessage) {
                            toastr.warning(
                                `You must type any message on User Input in ${step.name ||
                                    "Step " + (index + 1)}.`
                            );
                            isValid = false;
                        }
                        if (!item.customFieldUid) {
                            toastr.warning(
                                `You must select a 'Save Response to Field' in ${step.name ||
                                    "Step " + (index + 1)}.`
                            );
                            isValid = false;
                        }
                        break;
                }

                if (item.actionBtns && item.actionBtns.length > 0) {
                    item.actionBtns.forEach(actionBtn => {
                        if (
                            !actionBtn.label ||
                            !actionBtn.actionType ||
                            (actionBtn.actionType === "postback" &&
                                !actionBtn.nextStepUid) ||
                            (actionBtn.actionType === "web_url" &&
                                !actionBtn.openUrl) ||
                            (actionBtn.actionType === "phone_number" &&
                                !actionBtn.phone)
                        ) {
                            toastr.warning(
                                `You must fill in all the required fields of action buttons of ${
                                    item.type
                                } component in ${step.name ||
                                    "Step " + (index + 1)}.`
                            );
                            isValid = false;
                        }
                    });
                }
            });
        });

        return isValid;
    };

    _filterOrphanSteps = () => {
        let orphanStepUids = [];
        let candiStepUids = this.props.steps.slice(1).map(step => step.stepUid);

        while (candiStepUids.length > 0) {
            const steps = this.props.steps.filter(
                step => !orphanStepUids.includes(step.stepUid)
            );
            candiStepUids = this.props.steps
                .slice(1)
                .map(step => step.stepUid)
                .filter(stepUid => !orphanStepUids.includes(stepUid));

            steps.forEach(step => {
                // Quick Replyes
                if (step.quickReplies) {
                    step.quickReplies.forEach(quickReply => {
                        _.remove(
                            candiStepUids,
                            stepUid => stepUid === quickReply.nextStepUid
                        );
                    });
                }

                step.items.forEach(item => {
                    // actions buttons
                    if (item.actionBtns && item.actionBtns.length > 0) {
                        item.actionBtns.forEach(actionBtn => {
                            _.remove(
                                candiStepUids,
                                stepUid => stepUid === actionBtn.nextStepUid
                            );
                        });
                    }
                    if (item.type == "free_text_input") {
                        if (item.nextStepUid) {
                            _.remove(
                                candiStepUids,
                                stepUid => stepUid == item.nextStepUid
                            );
                        }
                    }
                    if (item.type === "carousel") {
                        item.items.forEach(carouselItem => {
                            if (carouselItem.actionBtns) {
                                carouselItem.actionBtns.forEach(actionBtn => {
                                    _.remove(
                                        candiStepUids,
                                        stepUid =>
                                            stepUid === actionBtn.nextStepUid
                                    );
                                });
                            }
                        });
                    }
                });
            });
            orphanStepUids = orphanStepUids.concat(candiStepUids);
        }

        return orphanStepUids;
    };

    _isValidWorkflow = () => {
        if (!this.state.name) {
            toastr.error(
                'You must supply a "Flow Name" to this engagement before you can save it.'
            );
            return false;
        }
        if (this.props.steps.length === 0) {
            toastr.error(
                "You must add at least one item to the flow from the toolbox on the left before you can save it."
            );
            return false;
        }
        if (
            this.state.workflowType === "keywordmsg" &&
            !(this.state.keywords.length > 0 && !!this.state.keywordsOption)
        ) {
            toastr.error("You must type at least a keyword.");
            return false;
        }
        if (!this._checkRequiredFields()) {
            return false;
        }
        return true;
    };

    _changeStepName = event => {
        const steps = this.props.steps.map((step, index) => {
            if (step.stepUid !== this.props.activeStep) return step;
            return {
                ...step,
                name: event.target.value
            };
        });

        this.props.actions.updateEngageInfo({ steps });
    };

    _deleteEngageInfo = () => {
        Swal({
            title: "Are you sure?",
            text: "Please verify that you want to discard this message.",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete this message",
            cancelButtonText: "No, I want to keep it",
            confirmButtonColor: "#f02727"
        }).then(result => {
            if (result.value) {
                this.props.actions.deleteEngageInfo();
            }
        });
    };

    _engageSave = isCompletedSave => {
        if (this._isValidWorkflow()) {
            const steps = this.props.steps.filter(
                step => !this.state.orphanSteps.includes(step.stepUid)
            );
            let params = {
                name: this.state.name,
                workflowType: this.state.workflowType,
                steps: steps.map(step => {
                    return {
                        ...step,
                        items: step.items.map((item, index) => {
                            return {
                                ...item,
                                order: index
                            };
                        })
                    };
                })
            };

            if (
                !!this.state.keywords &&
                !!this.state.keywordsOption &&
                this.state.workflowType === "keywordmsg"
            ) {
                params = {
                    ...params,
                    keywords: this.state.keywords.map(keyword => keyword.label),
                    keywordsOption: this.state.keywordsOption
                };
            }

            if (!!this.props.uid) {
                this.props.actions.updateEngage(this.props.match.params.id, {
                    ...params,
                    uid: this.props.uid
                });
            } else {
                this.props.actions.addEngage(this.props.match.params.id, {
                    ...params
                });
            }

            this.setState({ isCompletedSave: isCompletedSave });
        }
    };

    _engageComplete = workflowUid => {
        if (this.props.workflowType === "broadcast") {
            this.props.history.push({
                pathname: `/page/${this.props.match.params.id}/engages/${workflowUid}/broadcast-select`
            });
        } else if (this.props.location.state) {
            const stateParams = this.props.location.state;
            const isCampaign = stateParams.redirectTo.includes("campaigns");

            if (!this.props.uid) {
                if (isCampaign) {
                    this.props.actions.updateNewCampaignInfo(
                        this.props.match.params.id,
                        { workflowUid },
                        false
                    );
                } else {
                    if (stateParams.currentMenu.type === "submenu") {
                        const menus = stateParams.currentMenu.value.map(
                            (menu, index) => {
                                if (index !== stateParams.activeOptionIndex) {
                                    return menu;
                                } else {
                                    return {
                                        ...menu,
                                        value: workflowUid,
                                        type: "message"
                                    };
                                }
                            }
                        );
                        this.props.actions.updatePersistentMenu({
                            value: menus
                        });
                    } else {
                        this.props.actions.updatePersistentMenu({
                            value: workflowUid
                        });
                    }
                }
            }

            Swal({
                title: "Success",
                text:
                    `Your engagement was successfully saved! Would you like to go back to the ${
                        isCampaign ? "campaign" : "persistent menu"
                    }` + " that you were creating and finish it up as well?",
                type: "success",
                showCancelButton: true,
                confirmButtonText: "Yes, please.",
                cancelButtonText: "No, not yet!",
                confirmButtonColor: "#3085d6"
            }).then(result => {
                if (result.value) {
                    this.props.actions.deleteEngageInfo();
                    this.props.history.push(stateParams.redirectTo);
                }
            });
        } else {
            this.props.history.push(
                `/page/${this.props.match.params.id}/engages`
            );
        }
    };

    render() {
        const { workflowType } = this.state;
        if (!this.state.workflowType) {
            if (this.props.match.params.engageId === "add") {
                this.props.history.push({
                    pathname: `/page/${this.props.match.params.id}/engages`
                });
            }

            return <div />;
        }

        const renderKeywordOptionsComponent = () => {
            if (this.state.workflowType === "keywordmsg") {
                return (
                    <div className="d-flex flex-column flex-shrink-0 keywords-options-container">
                        <div className="d-flex options-container">
                            {Constants.keywordsOptions.map(
                                (keywordsOption, index) => (
                                    <label
                                        className="form-check-label"
                                        key={index}
                                    >
                                        <input
                                            className="form-check-input"
                                            onChange={event =>
                                                this.setState({
                                                    keywordsOption:
                                                        event.target.value
                                                })
                                            }
                                            type="radio"
                                            value={keywordsOption.key}
                                            checked={
                                                this.state.keywordsOption ===
                                                keywordsOption.key
                                            }
                                        />
                                        <span className="pl-2">
                                            {keywordsOption.label}
                                        </span>
                                    </label>
                                )
                            )}
                        </div>
                        <CreatableSelect
                            isMulti
                            onChange={keywords => {
                                this.setState({ keywords });
                            }}
                            components={{
                                DropdownIndicator: () => null,
                                IndicatorSeparator: () => null
                            }}
                            isClearable={false}
                            placeholder="Keywords"
                            onCreateOption={keyword => {
                                const value = uuidv1();
                                this.setState({
                                    keywords: this.state.keywords.concat([
                                        { label: keyword, value }
                                    ])
                                });
                            }}
                            value={this.state.keywords}
                        />
                    </div>
                );
            }
        };

        return (
            <div className="position-relative">
                <div
                    className="card d-flex align-items-stretch flex-row w-100 engage-builder-container"
                    data-aos="fade"
                >
                    <div className="d-flex flex-column col-sm-5 py-2 px-3 builder-left-container">
                        <div className="position-relative flow-name-container">
                            <input
                                type="text"
                                className="form-control bg-white mb-2 flow-name-input pr-5"
                                placeholder="Flow Name"
                                onChange={event =>
                                    this.setState({ name: event.target.value })
                                }
                                value={this.state.name}
                            />
                            <img
                                src={pencilIcon}
                                alt=""
                                className="position-absolute"
                            />
                        </div>
                        <div className="d-flex flex-column flex-shrink-0 engage-info-container">
                            <div className="d-flex justify-content-between p-3">
                                <div
                                    className="form-group d-flex flex-row"
                                    style={{ flex: 1 }}
                                >
                                    <div>
                                        <span className="text-dark d-inline">
                                            Message Type:
                                        </span>
                                    </div>
                                    <div className="mr-3" style={{ flex: 1 }}>
                                        <Select
                                            components={{
                                                Option: IconOption,
                                                SingleValue: customSingleValue
                                            }}
                                            onChange={w => {
                                                this.setState({
                                                    workflowType: w.value
                                                });
                                            }}
                                            options={messageTypes}
                                            getOptionLabel={option =>
                                                option.label
                                            }
                                            getOptionValue={option =>
                                                option.value
                                            }
                                            style={{ width: "300px" }}
                                            value={
                                                Constants.messageType[
                                                    workflowType
                                                ]
                                            }
                                        />
                                    </div>
                                </div>
                                <div>
                                    <button
                                        className="btn btn-link p-0 text-danger"
                                        onClick={this._deleteEngageInfo}
                                    >
                                        Start Over
                                    </button>
                                </div>
                            </div>
                            {renderKeywordOptionsComponent()}
                        </div>
                        <StepNavigator orphanSteps={this.state.orphanSteps} />
                    </div>
                    <div
                        className="d-flex flex-column w-100 builder-right-container"
                        data-aos="fade"
                        data-aos-delay="200"
                    >
                        <div
                            className="align-items-center input-group step-name"
                            style={{
                                display: !this.props.activeStep
                                    ? "none"
                                    : "flex"
                            }}
                        >
                            <input
                                type="text"
                                ref={ref => (this.stepNameRef = ref)}
                                className="form-control pr-2"
                                placeholder="Step name"
                                onChange={this._changeStepName}
                                defaultValue={
                                    this.props.currentStep
                                        ? this.props.currentStep.name
                                        : ""
                                }
                            />
                            <div className="input-group-append">
                                <img
                                    src={pencilIcon}
                                    alt=""
                                    className="input-group-text p-0"
                                />
                            </div>
                        </div>
                        <StepBoard
                            pageId={this.props.match.params.id}
                            isRestrictedForJSON={workflowType == "json"}
                        />
                        <ToolboxItems pageId={this.props.match.params.id} />
                    </div>
                </div>
                <div className="position-absolute action-buttons-container">
                    <button
                        className="btn btn-preview"
                        onClick={() => this._engageSave(false)}
                    >
                        <img
                            src={editIcon}
                            alt=""
                            width="15"
                            className="mr-3"
                        />
                        Save
                    </button>
                    <button
                        className="btn btn-save"
                        onClick={() => this._engageSave(true)}
                    >
                        {this.state.workflowType === "broadcast"
                            ? "Save & Broadcast"
                            : "Save & Complete"}
                    </button>
                </div>
            </div>
        );
    }
}

EngageBuilder.propTypes = {
    name: PropTypes.string.isRequired,
    workflowType: PropTypes.string.isRequired,
    steps: PropTypes.array.isRequired,
    activeStep: PropTypes.any.isRequired,
    currentStep: PropTypes.object,
    broadcast: PropTypes.any,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.any,
    uid: PropTypes.number,
    keywords: PropTypes.any,
    keywordsOption: PropTypes.any,
    actions: PropTypes.object.isRequired,
    workflows: PropTypes.array,
    loadingWorkflows: PropTypes.bool.isRequired,
    errorWorkflows: PropTypes.any,
    loadingTags: PropTypes.bool.isRequired,
    errorTags: PropTypes.any,
    loadingAutomations: PropTypes.bool.isRequired,
    errorAutomations: PropTypes.any
};

const mapStateToProps = state => ({
    ...getEngageAddState(state),
    currentStep: getCurrentStep(state),
    workflows: state.default.workflows.workflows,
    loadingWorkflows: state.default.workflows.loading,
    errorWorkflows: state.default.workflows.error,
    loadingTags: state.default.settings.tags.loading,
    errorTags: state.default.settings.tags.error,
    loadingAutomations: state.default.settings.automations.loading,
    errorAutomations: state.default.settings.automations.error
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            updateEngageInfo,
            deleteEngageInfo,
            addEngage,
            updateEngage,
            updateNewCampaignInfo,
            deleteStepInfo,
            getCustomFields,
            getPageWorkflows,
            getTags,
            getAutomations,
            updatePersistentMenu,
            updateBroadcast,
            getWidgetTypes,
            getIntegrationTypes,
            getIntegrations
        },
        dispatch
    )
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(EngageBuilder)
);
