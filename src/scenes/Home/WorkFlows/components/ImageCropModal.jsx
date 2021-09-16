import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button } from 'semantic-ui-react';
import HayerImageCrop from 'hayer-react-image-crop';
import 'hayer-react-image-crop/style.css';

import { pageFileUpload } from '../../scenes/EngageAdd/services/actions';
import { updateWorkflowImage, getPageWorkflows } from 'services/workflows/workflowsActions';
import { Block } from '../../Layout';
import Swal from 'sweetalert2';

// const uploadingSteps = {
//     1: 'uploading',
//     2: 'saving',
//     3: 'done'
// }

class ImageCropModal extends Component {
    state = {
        uploadingStep: null,
        img: null
    }

    //#region lifecyle methods
    UNSAFE_componentWillReceiveProps = ({ uploading, uploadingError, uploadedFile, loading, error, workflow, imageLoading, imageError }) => {
        const { uploadingStep } = this.state;

        if (uploading) {
            this.setState({
                uploadingStep: 'uploading'
            });
            Swal({
                title: 'Please wait...',
                text: 'we are uploading image...',
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (!uploading && uploadingStep === 'uploading') {
            Swal.close();
            if (uploadingError) {
                this.setState({
                    uploadingStep: null
                });
                this.close();
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: uploadingError || 'Something went wrong! Please try again.'
                });
            } else if (uploadedFile) {
                this.setState({
                    uploadingStep: 'saving'
                });
                this.props.actions.updateWorkflowImage(this.props.match.params.id, workflow.uid, {
                    pictureUrl: uploadedFile.url
                });
            } else {
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong! Please try again.'
                });
            }
        } else if (imageLoading && uploadingStep === 'saving') {
            Swal({
                title: 'Please wait...',
                text: 'we are saving workflow...',
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (!imageLoading && uploadingStep === 'saving') {
            Swal.close();
            this.setState({
                uploadingStep: null
            });
            if (imageError) {
                this.close();
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: uploadingError || 'Something went wrong! Please try again.'
                });
            } else {
                Swal.fire({
                    type: 'success',
                    title: 'Success!',
                    text:
                        'Workflow Image has been uploaded and saved.',
                    showConfirmButton: false,
                    timer: 1500
                });
                this.props.close(true);
                // this.props.actions.getPageWorkflows(this.props.match.params.id);
            }
        }
    }
    //#endregion

    //#region functionality
    close = () => this.props.close();

    uploadimage = (img) => {
        this.setState({
            img
        });
    }

    handleUploadimage = () => {
        if (this.state.img) {
            this.props.actions.pageFileUpload(
                this.props.match.params.id,
                'image',
                this.state.img
            );
        }
    }
    //#endregion

    render() {
        const { open, workflow } = this.props;
        return (
            <Modal
                // size="fullscreen"
                className="custom-popup imgCropPopUp"
                open={open}
                onClose={() => false}
            >
                <Modal.Header>
                    Crop Image{' '}
                    <i
                        aria-hidden="true"
                        className="close small icon close-icon"
                        onClick={this.close}
                    ></i>
                </Modal.Header>
                <Modal.Content>

                    <Block className="imgcrop-inner">
                        <HayerImageCrop
                            onImageCrop={img => {
                                // console.log('img =>', img);
                                if (img && img.trim() !== '') {
                                    this.uploadimage(img);
                                } else {
                                    this.setState({ img: null });
                                }
                            }}
                            error={err => alert(err)}
                            aspect={4 / 1}
                            unit="px"
                            width={400}
                            src={workflow.pictureUrl}
                        />
                    </Block>


                    <Block className="modal-buttons-col crop-modal-footer justify">
                        <p>Image size: (800 x 200)px OR (4:1) ratio</p>
                        <Block className="buttons-right-col">
                            <Button
                                className="cancel"
                                secondary
                                onClick={this.props.close}
                            >Cancel</Button>
                            <Button
                                className="save"
                                primary
                                onClick={this.handleUploadimage}
                                disabled={this.state.img ? false : true}
                            >Upload & Save</Button>
                        </Block>
                    </Block>

                </Modal.Content>
            </Modal>
        );
    }
}

const mapStateToProps = (state, props) => ({
    // workflows: getActiveWorkflows(state, props),
    imageLoading: state.default.workflows.loading,
    imageError: state.default.workflows.error,
    uploading: state.default.scenes.engageAdd.fileUploading,
    uploadingError: state.default.scenes.engageAdd.error,
    uploadedFile: state.default.scenes.engageAdd.uploadedFile,
    error: state.default.scenes.engageAdd.error,
    loading: state.default.scenes.engageAdd.loading
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            pageFileUpload,
            updateWorkflowImage,
            getPageWorkflows
        },
        dispatch
    )
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ImageCropModal));
