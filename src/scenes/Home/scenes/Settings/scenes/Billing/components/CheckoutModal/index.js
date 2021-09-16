import React from 'react';
import { StripeProvider, Elements } from 'react-stripe-elements';
import PropTypes from 'prop-types';

import StripeForm from '../StripeForm';

class CheckoutModal extends React.Component {
  render() {
    return (
      <StripeProvider apiKey={process.env.REACT_APP_STRIPE_KEY}>
        <Elements>
          <StripeForm
            plan={this.props.plan}
            close={this.props.close}
            updatePaymentInfo={this.props.updatePaymentInfo}
          />
        </Elements>
      </StripeProvider>
    );
  }
}

CheckoutModal.propTypes = {
  updatePaymentInfo: PropTypes.bool,
  plan: PropTypes.string,
  close: PropTypes.func.isRequired
};

CheckoutModal.defaultProps = {
  updatePaymentInfo: false,
  plan: ''
};

export default CheckoutModal;
