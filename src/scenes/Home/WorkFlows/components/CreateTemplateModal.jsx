import React, { Component } from "react";
import { Button, Modal, Checkbox, Form, Dropdown } from "semantic-ui-react";
import { toastr } from "react-redux-toastr";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import Swal from "sweetalert2";
import { connect } from "react-redux";
import HayerImageCrop from "hayer-react-image-crop";
import { Grid } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { Block, Svg } from "../../Layout";

import ViewOuterDragBoard from "./ViewOuterDragBoard";
import { createTemplate } from "../../scenes/Settings/scenes/Templates/services/actions";
import { transformStepsToLocal } from "services/workflows/transformers";
import { getPageWorkflow } from "services/workflows/workflowsActions";
import { pageFileUpload } from "../../scenes/EngageAdd/services/actions";
import './CreateTemplateModal.scss';

class CreateTemplateModal extends Component {
    //#region life cycle method
    state = {
        name: "",
        description: "",
        category: null,
        price: 0,
        isPublic: false,
        submitForm: false,
        workflow: null
    };

    componentWillMount = () => {
        const { workflowUid } = this.props;
        const pageId = this.props.match.params.id;
        this.props.actions.getPageWorkflow(pageId, workflowUid);
    };

    UNSAFE_componentWillReceiveProps = nextProps => {
        const {
            uploading,
            uploadingError,
            uploadedFile,
            loading,
            error,
            close,
            workflow,
            workflowLoading,
            workflowError
        } = nextProps;
        const { submitForm, uploadingStep } = this.state;

        if (uploading) {
            this.setState({
                uploadingStep: "uploading"
            });
            Swal({
                title: "Please wait...",
                text: "we are uploading image...",
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (!uploading && uploadingStep === "uploading") {
            Swal.close();
            this.setState({ uploadingStep: null });
            if (uploadingError) {
                this.close();
                Swal.fire({
                    type: "error",
                    title: "Oops...",
                    text:
                        uploadingError ||
                        "Something went wrong! Please try again."
                });
            } else if (uploadedFile) {
                this.setState(
                    {
                        pictureUrl: uploadedFile.url
                    },
                    () => this.publishTemplate()
                );
            } else {
                Swal.fire({
                    type: "error",
                    title: "Oops...",
                    text: "Something went wrong! Please try again."
                });
            }
        }

        if (workflowLoading) {
            Swal({
                name: "Please wait...",
                text: "We are loading preview...",
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (!workflowLoading && !uploading) {
            Swal.close();
            if (workflowError) {
                Swal.fire({
                    type: "error",
                    name: "Oops...",
                    text:
                        workflowError ||
                        "Something went wrong! Please try again."
                });
            }
            if (workflow) {
                workflow.steps = transformStepsToLocal(workflow.steps);
                this.setState({
                    workflow
                });
            }
        }

        if (loading) {
            this.setState({
                submitForm: true
            });
            Swal({
                name: "Please wait...",
                text: "We are saving the template...",
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (!loading && submitForm) {
            this.setState({
                submitForm: false
            });
            Swal.close();
            if (error) {
                Swal.fire({
                    type: "error",
                    name: "Oops...",
                    text: error || "Something went wrong! Please try again."
                });
            } else {
                Swal.fire({
                    type: "success",
                    name: "Success!",
                    text:
                        "Template has been created. it will appear in your settings/templates tab.",
                    showConfirmButton: false,
                    timer: 1500
                });
                const self = this;
                setTimeout(() => {
                    self.setState(
                        {
                            name: "",
                            description: "",
                            category: null,
                            price: 0,
                            isPublic: false
                        },
                        () => {
                            close();
                        }
                    );
                }, 2000);
            }
        }
    };
    //#endregion

    //#region functionality
    close = () => this.props.close();
    uploadimage = img => {
        this.setState({
            img
        });
    };
    //#endregion

    //#region handle form values
    handleTitleChange = event => {
        this.setState({
            name: event.target.value
        });
    };

    handleTitleChange = event => {
        this.setState({
            name: event.target.value
        });
    };

    handleDetailChange = event => {
        this.setState({
            description: event.target.value
        });
    };

    handleChangeCategory = (e, { value }) => {
        this.setState({
            category: value
        });
    };

    handlePriceChange = event => {
        this.setState({
            price: event.target.value
        });
    };

    handleCheckChange = (e, { checked }) => {
        this.setState({
            isPublic: checked
        });
        // console.log('checkbox-change', this.state.isPublic);
    };
    //#endregion

    //#region save template
    _checkValidation = () => {
        const { name, description, price, category, isPublic } = this.state;
        if (!name || (name && !name.trim())) {
            toastr.error(
                'You must supply a "Title" to this Template before you can save it.'
            );
            return false;
            // } else if (!description || (description && !description.trim())) {
            //     toastr.error(
            //         'You must supply a "Title" to this Template before you can save it.'
            //     );
            //     return false;
        } else if (!category) {
            toastr.error(
                'You must select a "Category" of this Template before you can save it.'
            );
            return false;
        } else if (isPublic && (!price || (price && !price.trim()))) {
            toastr.error(
                'You must supply a "Price" of this Template before you can save it.'
            );
            return false;
        } else {
            return true;
        }
    };

    publishTemplate = () => {
        const {
            name,
            description,
            price,
            category,
            isPublic,
            pictureUrl
        } = this.state;
        const { workflow } = this.props;

        // const isValid = this._checkValidation();
        // if (isValid) {
        let data = {
            workflowUid: workflow.uid,
            name,
            description,
            videoUrl: "",
            price: isPublic ? price : 0,
            category,
            public: isPublic,
            pictureUrl: pictureUrl || null
        };
        // console.log('publishTemplate', data);
        this.props.actions.createTemplate(this.props.id, data);
        // }
    };

    handleUploadimage = () => {
        const isValid = this._checkValidation();
        if (isValid) {
            if (this.state.img) {
                this.props.actions.pageFileUpload(
                    this.props.match.params.id,
                    "image",
                    this.state.img
                );
            } else if (this.state.workflow && this.state.workflow.pictureUrl) {
                this.setState(
                    {
                        pictureUrl: this.state.workflow.pictureUrl
                    },
                    () => this.publishTemplate()
                );
            } else {
                this.publishTemplate();
            }
        }
    };
    //#endregion

    render() {
        const pageId = this.props.id;

        const { open, loading } = this.props;
        const {
            name,
            description,
            price,
            category,
            isPublic,
            workflow
        } = this.state;

        return (
            <React.Fragment>
                <Dialog
                    maxWidth="xl"
                    fullWidth={true}
                    className="custom-popup mac-height create-template-modal-container"
                    open={open}
                    onClose={() => false}
                >
                    <DialogContent>
                        <Grid container justify="space-between">
                            <h2>
                            Create Template
                            </h2>
                            <Button onClick={this.close} className="btn-close">
                            <Svg name="modal-close" />
                        </Button>
                        </Grid>
                        <hr />
                        <Grid container justify="flex-start" alignItems="stretch" className="create-template-modal-content-container">
                            <Grid item className="create-templates-info-container" spacing={2}>
                                    <Form>
                                        <Form.Field className="mb-4">
                                            <label>Template Picture</label>
                                            <Block className="template-imgcrop-inner">
                                                <HayerImageCrop
                                                    onImageCrop={img => {
                                                        // console.log('img =>', img);
                                                        if (img && img.trim() !== "") {
                                                            this.uploadimage(img);
                                                        } else {
                                                            this.setState({
                                                                img: null
                                                            });
                                                        }
                                                    }}
                                                    error={err => alert(err)}
                                                    aspect={2 / 1}
                                                    unit="%"
                                                    width={100}
                                                    src={
                                                        workflow && workflow.pictureUrl
                                                            ? workflow.pictureUrl
                                                            : null
                                                    }
                                                />
                                            </Block>
                                        </Form.Field>
                                        <Form.Field className="mb-4">
                                            <label>Title</label>
                                            <input
                                                placeholder="Type some text here"
                                                type="text"
                                                value={name}
                                                onChange={this.handleTitleChange}
                                            />
                                        </Form.Field>
                                        <Form.Field className="mb-4">
                                            <label>Details</label>
                                            <Form.TextArea
                                                placeholder="Tell us more about you..."
                                                type="text"
                                                value={description}
                                                onChange={this.handleDetailChange}
                                            />
                                        </Form.Field>
                                        <Form.Field className="mb-4">
                                            <label>Category</label>
                                            <Dropdown
                                                placeholder="Select Category"
                                                selection
                                                onChange={this.handleChangeCategory}
                                                value={category}
                                                options={[
                                                    {
                                                        key: 1,
                                                        value: "Ecommerce",
                                                        text: "Ecommerce"
                                                    },
                                                    {
                                                        key: 2,
                                                        value: "Digital Products",
                                                        text: "Digital Products"
                                                    },
                                                    {
                                                        key: 3,
                                                        value: "Health & Fitness",
                                                        text: "Health & Fitness"
                                                    },
                                                    {
                                                        key: 4,
                                                        value: "Local Business",
                                                        text: "Local Business"
                                                    },
                                                    {
                                                        key: 5,
                                                        value: "General",
                                                        text: "General"
                                                    }
                                                ]}
                                            />
                                        </Form.Field>
                                        <Form.Field className="mb-4 price-field">
                                            <Checkbox
                                                label="Make Publicly Available"
                                                checked={isPublic}
                                                onChange={this.handleCheckChange}
                                            />
                                        </Form.Field>
                                        {isPublic && (
                                            <Form.Field className="mb-4">
                                                <label>
                                                    Price <span> (optional) </span>
                                                </label>
                                                <input
                                                    placeholder="Enter price"
                                                    type="number"
                                                    value={price}
                                                    onChange={this.handlePriceChange}
                                                />
                                            </Form.Field>
                                        )}
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className="mt-3"
                                            type="submit"
                                            loading={loading}
                                            onClick={this.handleUploadimage}
                                            className="btn-purchase-template"
                                        >Publish Template</Button>
                                    </Form>
                            </Grid>
                            <Grid item className="create-templates-workflow-container">
                                {workflow && (
                                    <ViewOuterDragBoard workflow={workflow} />
                                )}
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
            </React.Fragment>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            createTemplate,
            getPageWorkflow,
            pageFileUpload
        },
        dispatch
    )
});

export default withRouter(
    connect(
        state => ({
            loading: state.default.settings.templates.loading,
            error: state.default.settings.templates.error,
            workflow: state.default.workflows.workflow,
            workflowLoading: state.default.workflows.loading,
            workflowError: state.default.workflows.error,
            uploading: state.default.scenes.engageAdd.fileUploading,
            uploadingError: state.default.scenes.engageAdd.error,
            uploadedFile: state.default.scenes.engageAdd.uploadedFile
        }),
        mapDispatchToProps
    )(CreateTemplateModal)
);
