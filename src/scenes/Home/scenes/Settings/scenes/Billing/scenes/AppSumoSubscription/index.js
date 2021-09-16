import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { toastr } from "react-redux-toastr";
import { getBillingInfo } from "../../services/actions";
import SmsPlans from "../SmsPlans/SmsPlans";
import { getPageFromUrl } from "services/pages/selector";
import { postAppSumoLicense } from "../../services/actions";

class AppSumoSubscription extends React.Component {
    constructor(props) {
        super(props);
        console.log("props", props);
        this.state = {
            isShowingCheckoutModal: false,
            plan: null
        };
    }

    componentDidMount() {
        //this.props.actions.getBillingInfo(this.props.match.params.id);
    }

    componentDidUpdate(prevProps) {
        const { history, match, sumoError, sumoLoading } = this.props;
        if (sumoLoading) {
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
        } else if (prevProps.sumoLoading) {
            Swal.close();
            if (sumoError) {
                toastr.error(sumoError);
            }
            // history.push(
            //     `/page/${match.params.id}/settings/billing/billing-info`
            // );
        }
    }

    handleActivate = e => {
        e.preventDefault();
        const { actions, match } = this.props;
        actions.postAppSumoLicense(match.params.id);
    };

    render() {
        const { page, remainingLicenses } = this.props;
        return (
            <div
                className="d-flex justify-content-center align-items-center payment-level-container"
                data-aos="fade"
            >
                <div>
                    <p className="mb-0 ml-3 title-heading">License</p>
                    <div
                        className="d-flex flex-md-row flex-column justify-content-center align-items-center  mt-0 card-container"
                        style={{ width: "350px", margin: "0 auto" }}
                    >
                        <div className="d-flex flex-column card-content">
                            <div className="flex-grow-1">
                                {remainingLicenses <= 0 ? (
                                    <span className="subscribers-count">
                                        You're out of licenses
                                    </span>
                                ) : (
                                    <span className="subscribers-count">
                                        You have {remainingLicenses} licenses
                                        remaining. Click below to license this
                                        page.
                                    </span>
                                )}
                            </div>
                            <div>
                                <button
                                    ref="monthlyActivate"
                                    className="btn btn-link w-100"
                                    disabled={remainingLicenses <= 0}
                                    onClick={this.handleActivate}
                                >
                                    License with App Sumo
                                </button>
                            </div>
                        </div>
                    </div>
                    <SmsPlans />
                </div>
            </div>
        );
    }
}

AppSumoSubscription.propTypes = {
    actions: PropTypes.object.isRequired,
    billingInfo: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.any,
    page: PropTypes.object.isRequired,
    sumoError: PropTypes.any,
    sumoLoading: PropTypes.bool.isRequired,
    remainingLicenses: PropTypes.number.isRequired
};

const mapStateToProps = (state, props) => ({
    billingInfo: state.default.settings.billing.billingInfo,
    sumoLoading: state.default.settings.billing.appSumoLoading,
    loading: state.default.settings.billing.loading,
    sumoError: state.default.settings.billing.appSumoError,
    error: state.default.settings.billing.error,
    page: getPageFromUrl(state, props),
    remainingLicenses:
        (state.default.pages.availableLicenses || 0) -
        (state.default.pages.usedLicenses || 0)
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            getBillingInfo,
            postAppSumoLicense
        },
        dispatch
    )
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(AppSumoSubscription)
);
