import React, { Component } from 'react';
import { Button, Modal, Checkbox, Form, Dropdown } from 'semantic-ui-react';
import { toastr } from 'react-redux-toastr';
import { withRouter } from 'react-router-dom'; import { bindActionCreators } from 'redux';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import { template } from 'lodash';

import { Block } from '../../Layout';
import ViewOuterDragBoard from './ViewOuterDragBoard';
import { updateTemplate } from '../../scenes/Settings/scenes/Templates/services/actions';
import { transformStepsToLocal } from 'services/workflows/transformers';
import {
    getPageWorkflow
} from 'services/workflows/workflowsActions';

class EditTemplateModal extends Component {
    //#region life cycle method
    constructor(props) {
        super(props);
        console.log('template', props.data);
        const {
            data: { name, description, price, category, public: isPublic }
        } = props;
        this.state = {
            name,
            description,
            category,
            price,
            isPublic,
            submitForm: false,
            workflow: null
        };
    }

    componentWillMount = () => {
        const { workflowUid } = this.props;
        const pageId = this.props.match.params.id;
        this.props.actions.getPageWorkflow(pageId, workflowUid);
    }

    UNSAFE_componentWillReceiveProps = nextProps => {
        const { loading, error, close, workflow, workflowLoading, workflowError } = nextProps;
        const { submitForm } = this.state;

        if (workflowLoading) {
            Swal({
                name: 'Please wait...',
                text: 'We are loading preview...',
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (!workflowLoading) {
            Swal.close();
            if (workflowError) {
                Swal.fire({
                    type: 'error',
                    name: 'Oops...',
                    text: workflowError || 'Something went wrong! Please try again.'
                });
            }
            if (workflow) {
                workflow.steps = transformStepsToLocal(workflow.steps);
                this.setState({
                    workflow
                })
            }
        }

        if (loading) {
            this.setState({
                submitForm: true
            });
            Swal({
                name: 'Please wait...',
                text: 'We are saving the template...',
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
                    type: 'error',
                    name: 'Oops...',
                    text: error || 'Something went wrong! Please try again.'
                });
            } else {
                Swal.fire({
                    type: 'success',
                    name: 'Success!',
                    text:
                        'Template has been created. it will appear in your settings/templates tab.',
                    showConfirmButton: false,
                    timer: 1500
                });
                const self = this;
                setTimeout(() => {
                    self.setState(
                        {
                            name: '',
                            description: '',
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
        this.setState(({ isPublic }) => ({
            isPublic: checked
        }));
        console.log('checkbox-change', this.state.isPublic);
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
        const { name, description, price, category, isPublic } = this.state;
        const { workflow } = this.props;

        const isValid = this._checkValidation();
        if (isValid) {
            let data = {
                workflowUid: workflow.uid,
                name: name,
                description: description,
                videoUrl: '',
                price: isPublic ? price : 0,
                category: category,
                public: isPublic
            };
            this.props.actions.updateTemplate(
                this.props.id,
                this.props.data.uid,
                data
            );
        }
    };
    //#endregion

    render() {
        const pageId = this.props.id;

        const { open, loading } = this.props;
        const { name, workflow, description, price, category, isPublic } = this.state;

        return (
            <Modal
                size="fullscreen"
                className="custom-popup mac-height"
                open={open}
                onClose={() => false}
            >
                <Modal.Header>
                    Create Template{' '}
                    <i
                        aria-hidden="true"
                        class="close small icon close-icon"
                        onClick={this.close}
                    ></i>
                </Modal.Header>
                <Modal.Content>
                    <Block className="create-temp-outer">
                        <Block className="create-temp-left">
                            <Form>
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
                                        // search
                                        selection
                                        onChange={this.handleChangeCategory}
                                        value={category}
                                        options={[
                                            {
                                                key: 1,
                                                value: 'Ecommerce',
                                                text: 'Ecommerce'
                                            },
                                            {
                                                key: 2,
                                                value: 'Digital Products',
                                                text: 'Digital Products'
                                            },
                                            {
                                                key: 3,
                                                value: 'Health & Fitness',
                                                text: 'Health & Fitness'
                                            },
                                            {
                                                key: 4,
                                                value: 'Local Business',
                                                text: 'Local Business'
                                            },
                                            {
                                                key: 5,
                                                value: 'General',
                                                text: 'General'
                                            }
                                        ]}
                                    />
                                    {/* <select
                                                class="ui dropdown"
                                                value={category}
                                                onChange={this.handleChangeCategory}
                                            >
                                                <option value="">
                                                    What category is your sequence
                                            </option>
                                                <option value="ecommerce">
                                                    Ecommerce
                                            </option>
                                                <option value="digital Products">
                                                    Digital Products
                                            </option>
                                                <option value="Health & Fitness">
                                                    Health & Fitness
                                            </option>
                                                <option value="Local Business">
                                                    Local Business
                                            </option>
                                                <option value="general">
                                                    General
                                            </option>
                                            </select> */}
                                </Form.Field>
                                <Form.Field className="mb-4">
                                    <Checkbox
                                        label="Make Publicly Available"
                                        checked={isPublic}
                                        onChange={this.handleCheckChange}
                                    />
                                </Form.Field>
                                {isPublic && (
                                    <Form.Field className="mb-4">
                                        <label>
                                            Price <span> (optional) </span>{' '}
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
                                    className="mt-3"
                                    type="submit"
                                    loading={loading}
                                    onClick={this.publishTemplate}
                                >
                                    Publish Template
                                </Button>
                            </Form>
                        </Block>
                        <Block className="create-temp-right">
                            {workflow &&
                                <ViewOuterDragBoard workflow={workflow} />
                            }
                        </Block>
                    </Block>
                </Modal.Content>
            </Modal>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            updateTemplate,
            getPageWorkflow
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
            workflowError: state.default.workflows.error
        }),
        mapDispatchToProps
    )(EditTemplateModal)
);
