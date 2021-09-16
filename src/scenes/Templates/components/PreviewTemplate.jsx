import React, { Component } from "react";
import { Form, Button } from "semantic-ui-react";
import { toastr } from "react-redux-toastr";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import Swal from "sweetalert2";
import { connect } from "react-redux";
import Header from "../../components/Header";
import { StripeProvider, Elements } from "react-stripe-elements";

import { Block } from "../../Home/Layout";
import ViewOuterDragBoard from "../../Home/WorkFlows/components/ViewOuterDragBoard";
import { addTemplate } from "../../Home/scenes/Settings/scenes/Templates/services/actions";
import { transformStepsToLocal } from "services/workflows/transformers";
import {
    getPageTemplatePreview,
    buyPageTemplate
} from "services/workflows/workflowsActions";
import StripeCardModal from "../../Home/WorkFlows/components/StripeCardModal";
import ViewAddedCards from "../../Home/WorkFlows/components/ViewAddedCards";
import { getUserCards } from "services/auth/authActions";
import PageSelector from "./PageSelector";
import querystring from "querystring";
import logo from "assets/images/logo.png";
import "../style.scss";
import "semantic-ui-css/semantic.min.css";

class PreviewTemplate extends Component {
    //#region life cycle method
    constructor(props) {
        super(props);
        const {
            location: { search }
        } = props;
        const queries = querystring.parse(search.slice(1, search.length));
        this.state = {
            isPublic: false,
            purchasing: false,
            addingTemplate: false,
            template: null,
            src: null,
            showAddedCards: false,
            newSource: false,
            showPageSelector: !!queries.selectPage
        };
        this.messenger = React.createRef();
    }

    componentWillMount = () => {
        const uid = this.props.match.params.id;
        this.props.actions.getUserCards();
        this.props.actions.getPageTemplatePreview(uid);
    };

    componentDidMount() {
        this.initPreviewButton();
    }

    initPreviewButton = () => {
        const facebook_init = document.createElement("script");
        facebook_init.innerHTML = `window.fbAsyncInit=function(){FB.init({appId:'${process.env.REACT_APP_FACEBOOK_APP_ID}',autoLogAppEvents:true,xfbml:true,version:'v9.0'});};`;

        const facebook_sdk = document.createElement("script");
        facebook_sdk.src = "https://connect.facebook.net/en_US/sdk.js";
        facebook_sdk.async = true;
        this.messenger.current.prepend(facebook_sdk);
        this.messenger.current.prepend(facebook_init);
    };

    UNSAFE_componentWillReceiveProps = nextProps => {
        const {
            loading,
            error,
            template,
            workflowLoading,
            workflowError,
            templateCode
        } = nextProps;
        const { purchasing, addingTemplate, pageId } = this.state;
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
                    text:
                        "Template has been purchased and added to your templates. it will appear in your settings/templates tab."
                    // showConfirmButton: false,
                    // timer: 1500
                }).then(() => {
                    nextProps.history.push(nextProps.match.url);
                });
            }
        }
    };
    //#endregion

    handleSource = src => {
        this.setState(
            {
                src,
                showCardModal: false,
                newSource: true
            },
            () => {
                this.completePurchase();
            }
        );
    };

    handleOldSource = src => {
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
        const { stripeSources } = this.props;
        if (stripeSources && stripeSources.length > 0) {
            const self = this;
            Swal({
                title: "Alert",
                text: "Do you want to use other card for this transaction?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Use New",
                cancelButtonText: "Use Same",
                confirmButtonColor: "#274bf0"
            }).then(result => {
                if (result.value) {
                    self.setState({
                        showCardModal: true
                    });
                } else {
                    // self.completePurchase();
                    self.setState({
                        showAddedCards: true
                    });
                }
            });
        } else {
            this.setState({
                showCardModal: true
            });
        }
    };

    completePurchase = () => {
        const uid = this.props.match.params.id;
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
        // Swal({
        //     title: 'Are you sure?',
        //     text: 'Please verify that you want to purchase this template',
        //     type: 'warning',
        //     showCancelButton: true,
        //     confirmButtonText: 'Confirm',
        //     cancelButtonText: 'Cancel',
        //     confirmButtonColor: '#274bf0'
        // }).then(result => {
        //     if (result.value) {
        //         self.setState({
        //             purchasing: true
        //         }, () => {
        //             self.props.actions.buyPageTemplate(pageId, uid, self.state.src);
        //         });
        //     }
        // });
    };

    handleClosePageSelector = () => {
        this.setState({ showPageSelector: false });
    };

    handleSelectPages = () => {
        if (!!this.props.auth.currentUser && !!this.props.auth.apiToken)
            this.setState({ showPageSelector: true });
        else
            this.props.history.push(
                "/login?redirectUrl=" +
                    this.props.match.url +
                    "?selectPage=true"
            );
    };

    selectPage = pageId => {
        this.setState({ pageId, showPageSelector: false });
        this.handlePurchaseTemplate();
    };

    render() {
        const { loading } = this.props;
        const {
            template,
            showCardModal,
            showAddedCards,
            showPageSelector
        } = this.state;

        return (
            <div className="d-flex flex-column position-relative template-container">
                <ViewAddedCards
                    open={showAddedCards}
                    source={this.handleOldSource}
                    close={() => this.setState({ showAddedCards: false })}
                />
                <PageSelector
                    open={showPageSelector}
                    closeModal={this.handleClosePageSelector}
                    selectPage={this.selectPage}
                />
                <StripeProvider apiKey={process.env.REACT_APP_STRIPE_KEY}>
                    <Elements>
                        <StripeCardModal
                            open={showCardModal}
                            close={() =>
                                this.setState({ showCardModal: false })
                            }
                            source={this.handleSource}
                        />
                    </Elements>
                </StripeProvider>
                <Block className="mac-height section">
                    <Block className="section-header">Preview Template</Block>
                    <Block className="section-body">
                        <Block className="template-view">
                            <Block className="view-left">
                                {template && (
                                    <Form>
                                        <Form.Field className="mb-4">
                                            <label>Title:</label>{" "}
                                            {template.name}
                                        </Form.Field>
                                        <Form.Field className="mb-4">
                                            <label>Category: </label>{" "}
                                            {template.category}
                                        </Form.Field>
                                        <Form.Field className="mb-4">
                                            <label>Details: </label>{" "}
                                            {template.description}
                                        </Form.Field>
                                        <Form.Field className="mb-4">
                                            <label>Price: </label> $
                                            {template.price}
                                        </Form.Field>
                                        <Button
                                            className="mt-3 primary"
                                            type="submit"
                                            loading={loading}
                                            onClick={this.handleSelectPages}
                                        >
                                            Purchase This Template
                                        </Button>
                                    </Form>
                                )}
                            </Block>
                            <Block className="view-right">
                                <Block className="board-view">
                                    {template ? (
                                        <React.Fragment>
                                            <ViewOuterDragBoard
                                                workflow={template}
                                            />
                                            <h3 className="template-name">
                                                {template.name}
                                            </h3>
                                        </React.Fragment>
                                    ) : null}
                                    <img
                                        src={logo}
                                        alt=""
                                        className="chatmatic-logo"
                                    />
                                    <div
                                        className="preview-button"
                                        ref={this.messenger}
                                    >
                                        <div className="real-button">
                                            Test template
                                        </div>
                                        <div
                                            className="fb-send-to-messenger"
                                            messenger_app_id={
                                                process.env
                                                    .REACT_APP_FACEBOOK_APP_ID
                                            }
                                            page_id="1707176109573497"
                                            data-ref={
                                                "template_test::" +
                                                this.props.match.params.id
                                            }
                                            color="blue"
                                            size="large"
                                        >
                                            {" "}
                                        </div>
                                    </div>
                                </Block>
                            </Block>
                        </Block>
                    </Block>
                </Block>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            getPageTemplatePreview,
            buyPageTemplate,
            addTemplate,
            getUserCards
        },
        dispatch
    )
});

export default withRouter(
    connect(
        state => ({
            auth: state.default.auth,
            loading: state.default.settings.templates.loading,
            error: state.default.settings.templates.error,
            template: state.default.workflows.template,
            workflowLoading: state.default.workflows.loading,
            workflowError: state.default.workflows.error,
            templateCode: state.default.workflows.templateCode,
            stripeSources: state.default.auth.stripeSources
        }),
        mapDispatchToProps
    )(PreviewTemplate)
);
