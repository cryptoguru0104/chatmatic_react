import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { getPageFromUrl } from "services/pages/selector";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "components";
class PurchaseLicense extends React.Component {
    state = { isModalOpen: false };

    componentDidMount() {
        this._updateModalOpen(this.props);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { isSumoUser, location, page, billingInfo } = this.props;
        if (
            nextProps.location !== location ||
            JSON.stringify(nextProps.page) != JSON.stringify(page) ||
            JSON.stringify(nextProps.billingInfo) != JSON.stringify(billingInfo)
        ) {
            this._updateModalOpen(nextProps);
        }
    }
    _updateModalOpen = (props) => {
        const { allPlans, match, location, page, billingInfo, isBillingInfoLoading} = props;
        const pageId = match.params.id;
        let isModalOpen = false;

        const freePlan = allPlans ? allPlans.find(p => p.price == 0) : null;
        let freeLimit = 500;
        if(freePlan != null) {
            freeLimit = freePlan.maxSubscribers;
        }
        if(!isBillingInfoLoading && billingInfo && location.pathname.startsWith(`/page/${pageId}`) && !location.pathname.startsWith(`/page/${pageId}/settings/billing`)) {
            if(!billingInfo.licensed && billingInfo.subscription == null && page.subscribers > freeLimit) {
                isModalOpen = true;
            }
        }

        this.setState({ isModalOpen: isModalOpen });
    };

    modalFooter = () => {
        const { match } = this.props;
        const pageId = match.params.id;

        return (
            <ModalFooter>
                <Link
                    to={`/page/${pageId}/settings/billing`}
                    className="btn btn-primary w-100"
                >
                    Upgrade
                </Link>
            </ModalFooter>
        );
    };

    render() {
        const { isSumoUser, match, page } = this.props;
        const { isModalOpen } = this.state;
        const pageId = match.params.id;
        if (isSumoUser) {
            return (
                <Modal isOpen={isModalOpen}>
                    <ModalHeader>AppSumo User</ModalHeader>
                    <ModalBody>
                        <p>
                            Awesome! It looks like you’re growing! Congrats! You
                            currently have {page.subscribers} subscribers and
                            our system requires a license for this page to
                            continue running and collecting subscribers.
                        </p>
                        <p>
                            Please click upgrade below to license this page to
                            keep all automations running
                        </p>
                    </ModalBody>
                    {this.modalFooter()}
                </Modal>
            );
        }
        return (
            <Modal isOpen={isModalOpen}>
                <ModalHeader>Max Subscribers reached</ModalHeader>
                <ModalBody>
                    <p>
                        Awesome! It looks like you’re growing! Congrats! You
                        currently have {page.subscribers} subscribers and our
                        system requires a license for this page to continue
                        running and collecting subscribers.
                    </p>
                    <p>
                        Please click upgrade below to license this page to keep
                        all automations running
                    </p>
                </ModalBody>
                {this.modalFooter()}
            </Modal>
        );
    }
}
PurchaseLicense.propTypes = {
    page: PropTypes.object.isRequired
};
const mapStateToProps = (state, props) => ({
    billingInfo: state.default.settings.billing.billingInfo,
    isBillingInfoLoading: state.default.settings.billing.loading,
    allPlans: state.default.pages.allPlans,
    page: getPageFromUrl(state, props)
});
export default withRouter(connect(mapStateToProps, {})(PurchaseLicense));
