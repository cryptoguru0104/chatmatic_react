import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { toastr } from "react-redux-toastr";
// import CreatableSelect from 'react-select/lib/Creatable';
import uuidv1 from "uuid/v1";
import _ from "lodash";
// import Select from 'react-select';
import { transformStepsToLocal } from "services/workflows/transformers";
// import { Button, Icon } from 'semantic-ui-react';

// import StepNavigator from '../scenes/EngageAdd/scenes/EngageBuilder/components/StepNavigator';
// import ToolboxItems from '../scenes/EngageAdd/scenes/EngageBuilder/components/ToolboxItems';
// import StepBoard from '../scenes/EngageAdd/scenes/EngageBuilder/components/StepBoard';

import {
    getCurrentStep,
    getEngageAddState
} from "../scenes/EngageAdd/services/selector";
import {
    updateEngageInfo,
    deleteEngageInfo,
    addEngage,
    deleteStepInfo,
    updateEngage,
    updateBroadcast
} from "../scenes/EngageAdd/services/actions";
import { updateNewCampaignInfo } from "../scenes/CampaignsAdd/services/actions";
import {
    getPageWorkflows,
    getPageWorkflow
} from "services/workflows/workflowsActions";
import { getCustomFields } from "services/customfields/actions";
import { getTags } from "services/tags/actions";
import { getUserCards } from 'services/auth/authActions'
import { getAutomations } from "../scenes/Settings/scenes/Automations/services/actions";
import { updatePersistentMenu } from "../scenes/Settings/scenes/PersistentMenu/services/actions";
import "../scenes/EngageAdd/scenes/EngageBuilder/styles.css";
// import pencilIcon from 'assets/images/icon-pencil.png';
// import editIcon from 'assets/images/icon-edit.png';
import { Block, Svg } from "../Layout";
import { OuterDragBoard } from "./components";
import BuilderAsideMenu from "./components/BuilderAsideMenu";
import { getPageWorkflowTriggers } from "../../../services/workflows/workflowsActions";

// const { Option } = components;
// const messageTypes = Object.keys(Constants.messageType).map(
//     i => Constants.messageType[i]
// );

// const customSingleValue = ({ data }) => (
//     <div className="input-select">
//         <div className="input-select__single-value">
//             {data.image && (
//                 <span className="input-select__icon">
//                     <img src={data.image} />
//                 </span>
//             )}
//             <span>{data.label}</span>
//         </div>
//     </div>
// );
// const IconOption = props => (
//     <Option {...props}>
//         {props.data.image && (
//             <span className="input-select__icon">
//                 <img src={props.data.image} />
//             </span>
//         )}
//         {props.data.label}
//     </Option>
// );

class EditWorkflow extends React.Component {
    constructor(props) {
        super(props);

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
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
            orphanSteps: [],
            showConfigMenu: true,
            updatedInfo: false,
            workflowType: urlParams.get("type"),
            postRedirect: urlParams.get("redirect")
        };
    }

    componentDidMount() {
        const engageId = this.props.match.params.engageId;
        const pageId = this.props.match.params.id;
        if (
            engageId !== "add" &&
            (!this.props.workflowType || !this.props.name)
        ) {
            this.props.actions.getPageWorkflows(pageId);
        }

        this.props.actions.getCustomFields(pageId);
        this.props.actions.getTags(pageId);
        this.props.actions.getAutomations(pageId);
        this.props.actions.getPageWorkflowTriggers(pageId);
        this.props.actions.getPageWorkflow(pageId, engageId);
        this.props.actions.getUserCards();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { updatedInfo, workflowType, postRedirect } = this.state;
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
            // !this.props.loadingTags &&
            // !this.props.loadingAutomations &&
            !this.props.loadingWorkflows
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
            }
        }

        if (nextProps.workflow && !updatedInfo) {
            const workflow = nextProps.workflow;
            console.log("workflow", workflow);
            const steps = transformStepsToLocal(workflow.steps);
            this.setState({ updatedInfo: true });
            this.props.actions.updateEngageInfo({
                name: workflow.name,
                activeStep: workflow.steps[0].stepUid,
                showBuilderAsideMenu: false,
                steps: steps,
                uid: workflow.uid
            });
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
            this.setState({ isCompletedSave: true });
        }
        if (!nextProps.loading && this.state.isCompletedSave) {
            Swal.close();
            if (nextProps.error) {
                Swal({
                    title: "Message Saving Error",
                    text: nextProps.error,
                    type: "error",
                    showCancelButton: true,
                    cancelButtonText: "Close"
                });
                this.setState({ isCompletedSave: false });
            } else if (this.state.isOnlySave) {
                // do nothing
            } else {
                if (workflowType == "broadcast-messenger") {
                    this.props.history.push({
                        pathname: `/page/${this.props.match.params.id}/broadcasts/add/messenger`
                    });
                } else if (workflowType == "broadcast-sms") {
                    this.props.history.push({
                        pathname: `/page/${this.props.match.params.id}/broadcasts/add/sms`
                    });
                } else if (workflowType == "broadcast-email") {
                    this.props.history.push({
                        pathname: `/page/${this.props.match.params.id}/broadcasts/add/email`
                    });
                } else if (postRedirect == "trigger") {
                    this.props.history.push({
                        pathname: `/page/${this.props.match.params.id}/triggers/add`
                    });
                } else {
                    this.props.history.push({
                        pathname: `/page/${this.props.match.params.id}/workflows`
                    });
                }
            }
        }
    }

    updateWorkflow = (workflow, isRedirect) => {
        let pageId = this.props.match.params.id;
        let engageId = this.props.match.params.engageId;
        this.setState(
            {
                isOnlySave: !isRedirect
                // updatedInfo: false,
            },
            () => {
                this.props.actions.updateEngage(this.props.match.params.id, {
                    ...workflow,
                    uid: this.props.uid
                });
            }
        );
    };

    render() {
        if (!this.props.workflow) {
            return null;
        }
        return (
            <React.Fragment>
                {/* Begin Drag Board */}
                <Block
                    id="main-block"
                    className={`main-container addSequence greyBg mt-0 ${!this
                        .state.showConfigMenu && "hide"}`}
                >
                    <Block className="inner-box-main">
                        {/* <h2 className="title-head">Name here</h2> */}
                        <OuterDragBoard
                            name={this.props.name}
                            saveWorkflow={this.updateWorkflow}
                        />
                    </Block>
                    {this.props.currentStep &&
                        this.props.currentStep.stepType !== "delay" && (
                            <BuilderAsideMenu />
                        )}
                </Block>
                {/* end Drag Board */}
            </React.Fragment>
        );
    }
}

EditWorkflow.propTypes = {
    name: PropTypes.string.isRequired,
    // workflowType: PropTypes.string.isRequired,
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
    workflow: state.default.workflows.workflow,
    loadingWorkflows: state.default.workflows.loading,
    errorWorkflows: state.default.workflows.error,
    loadingTags: state.default.settings.tags.loading,
    errorTags: state.default.settings.tags.error,
    loadingAutomations: state.default.settings.automations.loading
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            getPageWorkflow,
            updateEngageInfo,
            deleteEngageInfo,
            addEngage,
            updateEngage,
            updateNewCampaignInfo,
            deleteStepInfo,
            getCustomFields,
            getPageWorkflows,
            getTags,
            getPageWorkflowTriggers,
            getAutomations,
            updatePersistentMenu,
            updateBroadcast,
            getUserCards
        },
        dispatch
    )
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(EditWorkflow)
);
