import React, { Component } from "react";
import { connect } from "react-redux";
// import { Button, Input, Select, TextArea } from 'semantic-ui-react';
import uuid from "uuid/v1";
import Swal from "sweetalert2";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";

import Constants from "../../../config/Constants";
import { Block } from "../Layout";
import { OuterDragBoard } from "./components";
import BuilderAsideMenu from "./components/BuilderAsideMenu";
import { getEngageAddState } from "../scenes/EngageAdd/services/selector";
import {
    updateItemInfo,
    updateStepInfo,
    addStepInfo,
    updateEngageInfo,
    addEngage
} from "../scenes/EngageAdd/services/actions";
import { getTags } from "../../../services/tags/actions";
import {
    getPageWorkflowTriggers,
    getPageWorkflows
} from "../../../services/workflows/workflowsActions";
import { getCustomFields } from "services/customfields/actions";
import { getAutomations } from "../scenes/Settings/scenes/Automations/services/actions";
import { getUserCards } from 'services/auth/authActions'
import { getSMSBuilderDefaultState, getSMTPBuilderDefaultState } from '../scenes/EngageAdd/services/default-state';

class AddSequence extends Component {
    constructor(props) {
        super(props);
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        this.state = {
            isSaveComplete: false,
            workflowType: urlParams.get("type"),
            postRedirect: urlParams.get("redirect")
        };
    }

    componentWillMount() {
        const pageId = this.props.match.params.id;
        this.initialSetup();
        this.props.actions.getTags(pageId);
        this.props.actions.getPageWorkflowTriggers(pageId);
        this.props.actions.getPageWorkflows(pageId);
        this.props.actions.getCustomFields(pageId);
        this.props.actions.getAutomations(pageId);
        this.props.actions.getUserCards();
        // console.log('workflowType', this.state.workflowType);
    }

    UNSAFE_componentWillReceiveProps = nextProps => {
        const { isSaveComplete, workflowType, postRedirect } = this.state;
        console.log(isSaveComplete);
        // console.log('nextProps', nextProps);
        if (!nextProps.loading && isSaveComplete) {
            Swal.close();
            if (nextProps.error) {
                this.setState({
                    isSaveComplete: false
                });
            } else if (this.state.isOnlySave) {
                this.props.history.push({
                    pathname: `/page/${this.props.match.params.id}/workflows/${nextProps.workflowUid}/edit`
                });
            } else {
                // localStorage.removeItem('autoSaveWorkflow');
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

        if (nextProps.loading) {
            this.setState({
                isSaveComplete: true
            });
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
        }
    };

    initialSetup() {
        // let workflow = localStorage.getItem('autoSaveWorkflow');
        // if (workflow) {
        //     workflow = JSON.parse(workflow);
        // }
        // if (workflow && workflow.steps && workflow.steps.length > 0) {
        //     this.props.actions.updateEngageInfo(workflow);
        // } else {
        const { workflowType } = this.state;
        const stepUid = uuid();
        let steps = [];
        if(workflowType == 'broadcast-sms') {
            steps = [
                {
                    name: "Step Title",
                    stepUid: stepUid,
                    stepType: "sms",
                    quickReplies: [],
                    ...getSMSBuilderDefaultState()
                }
            ];
        }
        else if(workflowType == 'broadcast-email') {
            steps = [
                {
                    name: "Step Title",
                    stepUid: stepUid,
                    stepType: "smtp",
                    quickReplies: [],
                    ...getSMTPBuilderDefaultState()
                }
            ];
        }
        else {
            steps = [
                {
                    name: "Step Title",
                    stepUid: stepUid,
                    stepType: "items",
                    items: [
                        {
                            uid: uuid(),
                            type: Constants.toolboxItems.textItem.type,
                            textMessage: null,
                            actionBtns: [],
                            order: 0
                        }
                    ],
                    quickReplies: []
                }
            ];
        }
        this.props.actions.updateEngageInfo({ steps, activeStep: stepUid });
        // }
    }

    //#region Saving Work flow
    saveWorkflow = (workflow, isRedirect) => {
        this.setState(
            {
                isOnlySave: !isRedirect
            },
            () => {
                this.props.actions.addEngage(this.props.match.params.id, {
                    ...workflow
                });
            }
        );
    };

    autoSaveWorkflow = ({ name }) => {
        // const { steps, activeStep } = this.props;
        // localStorage.setItem('autoSaveWorkflow', JSON.stringify({ steps, activeStep, name }));
    };
    //#endregion

    render() {
        return (
            <Block
                id="main-block"
                className="main-container addSequence greyBg mt-0"
            >
                <Block className="inner-box-main addworkflow">
                    <OuterDragBoard
                        autoSaveWorkflow={this.autoSaveWorkflow}
                        saveWorkflow={this.saveWorkflow}
                    />
                </Block>
                <BuilderAsideMenu />
            </Block>
        );
    }
}

const mapStateToProps = state => ({
    ...getEngageAddState(state),
    // workflow: state.default.workflow.workflow,
    workflowUid: state.default.scenes.engageAdd.uid,
    // workflowItem: state.default.workflow.workflowItem,
    loadingWorkflows: state.default.workflows.loading,
    lastUpdatedAt: Date.now(),
    activeStep: getEngageAddState(state).activeStep,
    steps: getEngageAddState(state).steps
});
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            updateEngageInfo,
            updateItemInfo,
            addStepInfo,
            updateStepInfo,
            addEngage,
            getTags,
            getPageWorkflowTriggers,
            getPageWorkflows,
            getCustomFields,
            getAutomations,
            getUserCards
        },
        dispatch
    )
});
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(AddSequence)
);
