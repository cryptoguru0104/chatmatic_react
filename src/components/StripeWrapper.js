import React from 'react';
import { StripeProvider, Elements } from 'react-stripe-elements';

const StripeWrapper = (props) => {
  return (
    <StripeProvider apiKey={process.env.REACT_APP_STRIPE_KEY}>
      <Elements>
        {props.children}
      </Elements>
    </StripeProvider>
  );
};

export default StripeWrapper;
