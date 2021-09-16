import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import moment from "moment";
import { Tooltip } from "@material-ui/core";
import { Modal } from "components";
import CheckoutModal from "../../components/CheckoutModal";
import SmsPlans from "../SmsPlans/SmsPlans";
import { cancelSubscription, updatePaymentInfo } from "../../services/actions";
import visaIcon from "assets/images/icon-visa.png";

class AppSumoBillingInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowingCheckoutModal: false
        };
    }

    componentDidUpdate(prevProps) {
        const { billingInfo } = this.props;
        if (prevProps.billingInfo !== billingInfo) {
            this.setState({ isShowingCheckoutModal: false });
        }
    }

    _cancelSubscription = () => {
        Swal({
            title: "Are you sure?",
            text: `Please verify that you want to cancel this subscription.`,
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, please",
            cancelButtonText: "No, I want to keep it",
            confirmButtonColor: "#f02727"
        }).then(result => {
            if (result.value) {
                this.props.actions.cancelSubscription(
                    this.props.match.params.id
                );
            }
        });
    };

    render() {
        const { billingInfo } = this.props;

        // if (!billingInfo || !billingInfo.email) {
        //     return (
        //         <Redirect
        //             to={{
        //                 pathname: `/page/${this.props.match.params.id}/settings/billing`
        //             }}
        //         />
        //     );
        // }

        const lastFourCardNumber = !!billingInfo.cardNumber
            ? billingInfo.cardNumber.slice(-4)
            : "";

        return (
            <div className="d-flex flex-column billing-container">
                <div className="d-flex flex-column billing-content">
                    <div className="d-flex enterprise-account">
                        <div className="d-flex flex-column">
                            <Tooltip arrow title="License Detail tooltip">
                                <h6>License Detail</h6>
                            </Tooltip>
                            <div>
                                <b>This page is licensed</b>
                                {" - "}
                                <span>
                                    used {billingInfo.usedLicenses} of{" "}
                                    {billingInfo.availableLicenses} licenses
                                </span>
                            </div>
                        </div>
                    </div>
                    {!!lastFourCardNumber && (
                        <>
                            <div className="d-flex enterprise-account">
                                <div className="d-flex flex-column">
                                    <h6>{billingInfo.name}</h6>
                                    <span>
                                        active since{" "}
                                        {moment(billingInfo.startDate).format(
                                            "MMMM Do YYYY"
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div className="d-flex billing-email">
                                <div className="d-flex flex-column">
                                    <h6>Billing Email</h6>
                                    <span>{billingInfo.email}</span>
                                </div>
                            </div>
                            <div className="d-flex flex-column payment-info">
                                <div className="d-flex flex-column justify-content-between payment-info-content p-4">
                                    <h6>Billing Info</h6>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <img src={visaIcon} alt="" />
                                            <span className="ml-4">
                                                VISA - {lastFourCardNumber}
                                            </span>
                                        </div>
                                        <span>{billingInfo.cardExp}</span>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center align-items-center payment-info-footer">
                                    <button
                                        className="btn btn-link text-primary font-weight-normal p-0"
                                        onClick={() =>
                                            this.setState({
                                                isShowingCheckoutModal: true
                                            })
                                        }
                                    >
                                        Update Payment Info
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <SmsPlans />
                <Modal isOpen={this.state.isShowingCheckoutModal}>
                    <CheckoutModal
                        updatePaymentInfo={true}
                        close={() =>
                            this.setState({ isShowingCheckoutModal: false })
                        }
                    />
                </Modal>
            </div>
        );
    }
}

AppSumoBillingInfo.propTypes = {
    billingInfo: PropTypes.object,
    actions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    billingInfo: state.default.settings.billing.billingInfo
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            cancelSubscription,
            updatePaymentInfo
        },
        dispatch
    )
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(AppSumoBillingInfo)
);
