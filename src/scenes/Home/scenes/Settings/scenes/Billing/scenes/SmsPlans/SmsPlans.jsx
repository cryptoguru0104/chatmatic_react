import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Swal from "sweetalert2";
import { StripeProvider, Elements } from "react-stripe-elements";

import { getSmsPlan, postSmsPlan } from "../../services/actions";
import { getUserCards } from "services/auth/authActions";
import StripeCardModal from "../../../../../../WorkFlows/components/StripeCardModal";
import ViewAddedCards from "../../../../../../WorkFlows/components/ViewAddedCards";
import { getPages } from "services/pages/pagesActions";

import './styles.scss';

class SmsPlans extends Component {
    constructor(props) {
        super(props);
        this.state = {
            plan: null,
            src: null,
            showCardModal: false,
            showAddedCards: false,
            purchasing: false,
            newSource: false
        };
    }

    componentDidMount = () => {
        this.props.actions.getSmsPlan(this.props.match.params.id);
        this.props.actions.getUserCards();
    };

    UNSAFE_componentWillReceiveProps = ({ loading, error }) => {
        const { purchasing } = this.state;
        if (loading && purchasing) {
            Swal({
                name: "Please wait...",
                text: "we are progress your request...",
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (!loading && purchasing) {
            this.setState({ purchasing: false });
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
                    text: "Your request has been completed successfully"
                });
                this.props.actions.getSmsPlan(this.props.match.params.id);
                this.props.actions.getPages(true);
            }
        }
    };

    handleSmsPlan = plan => () => {
        console.log("plan", plan);
        this.setState({
            plan
        });
        this.handlePurchaseSmsPlan();
    };

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

    handlePurchaseSmsPlan = () => {
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
        const pageId = this.props.match.params.id;
        const self = this;
        self.setState(
            {
                purchasing: true
            },
            () => {
                const { plan, src, newSource } = this.state;
                self.props.actions.postSmsPlan(pageId, {
                    plan,
                    src,
                    autorenew: false,
                    newSource
                });
            }
        );
    };

    render() {
        const { showCardModal, showAddedCards } = this.state;
        const { smsPlan } = this.props;

        const isSmsPlan =
            smsPlan && smsPlan.smsResume && smsPlan.smsResume.balance;

        if (isSmsPlan) {
            return (
                <div className="smsPlanDetail">
                    <h3>SMS Plan Details</h3>
                    <p>
                        <b>Balance: </b> ${smsPlan.smsResume.balance}
                    </p>
                </div>
            );
        }

        return (
            <div className="sms-plan-container">
                <ViewAddedCards
                    open={showAddedCards}
                    source={this.handleOldSource}
                    close={() => this.setState({ showAddedCards: false })}
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
                
                <div className="title-container">
                        <h2>SMS Plans</h2>
                        <div className="desc">Chatmatic gives you everything you need to build your world!</div>
                    </div>
                <div className="d-flex flex-md-row flex-column justify-content-start align-items-md-end align-items-center w-100 mt-0 card-container">
                    <div className="d-flex flex-column card-content">
                        <div className="d-flex justify-content-between mb-3 membership-info">
                            <span>Starter Plan</span>
                            <span>$20</span>
                        </div>
                        <p className="subscribers-count">
                            Include individual phone number (one time charge)
                            <span>8,500 SMS messages</span>
                        </p>
                        <button
                            onClick={this.handleSmsPlan("starter")}
                            className="btn btn-link buy-button"
                        >
                            Buy
                        </button>
                    </div>
                    <div className="d-flex flex-column card-content">
                        <div className="d-flex justify-content-between mb-3 membership-info">
                            <span>Basic Plan</span>
                            <span>$40</span>
                        </div>
                        <p className="subscribers-count">
                            Includes individual phone number (one time charge)
                            <span>20,000 SMS messages</span>
                        </p>
                        <button
                            onClick={this.handleSmsPlan("basic")}
                            className="btn btn-link buy-button"
                        >
                            Buy
                        </button>
                    </div>
                    <div className="d-flex flex-column card-content">
                        <div className="d-flex justify-content-between mb-3 membership-info">
                            <span>Advanced Plan</span>
                            <span>$100</span>
                        </div>
                        <p className="subscribers-count">
                            Includes individual phone number (one time charge)
                            <span>50,000 SMS Messages</span>
                        </p>
                        <button
                            onClick={this.handleSmsPlan("advanced")}
                            className="btn btn-link buy-button"
                        >
                            Buy
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    smsPlan: state.default.settings.billing.smsPlan,
    loading: state.default.settings.billing.loading,
    error: state.default.settings.billing.error,
    stripeSources: state.default.auth.stripeSources
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            getSmsPlan,
            postSmsPlan,
            getUserCards,
            getPages
        },
        dispatch
    )
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(SmsPlans)
);
