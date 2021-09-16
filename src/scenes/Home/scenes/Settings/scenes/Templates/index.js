import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { toastr } from "react-redux-toastr";

import { Grid, Button } from '@material-ui/core';

import { getGeneralWorkflows } from "services/workflows/selector";
import { getPageWorkflows } from "services/workflows/workflowsActions";
import { transformStepsToLocal } from "services/workflows/transformers";
import { deleteTemplate, addTemplate, getTemplates } from "./services/actions";
import { EditTemplateModal } from "../../../../WorkFlows/components";

import "./styles.scss";
import InfoToggle from "../../../../components/InfoToggle";
import { Svg } from "../../../../Layout";

class Templates extends React.Component {
    state = {
        initialLoad: true,
        showTemplateModal: false,
        template: null,
        workflow: null
    };

    componentDidMount() {
        this.props.actions.getTemplates(this.props.match.params.id);
        this.props.actions.getPageWorkflows(this.props.match.params.id);
    }

    componentDidUpdate(prevProps, prevState) {
        const { error, loading, templates } = this.props;
        const { initialLoad } = this.state;
        if (prevProps.loading !== loading) {
            if (loading) {
                Swal({
                    title: "Please wait...",
                    text: "Processing...",
                    onOpen: () => {
                        Swal.showLoading();
                    },
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false
                });
            } else if (prevProps.loading) {
                Swal.close();

                if (error) {
                    toastr.error(error);
                } else if (
                    !initialLoad &&
                    templates.length === prevProps.templates.length
                ) {
                    if (!prevState.showTemplateModal) {
                        toastr.success(
                            "Your new Engagement will be created shortly"
                        );
                    }
                }
                this.setState({ initialLoad: false });
            }
        }
    }

    _importTemplate = () => {
        if (this.refs.importRef && this.refs.importRef.value.length > 0) {
            this.props.actions.addTemplate(
                this.props.match.params.id,
                this.refs.importRef.value
            );
        }
    };

    _deleteTemplate = templateId => {
        Swal({
            title: "Are you sure you want to delete this template?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, please.",
            cancelButtonText: "No, Don’t Do This",
            confirmButtonColor: "#f02727",
            cancelButtonColor: "#274BF0"
        }).then(result => {
            if (result.value) {
                this.props.actions.deleteTemplate(
                    this.props.match.params.id,
                    templateId
                );
            }
        });
    };

    _editTemplate = template => {
        const { allWorkflows } = this.props;
        let workflow = allWorkflows.find(w => w.uid === template.workflowUid);
        console.log("template", template);
        if (template && workflow) {
            // workflow.steps = transformStepsToLocal(workflow.steps);
            console.log("workflow", workflow);
            this.setState({
                showTemplateModal: true,
                workflow,
                template
            });
        }
    };

    _shareTemplate = template => {
        const share_url = window.location.origin + "/template/" + template;
        navigator.clipboard.writeText(share_url);
        toastr.success("The share url copied to clipboard!");
    };

    closeTemplateModal = () => {
        // console.log('close modal');
        this.setState({
            showTemplateModal: false
        });
        this.props.actions.getTemplates(this.props.match.params.id);
    };

    render() {
        const { showTemplateModal, workflow, template } = this.state;
        const pageId = this.props.match.params.id;
        return (
            <Grid container justify="space-between" alignItems="stretch" spacing={1} className="templates-page-container">
                <Grid item xs={12} lg={9} className="template-container">
                    {showTemplateModal && (
                        <EditTemplateModal
                            open={showTemplateModal}
                            close={this.closeTemplateModal}
                            workflowUid={workflow.uid}
                            data={template}
                            id={pageId}
                        />
                    )}
                    <div className="template-list-container">
                        <Grid container direction="row" justify="flex-start">
                            <h2 className="d-inline mr-3">My Templates</h2>
                            <InfoToggle text="The list of templates below are templates YOU have created. If you purchase and/or upload a template it will NOT show up in this list because you did not create it. It will; however, show up in your workflows list directly ready to be used. You can Edit your templates whenever you'd like as well as grab a link to show them off to others (inside or outside of chatmatic)" />
                        </Grid>
                        <div className="table">
                            <div className="row template-header">
                                <div className="col col-3"> Name </div>
                                <div className="col col-3 text-center"> Type </div>
                                <div className="col col-2 text-center"> Downloads </div>
                                <div className="col col-2 text-center"> Share Code </div>
                                <div className="col col-2 text-center"> Edit/Delete </div>
                            </div>
                            <div className="template-list">
                                
                                {this.props.templates.map((template, index) => {
                                    return (
                                        <div
                                            className="row template-row"
                                            key={index}
                                        >
                                            <div className="col col-3">
                                                
                                                {template.name}
                                            </div>
                                            <div className="col col-3 text-center">
                                                
                                                {template.type}
                                            </div>
                                            <div className="col col-2 text-center">
                                                
                                                {template.downloads}
                                            </div>
                                            <div className="col col-2 text-center">
                                                
                                                {template.shareCode}
                                            </div>
                                            <div className="col col-2 text-center">
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <button
                                                        className="btn btn-link p-0"
                                                        onClick={() =>
                                                            this._shareTemplate(
                                                                template.uid
                                                            )
                                                        }
                                                    >
                                                        <i className="fa fa-link" />
                                                    </button>
                                                    <button
                                                        className="btn btn-link p-0"
                                                        onClick={() =>
                                                            this._editTemplate(
                                                                template
                                                            )
                                                        }
                                                    >
                                                        <i className="fa fa-pencil" />
                                                    </button>
                                                    <button
                                                        className="btn btn-link p-0"
                                                        onClick={() =>
                                                            this._deleteTemplate(
                                                                template.uid
                                                            )
                                                        }
                                                    >
                                                        <i className="fa fa-trash" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} lg={3} className="d-flex flex-column justify-content-between align-items-stretch">
                    <div className="template-import-container">
                        <div className="template-import-bottom" style={{opacity: 0}}>
                            <Grid container justify="flex-start" alignItems="flex-start">
                                <Svg name="template-import-note"></Svg>
                                <span>
                                    Note: established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                                </span>
                            </Grid>
                        </div>
                        <div className="">
                            <Grid container direction="row" justify="center">
                                <h2 className="d-inline mr-3">Import Template</h2>
                                <InfoToggle text='This is where you will import any templates you may have purchased or been given. Just paste the code you got upon purchasing and after 1-3 minutes that workflow will show in your Workflows list. Again, importing a template does now make it show up in your "My Templates" area.' />
                            </Grid>
                            <div className="template-import-content">
                                <input
                                    type="text"
                                    ref="importRef"
                                    placeholder="Enter code here"
                                    className="form-control template-import-input"
                                />
                                <button
                                    className="btn btn-primary btn-submit"
                                    onClick={this._importTemplate}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                        <div className="template-import-bottom">
                            <Grid container justify="flex-start" alignItems="flex-start">
                                <Svg name="template-import-note"></Svg>
                                <label>
                                    Note: established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                                </label>
                            </Grid>
                        </div>
                    </div>
                </Grid>
            </Grid>
        );
    }
}

Templates.propTypes = {
    templates: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.any,
    workflows: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    templates: state.default.settings.templates.templates,
    loading: state.default.settings.templates.loading,
    error: state.default.settings.templates.error,
    allWorkflows: state.default.workflows.workflows,
    workflows: getGeneralWorkflows(state)
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            deleteTemplate,
            addTemplate,
            getTemplates,
            getPageWorkflows
        },
        dispatch
    )
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Templates)
);
