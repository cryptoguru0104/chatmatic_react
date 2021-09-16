import React, { Component } from "react";
import { Form } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import Swal from "sweetalert2";
import { connect } from "react-redux";


import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Grid, Button } from '@material-ui/core';

import { getPageFromUrl } from "services/pages/selector";

import { Block, Svg } from "../../Layout";
import ViewOuterDragBoard from "./ViewOuterDragBoard";
import { addTemplate } from "../../scenes/Settings/scenes/Templates/services/actions";
import { transformStepsToLocal } from "services/workflows/transformers";
import {
    getPageTemplate,
    buyPageTemplate,
    clonePageTemplateSumo
} from "services/workflows/workflowsActions";
import { getBillingInfo } from "scenes/Home/scenes/Settings/scenes/Billing/services/actions";
import ViewAddedCards from "./ViewAddedCards";
import { HtmlModal } from "../../Triggers/components";

import './PreviewTemplateModal.scss';
import PageSelector from "../../../Templates/components/PageSelector";

class PreviewTemplateModal extends Component {
    //#region life cycle method
    constructor(props) {
        super(props);
        const pageId = this.props.match.params.id;
        this.state = {
            name: "",
            description: "",
            category: null,
            price: props.templateData.price || 0,
            category: props.templateData.category || "",
            isPublic: false,
            purchasing: false,
            addingTemplate: false,
            template: null,
            src: null,
            showAddedCards: false,
            newSource: false,
            isOpenShareUrlPopUp: false,
            isPageSelectorOpen: false,
            pageId: pageId
        };
    }

    componentWillMount = () => {
        const {
            templateData: { uid }
        } = this.props;
        const pageId = this.props.match.params.id;
        // this.props.actions.getUserCards();
        this.props.actions.getPageTemplate(pageId, uid);
        if(pageId) this.props.actions.getBillingInfo(pageId);
    };

    UNSAFE_componentWillReceiveProps = nextProps => {
        const {
            loading,
            error,
            close,
            isSumoUser,
            template,
            workflowLoading,
            workflowError,
            templateCode
        } = nextProps;
        const { purchasing, addingTemplate } = this.state;
        let pageId = this.state.pageId;
        if(this.props.match.params.id) pageId = this.props.match.params.id;
        if (workflowLoading && !purchasing) {
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
        } else if (workflowLoading && purchasing) {
            Swal({
                name: "Please wait...",
                text: "Purchasing template in progress...",
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
                    type: "error",
                    name: "Oops...",
                    text:
                        workflowError ||
                        "Something went wrong! Please try again."
                });
            } else {
                if (purchasing) {
                    this.setState(
                        {
                            purchasing: false,
                            addingTemplate: true
                        },
                        () =>
                            this.props.actions.addTemplate(pageId, templateCode)
                    );
                } else if (template) {
                    template.steps = transformStepsToLocal(template.steps);
                    this.setState({
                        template
                    });
                }
            }
        }
        if (loading && addingTemplate) {
            Swal({
                name: "Please wait...",
                text: "Purchasing template in progress...",
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (!loading && addingTemplate) {
            Swal.close();
            this.setState({ addingTemplate: false });
            if (error) {
                Swal.fire({
                    type: "error",
                    name: "Oops...",
                    text:
                        workflowError ||
                        "Something went wrong! Please try again."
                });
            } else {
                Swal.fire({
                    type: "success",
                    name: "Success!",
                    text: isSumoUser
                        ? "Template has been cloned and has been added to your workflows"
                        : "Template has been purchased and added to your templates. it will appear in your settings/templates tab."
                    // showConfirmButton: false,
                    // timer: 1500
                });
                // close();
            }
        }
    };
    //#endregion

    //#region functionality
    close = () => this.props.close();
    //#endregion

    handlePurchaseWithCard = src => {
        this.setState(
            {
                src,
                showAddedCards: false,
                newSource: false
            },
            () => {
                this.completePurchase();
            }
        );
    };


    handlePurchaseTemplate = () => {
        const pageId = this.props.match.params.id;
        if(pageId) {
            this.setState({
                showAddedCards: true
            });
        }
        else {
            this.setState({
                isPageSelectorOpen: true
            });
        }
    };

    completePurchase = () => {
        const {
            templateData: { uid }
        } = this.props;
        const { pageId } = this.state;
        const self = this;
        self.setState(
            {
                purchasing: true
            },
            () => {
                const { newSource } = this.state;
                const data = {
                    src: self.state.src,
                    newSource
                };
                self.props.actions.buyPageTemplate(pageId, uid, data);
            }
        );
    };
    onSelectPage = (pageId) => {        
        this.props.actions.getBillingInfo(pageId);
        this.setState({
            pageId: pageId,
            isPageSelectorOpen: false,
            showAddedCards: true
        });
    }

    closeShareUrlModal = () => {
        this.setState({ isOpenShareUrlPopUp: false });
    };

    openShareUrlPopup = () => {
        this.setState({ isOpenShareUrlPopUp: true });
    };

    render() {
        const { isSumoUser, open, loading } = this.props;
        const {
            price,
            category,
            template,
            showCardModal,
            showAddedCards,
            isOpenShareUrlPopUp,
            isPageSelectorOpen,
            pageId
        } = this.state;

        const share_url =
            window.location.origin + "/template/" + this.props.templateData.uid;

        return (
            <React.Fragment>
                {showAddedCards && <ViewAddedCards
                    open={showAddedCards}
                    pageId={pageId}
                    onSelectCard={this.handlePurchaseWithCard}
                    close={() => this.setState({ showAddedCards: false })}
                />}
                {isPageSelectorOpen && <PageSelector 
                    open={isPageSelectorOpen}
                    source={this.props.templateData.source}
                    closeModal={() => this.setState({isPageSelectorOpen: false})}
                    selectPage={this.onSelectPage}
                />}
                <HtmlModal
                    html={share_url}
                    open={isOpenShareUrlPopUp}
                    close={this.closeShareUrlModal}
                />
                <Dialog
                    maxWidth="xl"
                    fullWidth={true}
                    className="custom-popup mac-height preview-template-modal-container"
                    open={open}
                    onClose={() => false}
                >
                    <DialogContent>
                        <Grid container justify="space-between">
                            <h2>
                            Preview Template
                            </h2>
                            <Button onClick={this.close} className="btn-close">
                            <Svg name="modal-close" />
                        </Button>
                        </Grid>
                        <hr />
                        <Grid container justify="flex-start" alignItems="stretch" className="preview-template-modal-content-container">
                            <Grid item className="preview-templates-info-container">
                                {template && (
                                    <Form>
                                        <Form.Field className="mb-4">
                                            <label>Title:</label>{" "}
                                            {template.name}
                                        </Form.Field>
                                        <Form.Field className="mb-4">
                                            <label>Category: </label> {category}
                                        </Form.Field>
                                        <Form.Field className="mb-4">
                                            <label>Details: </label>{" "}
                                            {template.description}
                                        </Form.Field>
                                        <Form.Field className="mb-4 price-field">
                                            <label>Price: </label> ${price}
                                        </Form.Field>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className="mt-3"
                                            type="submit"
                                            loading={loading}
                                            onClick={this.handlePurchaseTemplate}
                                            className="btn-purchase-template"
                                        >Purchase This Template</Button>
                                        <Button
                                            variant="contained"
                                            className="mt-3"
                                            className="btn-purchase-share-url"
                                            onClick={this.openShareUrlPopup}
                                        >
                                            Share This Template
                                        </Button>
                                    </Form>
                                )}
                            </Grid>
                            <Grid item className="preview-templates-workflow-container">
                                {template && (
                                    <ViewOuterDragBoard workflow={template} />
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
            getPageTemplate,
            buyPageTemplate,
            clonePageTemplateSumo,
            addTemplate,
            // getUserCards,
            getBillingInfo
        },
        dispatch
    )
});

export default withRouter(
    connect(
        (state, props) => ({
            isSumoUser: state.default.pages.isSumoUser,
            loading: state.default.settings.templates.loading,
            error: state.default.settings.templates.error,
            template: state.default.workflows.template,
            workflowLoading: state.default.workflows.loading,
            workflowError: state.default.workflows.error,
            templateCode: state.default.workflows.templateCode,
            // stripeSources: state.default.auth.stripeSources,
            page: getPageFromUrl(state, props),
        }),
        mapDispatchToProps
    )(PreviewTemplateModal)
);
