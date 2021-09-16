import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import { toastr } from "react-redux-toastr";
import PropTypes from "prop-types";
import { Grid } from '@material-ui/core';
import { getBillingInfo } from "./services/actions";
import Subscription from "./scenes/Subscription";
import BillingInfo from "./scenes/BillingInfo";

import "./styles.css";

class Billing extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            initialLoad: true
        };
    }
    componentDidMount() {
        const { actions, loading, match } = this.props;
        actions.getBillingInfo(match.params.id);
    }
    showLoading = () => {
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
    };

    componentDidUpdate(prevProps) {
        // const { error, loading } = this.props;
        // if (loading && !prevProps.loading) {
        //     this.showLoading();
        // } else if (prevProps.loading && !loading) {
        //     this.setState({ initialLoad: false });
        //     Swal.close();
        //     if (error) {
        //         toastr.error(error);
        //     }
        // }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { loading, error } = nextProps;

        if(loading != this.props.loading) {
            if(loading) this.showLoading();
            else Swal.close();
        }
        
        if(error != this.props.error ) {
            if(error) toastr.error(error);
        }
    }

    render() {
        const { billingInfo, isSumoUser } = this.props;
        const { initialLoad } = this.state;
        const showBilling = !!billingInfo && !!billingInfo.email;

        if(billingInfo == null) {
            return null;
        }

        // return isSumoUser ? <AppSumoSubscription /> : <Subscription />;
        return (<div className="billing-container"><div>
            <Grid container direction="column" justify="flex-start" alignItems="stretch" spacing={1}>
                <Grid item>
                    <BillingInfo />
                </Grid>
                <Grid item>
                    <Subscription />
                </Grid>
            </Grid></div></div>);
    }
}

Billing.propTypes = {
    billingInfo: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    isSumoUser: PropTypes.bool.isRequired,
    error: PropTypes.any,
    actions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    billingInfo: state.default.settings.billing.billingInfo,
    isSumoUser: state.default.pages.isSumoUser,
    loading: state.default.settings.billing.loading,
    error: state.default.settings.billing.error
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            getBillingInfo
        },
        dispatch
    )
});

export default connect(mapStateToProps, mapDispatchToProps)(Billing);
