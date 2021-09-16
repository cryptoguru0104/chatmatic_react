import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { toastr } from 'react-redux-toastr';
import uuidv1 from 'uuid/v1';
import _ from 'lodash';
import { components } from 'react-select/lib';
import { transformStepsToLocal } from 'services/workflows/transformers';

import { isValidUrl } from 'services/utils';
import {
    getCurrentStep,
    getEngageAddState
} from '../scenes/EngageAdd/services/selector';
import {
    updateEngageInfo,
    deleteEngageInfo,
    addEngage,
    deleteStepInfo,
    updateEngage,
    updateBroadcast
} from '../scenes/EngageAdd/services/actions';
import { updateNewCampaignInfo } from '../scenes/CampaignsAdd/services/actions';
import {
    getPageWorkflows,
    getPageWorkflowStats,
    getPageWorkflow
} from 'services/workflows/workflowsActions';
import { getCustomFields } from 'services/customfields/actions';
import { getTags } from 'services/tags/actions';
import { getAutomations } from '../scenes/Settings/scenes/Automations/services/actions';
import { updatePersistentMenu } from '../scenes/Settings/scenes/PersistentMenu/services/actions';

// import Constants from 'config/Constants';
import '../scenes/EngageAdd/scenes/EngageBuilder/styles.css';
import { Block, Svg } from '../Layout';
import { OuterDragBoard, Stats } from './components';
// import BuilderAsideMenu from './components/BuilderAsideMenu';
import { getPageWorkflowTriggers } from '../../../services/workflows/workflowsActions';

class StatsWorkflow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: this.props.name,
            workflowType: this.props.workflowType,
            keywords:
                this.props.keywords && typeof this.props.keywords === 'object'
                    ? this.props.keywords.map(keyword => {
                          const value = uuidv1();
                          return { label: keyword, value };
                      })
                    : [],
            keywordsOption: this.props.keywordsOption,
            isCompletedSave: false,
            orphanSteps: [],
            showConfigMenu: true,
            updatedInfo: false
        };
    }

    componentWillMount() {
        const engageId = this.props.match.params.engageId;
        const pageId = this.props.match.params.id;
        this.props.actions.getPageWorkflows(pageId);
        this.props.actions.getPageWorkflowStats(pageId, engageId);
        this.props.actions.getCustomFields(pageId);
        // this.props.actions.getTags(this.props.match.params.id);
        this.props.actions.getAutomations(pageId);
        this.props.actions.getPageWorkflow(pageId, engageId);
        // this.props.actions.getPageWorkflowTriggers(this.props.match.params.id);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { updatedInfo } = this.state;
        if (
            nextProps.loadingTags ||
            nextProps.loadingAutomations ||
            (nextProps.loadingWorkflows && !this.props.workflowType)
        ) {
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
            }
        }

    if (nextProps.workflow && !updatedInfo) {
            const workflow = nextProps.workflow;
            console.log('workflow', workflow)
            const steps = transformStepsToLocal(workflow.steps);
            this.setState({ updatedInfo: true })
            this.props.actions.updateEngageInfo({
                name: workflow.name,
                // workflowType: workflow.workflowType,
                activeStep: workflow.steps[0].stepUid,
                steps: steps,
                uid: workflow.uid
                // keywords: workflow.keywords || '',
                // keywordsOption: workflow.keywordsOption || ''
            });
        }

        if (nextProps.loading) {
            Swal({
                title: 'Please wait...',
                text: 'We are saving the message...',
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
            console.log('nextProps.error', nextProps.error);
            if (nextProps.error) {
                Swal({
                    title: 'Message Saving Error',
                    text: nextProps.error,
                    type: 'error',
                    showCancelButton: true,
                    cancelButtonText: 'Close'
                });
                this.setState({ isCompletedSave: false });
            } else {
                this.props.history.push({
                    pathname: `/page/${this.props.match.params.id}/workflows`
                });
            }
        }
    }

    render() {
        return (
            <React.Fragment>
                {/* Begin Drag Board */}
                <Block
                    id="main-block"
                    className={`main-container addSequence greyBg mt-0 ${!this
                        .state.showConfigMenu && 'hide'}`}
                >
                    <Block className="inner-box-main">
                        <h2 className="title-head">{this.props.name}</h2>
                        <OuterDragBoard name={this.props.name} stats />
                        {this.props.workflowStats &&
                            this.props.workflowStats.workflow && (
                                <Stats
                                    workflowStats={
                                        this.props.workflowStats.workflow
                                    }
                                />
                            )}
                    </Block>
                </Block>
                {/* end Drag Board */}
            </React.Fragment>
        );
    }
}

StatsWorkflow.propTypes = {
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
    loadingAutomations: state.default.settings.automations.loading,
    errorAutomations: state.default.settings.automations.error,
    workflowStats: state.default.workflows.workflowStats
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
            getPageWorkflowStats
        },
        dispatch
    )
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(StatsWorkflow)
);
