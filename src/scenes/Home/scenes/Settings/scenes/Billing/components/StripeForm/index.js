import React from 'react';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { injectStripe, CardElement } from 'react-stripe-elements';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

import {
  postLicense,
  postCoupon,
  updatePaymentInfo
} from '../../services/actions';

import './styles.css';

class StripeForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      price: props.plan === 'monthly' ? '$97.00' : '$997.00'
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.loadingCoupon) {
      Swal({
        title: 'Please wait...',
        text: 'Submitting coupon code...',
        onOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
    } else if (this.props.loadingCoupon) {
      Swal.close();

      if (nextProps.errorCoupon) {
        toastr.error('Invalid Coupon code', nextProps.errorCoupon);
      } else if (nextProps.price !== null) {
        const price = `$${nextProps.price.toFixed(2)}`;

        this.setState({ price });
      }
    }
  }

  handleSubmit = event => {
    event.preventDefault();

    this.props.stripe
      .createSource({ type: 'card' })
      .then(({ source }) => {
        if (this.props.updatePaymentInfo) {
          this.props.actions.updatePaymentInfo(
            this.props.match.params.id,
            source.id
          );
        } else {
          this.props.actions.postLicense(this.props.match.params.id, {
            plan: this.props.plan,
            src: source.id,
            coupon: this.couponRef.value
          });
        }
      })
      .catch(error => {
        if (typeof error === 'string') {
          toastr.error('Error', error);
        } else {
          toastr.error('Error', 'Invalid Token');
        }
      });
  };

  _postCoupon = event => {
    event.preventDefault();

    if (this.couponRef.value) {
      this.props.actions.postCoupon(
        this.props.match.params.id,
        this.props.plan,
        this.couponRef.value
      );
    }
  };

  render() {
    const subscriptionUnit = this.props.plan === 'monthly' ? 'mo' : 'yr';

    return (
      <form
        onSubmit={this.handleSubmit}
        className="p-5 position-relative billing-form"
      >
        <div
          className="position-absolute btn btn-link btn-modal-close"
          onClick={this.props.close}
        >
          <i className="fa fa-close" />
        </div>
        {!this.props.updatePaymentInfo && (
          <h3 className="text-center mb-0">Subscribe to Chatmatic</h3>
        )}
        {!this.props.updatePaymentInfo && (
          <p className="text-center text-dark">
            ({this.state.price}/{subscriptionUnit})
          </p>
        )}
        {this.props.updatePaymentInfo && (
          <h3 className="text-center mb-4">Update Payment Info</h3>
        )}
        <div className="row mb-3">
          <div className="col-12">
            <label>Card details</label>
            <CardElement />
          </div>
        </div>
        {!this.props.updatePaymentInfo && (
          <div className="row mb-4">
            <div className="col-12 position-relative">
              <label>Coupon:</label>
              <input
                type="text"
                className="w-100"
                ref={ref => (this.couponRef = ref)}
              />
              <button
                name="btn-coupon-apply"
                className="btn btn-sm btn-primary position-absolute btn-coupon-apply"
                onClick={this._postCoupon}
              >
                Apply
              </button>
            </div>
          </div>
        )}
        <div className="row justify-content-end">
          <button name="btn-subscribe" className="btn btn-primary">
            {this.props.updatePaymentInfo ? 'Update' : 'Subscribe'}
          </button>
        </div>
      </form>
    );
  }
}

StripeForm.propTypes = {
  updatePaymentInfo: PropTypes.bool.isRequired,
  plan: PropTypes.string,
  price: PropTypes.number,
  loadingCoupon: PropTypes.bool.isRequired,
  errorCoupon: PropTypes.any,
  actions: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  price: state.default.settings.billing.price,
  loadingCoupon: state.default.settings.billing.loadingCoupon,
  errorCoupon: state.default.settings.billing.errorCoupon
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      postLicense,
      postCoupon,
      updatePaymentInfo
    },
    dispatch
  )
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(injectStripe(StripeForm))
);
