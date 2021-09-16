import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { toastr } from 'react-redux-toastr';
import Swal from 'sweetalert2';
import _ from 'lodash';

import { getActiveWorkflows } from 'services/workflows/selector';
import {
    getPageWorkflows as getPageWorkflowsAction,
    deletePageWorkflow
} from 'services/workflows/workflowsActions';
import {
    updateEngageInfo,
    deleteEngageInfo
} from '../EngageAdd/services/actions';

import EngageItem from './components/EngageItem';

import './styles.css';

class Engages extends React.Component {
    componentDidMount() {
        this.props.actions.getPageWorkflowsAction(this.props.match.params.id);
        this.props.actions.deleteEngageInfo();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { error } = this.props;

        if (nextProps.loading) {
            Swal({
                title: 'Please wait...',
                text: 'Loading a listing of your engagements...',
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (this.props.loadingTemplate && nextProps.error) {
            toastr.error('Error', nextProps.error);
        }

        if (nextProps.loadingTemplate) {
            Swal({
                title: 'Please wait...',
                text: 'Creating template...',
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (this.props.loadingTemplate) {
            if (nextProps.errorTemplate) {
                toastr.error(nextProps.errorTemplate);
            } else {
                toastr.success('Success', 'Template Created');
            }
        }
        if (nextProps.error && !error) {
            Swal({
                title: 'Error',
                text: nextProps.error,
                type: 'error',
                showCancelButton: true,
                cancelButtonText: 'Close'
            });
        }
        if (
            !nextProps.loading &&
            !nextProps.loadingTemplate &&
            !nextProps.error
        ) {
            Swal.close();
        }
    }

    _deletePageWorkflow = workflow => {
        this.props.actions.deletePageWorkflow(
            this.props.match.params.id,
            workflow.uid
        );
    };

    render() {
        const pageId = this.props.match.params.id;
        const renderWorkflows = () => {
            if (this.props.workflows) {
                const workflows = this.props.workflows
                    .filter(x => x.steps.length > 0)
                    .map((workflow, index) => (
                        <EngageItem
                            key={workflow.uid}
                            workflow={workflow}
                            deleteWorkflow={() =>
                                this._deletePageWorkflow(workflow)
                            }
                            editWorkflow={() =>
                                this.props.actions.updateEngageInfo({
                                    name: workflow.name,
                                    workflowType: workflow.workflowType,
                                    activeStep: workflow.steps[0].stepUid,
                                    steps: workflow.steps,
                                    uid: workflow.uid,
                                    keywords: workflow.keywords || '',
                                    keywordsOption:
                                        workflow.keywordsOption || ''
                                })
                            }
                        />
                    ));

                return (
                    <div className="card engages-table">
                        <div className="card-header">
                            <div className="row">
                                <div className="col action" />
                                <div className="col-5">
                                    <small className="font-weight-bold">
                                        NAME
                                    </small>
                                </div>
                                <div className="col-2 thin-border-left">
                                    <small className="font-weight-bold">
                                        DELIVERED
                                    </small>
                                </div>
                                <div className="col-2 thin-border-left">
                                    <small className="font-weight-bold">
                                        OPENED
                                    </small>
                                </div>
                                <div className="col-2 thin-border-left">
                                    <small className="font-weight-bold">
                                        CLICKED
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div
                            className="list-group list-group-flush engagement-list"
                            id="accordion"
                        >
                            {workflows}
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="d-flex flex-column justify-content-center align-items-center h-100">
                        <div className="text-dark">
                            You do not have any engagements in your account.
                        </div>
                        <div>
                            Please select a type of engagement above and click
                            the "Add New" button to begin creating a new one.
                        </div>
                    </div>
                );
            }
        };

        return (
            <div>
                <div
                    className="d-flex flex-column engage-scene pt-3 engages-container"
                    data-aos="fade"
                >
                    <div className="d-flex justify-content-between align-items-center mb-3 w-100">
                        <strong className="pl-2">Engagements</strong>
                        <Link
                            to={`/page/${pageId}/engages/add`}
                            className="btn btn-sm btn-primary rounded mr-1"
                        >
                            Add New +
                        </Link>
                    </div>

                    {renderWorkflows()}
                </div>
            </div>
        );
    }
}

Engages.propTypes = {
    workflows: PropTypes.arrayOf(
        PropTypes.shape({
            uid: PropTypes.number.isRequired,
            pageUid: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            workflowType: PropTypes.string.isRequired,
            keywords: PropTypes.array,
            keywords_option: PropTypes.string,
            messagesClickedCount: PropTypes.number,
            messagesClickedRatio: PropTypes.number,
            messagesDelivered: PropTypes.number,
            messagesReadCount: PropTypes.number,
            messagesReadRatio: PropTypes.number,
            createdAtUtc: PropTypes.string,
            archived: PropTypes.bool.isRequired,
            steps: PropTypes.array.isRequired
        })
    ),
    actions: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.any,
    loadingTemplate: PropTypes.bool.isRequired,
    errorTemplate: PropTypes.any
};

const mapStateToProps = (state, props) => ({
    workflows: getActiveWorkflows(state, props),
    loading: state.default.workflows.loading,
    error: state.default.workflows.error,
    loadingTemplate: state.default.settings.templates.loading,
    errorTemplate: state.default.settings.templates.error
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            getPageWorkflowsAction,
            deletePageWorkflow,
            updateEngageInfo,
            deleteEngageInfo
        },
        dispatch
    )
});

export default connect(mapStateToProps, mapDispatchToProps)(Engages);
