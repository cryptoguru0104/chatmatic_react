import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Image, List, Button, Popup, Icon, Modal } from "semantic-ui-react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { toastr } from "react-redux-toastr";
import Swal from "sweetalert2";
import _ from "lodash";
import { Grid, IconButton } from "@material-ui/core";

import { Block, Svg, Pagination } from "../Layout";
import { sequenceGraph } from "assets/img";
import { getActiveWorkflows } from "services/workflows/selector";
import {
    getPageWorkflows as getPageWorkflowsAction,
    deletePageWorkflow
} from "services/workflows/workflowsActions";
import {
    updateEngageInfo,
    deleteEngageInfo
} from "../scenes/EngageAdd/services/actions";
import { createTemplate } from "../scenes/Settings/scenes/Templates/services/actions";
import { CreateTemplateModal, ImageCropModal } from "./components";
// import EngageItem from '../scenes/Engages/components/EngageItem';
import { MuiPagination, MuiFilter } from "components/Mui";

import './ListWorkflows.scss';

const PAGE_WORKFLOW_SHOW = 7;
class Engages extends React.Component {
    state = {
        workflow: null,
        isEditTrue: false,
        showTemplateModal: false,
        showImageCropModal: false,
        workflow: null,
        filterBy: 'ALL', //NAME,
        filterQuery: '',
        page: 1,
    };

    componentDidMount() {
        this.props.actions.getPageWorkflowsAction(this.props.match.params.id);
        this.props.actions.deleteEngageInfo();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { error } = this.props;

        if (nextProps.loading && nextProps.workflows.length === 0) {
            Swal({
                title: "Please wait...",
                text: "Loading a listing of your engagements...",
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (this.props.loadingTemplate && nextProps.error) {
            toastr.error("Error", nextProps.error);
        }

        if (nextProps.loadingTemplate) {
            Swal({
                title: "Please wait...",
                text: "Creating template...",
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
                toastr.success("Success", "Template Created");
            }
        }
        if (nextProps.error && !error) {
            Swal({
                title: "Error",
                text: nextProps.error,
                type: "error",
                showCancelButton: true,
                cancelButtonText: "Close"
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
        Swal({
            title: "Are you sure?",
            text: "Please verify that you want to delete this workflow",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete this workflow",
            cancelButtonText: "No, I want to keep it",
            confirmButtonColor: "#f02727"
        }).then(result => {
            if (result.value) {
                this.props.actions.deletePageWorkflow(
                    this.props.match.params.id,
                    workflow.uid
                );
            }
        });
    };

    _edit = workflow => {
        this.props.actions.updateEngageInfo({
            name: workflow.name,
            workflowType: workflow.workflowType,
            activeStep: workflow.steps[0].stepUid,
            steps: workflow.steps,
            uid: workflow.uid,
            keywords: workflow.keywords || "",
            keywordsOption: workflow.keywordsOption || ""
        });
        this.setState({
            workflow,
            isEditTrue: true
        });
    };

    //#region create template
    handleCreateTemplate = workflow => {
        // workflow.steps = transformStepsToLocal(workflow.steps);
        this.setState({
            showTemplateModal: true,
            workflow
        });
    };

    closeTemplateModal = () => {
        // console.log('close modal');
        this.setState({
            showTemplateModal: false,
            workflow: null
        });
    };
    //#endregion

    //#region upload workflow image
    handleCropImageModal = workflow => {
        this.setState({
            showImageCropModal: true,
            workflow
        });
    };

    closeImageCropModal = (isUploaded = false) => {
        // console.log('close modal');
        this.setState({
            showImageCropModal: false,
            workflow: null
        });
        if (isUploaded) {
            this.props.actions.getPageWorkflowsAction(
                this.props.match.params.id
            );
            this.props.actions.deleteEngageInfo();
        }
    };
    //#endregion

    render() {
        const pageId = this.props.match.params.id;
        const { workflows } = this.props;
        const {
            workflow: editWorkflow,
            isEditTrue,
            showTemplateModal,
            showImageCropModal,
            workflow,
            page,
            filterBy,
            filterQuery
        } = this.state;

        let pageWorkflows = workflows || [];
        if(filterQuery.trim() != "") {
            pageWorkflows = pageWorkflows.filter(w => {
                if((filterBy == 'ALL' || filterBy == 'NAME') && w.name.toLowerCase().includes(filterQuery.trim().toLowerCase())) {
                    return true;
                }
                return false;
            });
        }
        let workflowsToShow = pageWorkflows.slice(PAGE_WORKFLOW_SHOW * (page - 1), PAGE_WORKFLOW_SHOW * page);
        let workflowsJsx;
        if (workflowsToShow) {
            workflowsJsx = workflowsToShow.map(workflow => (
                <Grid item xs={6} sm={4} md={3} key={workflow.uid}>
                    <Block className="sequence-inner">
                        {/* <h6 className="sq-titlesm">
                            Last edited <span>04/03</span>
                        </h6> */}
                        <h3 className="title-head sq-title p-0">
                            {workflow.name}
                        </h3>
                        <Block className="img-block">
                            <Block className="img-block-content workflow-cover-image" style={{backgroundImage: `url(${workflow.pictureUrl || sequenceGraph})`}}>
                                <span>
                                    <Icon
                                        name="edit outline"
                                        size="small"
                                        onClick={() =>
                                            this.handleCropImageModal(workflow)
                                        }
                                    />
                                </span>
                            </Block>
                        </Block>
                        <Grid container justify="space-around" alignItems="stretch" className="edit-listing">
                            <div
                                className="edit-listing-item"
                                onClick={() => {
                                    this.props.history.push({
                                        pathname: `/page/${workflow.pageUid}/workflows/${workflow.uid}/edit`
                                    });
                                }}
                            >
                                <Popup
                                    on={["hover"]}
                                    content="Edit"
                                    position="top center"
                                    inverted
                                    trigger={
                                        <IconButton>
                                            <Svg name="workflow-list-edit" />
                                        </IconButton>
                                    }
                                />
                            </div>
                            <div className="separator"></div>
                            <div
                                className="edit-listing-item"
                                onClick={() => {
                                    this.props.history.push({
                                        pathname: `/page/${workflow.pageUid}/workflows/${workflow.uid}/stats`
                                    });
                                }}
                            >
                                <Popup
                                    on={["hover"]}
                                    content="Stats"
                                    position="top center"
                                    inverted
                                    trigger={
                                        <IconButton>
                                            <Svg name="workflow-list-view" />
                                        </IconButton>
                                    }
                                />
                            </div>
                            <div className="separator"></div>
                            <div
                                className="edit-listing-item">
                                <Popup
                                    on={["hover"]}
                                    content="Create Template"
                                    position="top center"
                                    inverted
                                    trigger={
                                        <IconButton
                                            onClick={() =>
                                                this.handleCreateTemplate(
                                                    workflow
                                                )
                                            }
                                        >
                                            <Svg name="workflow-list-template" />
                                        </IconButton>
                                    }
                                />
                            </div>
                            <div className="separator"></div>
                            <div
                                className="edit-listing-item"
                                onClick={() =>
                                    this._deletePageWorkflow(workflow)
                                }
                            >
                                <Popup
                                    on={["hover"]}
                                    content="Delete"
                                    position="top center"
                                    inverted
                                    trigger={
                                        <IconButton>
                                        <Svg name="workflow-list-trash" />
                                        </IconButton>
                                    }
                                />
                            </div>
                        </Grid>
                    </Block>
                </Grid>
            ));
        }

        return (
            <Block className="main-container workflow-container workflow-outer m-0">
                {showTemplateModal && (
                    <CreateTemplateModal
                        open={showTemplateModal}
                        close={this.closeTemplateModal}
                        workflowUid={workflow.uid}
                        id={pageId}
                    />
                )}
                {showImageCropModal && (
                    <ImageCropModal
                        open={showImageCropModal}
                        close={this.closeImageCropModal}
                        workflow={workflow}
                        id={pageId}
                    />
                )}
                <Block className="outer-custom-main list-workflow">
                    <Grid container className="m-0 list-workflow-head" justify="space-between" alignItems="stretch">
                        <Grid item className="m-0 pb-0 pt-0 d-flex justify-content-start align-items-center">
                            <h2 className="title-head">Workflows</h2>
                        </Grid>
                        <Grid item className="m-0 p-0">
                        <MuiFilter
                            onChangeType = {(filterBy) => this.setState({ filterBy })}
                            onChange = {filterQuery => this.setState({ filterQuery, page: 1 })}
                            placeholder="Search Workflow"
                            selecteField = {filterBy}
                            fieldOptions = {[{ value: 'ALL', label: 'All' }, { value: 'NAME', label: 'Name' }]}
                        ></MuiFilter>
                        </Grid>
                    </Grid>

                    <Block className="inner-box-scroll-main">
                        <Grid container spacing={2} className="list-workflow-grid-container">
                            <Grid item xs={6} sm={4} md={3}>
                                <Block className="list-add-btn sequence-inner">            
                                    <h3 className="title-head sq-title p-0">
                                        &nbsp;
                                    </h3>
                                    <Block className="img-block">
                                        <Block className="img-block-content">
                                            <Link
                                                to={`/page/${pageId}/workflows/select-template`}
                                            >
                                                <Grid container direction="column" justify="center" alignItems="center" className="list-add-btn-in">
                                                    <div>
                                                        <i
                                                            aria-hidden="true"
                                                            className="add icon"
                                                        ></i>
                                                    </div>
                                                    <h4>Add New Workflow</h4>
                                                </Grid>
                                            </Link>
                                        </Block>
                                    </Block>
                                    <Block className="title-footer"></Block>
                                </Block>
                            </Grid>
                            {workflowsJsx}
                        </Grid>
                    </Block>
                    <Block className="paginationCol">
                        {pageWorkflows && pageWorkflows.length > PAGE_WORKFLOW_SHOW && (
                            <MuiPagination 
                                count={Math.ceil(pageWorkflows.length / PAGE_WORKFLOW_SHOW)} 
                                shape="rounded"
                                page={page || 1}
                                onChange={(event, page) =>  this.setState({page})}/>
                        )}
                    </Block>
                </Block>
            </Block>
        );
    }
}

Engages.propTypes = {
    workflows: PropTypes.arrayOf(
        PropTypes.shape({
            uid: PropTypes.number.isRequired,
            pageUid: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            // workflowType: PropTypes.string.isRequired,
            keywords: PropTypes.array,
            keywords_option: PropTypes.string,
            messagesClickedCount: PropTypes.number,
            messagesClickedRatio: PropTypes.number,
            messagesDelivered: PropTypes.number,
            messagesReadCount: PropTypes.number,
            messagesReadRatio: PropTypes.number,
            createdAtUtc: PropTypes.string
            // archived: PropTypes.bool.isRequired,
            // steps: PropTypes.array.isRequired
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
            deleteEngageInfo,
            createTemplate
        },
        dispatch
    )
});

export default connect(mapStateToProps, mapDispatchToProps)(Engages);
