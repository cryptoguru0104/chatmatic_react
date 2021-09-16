import React from 'react';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { injectStripe, CardElement } from 'react-stripe-elements';
import PropTypes from 'prop-types';

import {
  postCoupon,
  addBillingCard,
  clearCouponInput,
  subscribeStripe
} from '../../services/actions';

import './styles.scss';
import { Svg } from '../../../../../../Layout';
import { Grow } from '@material-ui/core';
import CheckCircle from '@material-ui/icons/CheckCircle';
import CardForm from "../CardForm";
import StripeWrapper from '../../../../../../../../components/StripeWrapper';

class SubscriptionForm extends React.Component {
  constructor(props) {
    super(props);

    const { billingInfo } = props;

    let activeCard = null;
    if(billingInfo && billingInfo.cards) {
      activeCard = billingInfo.cards.find(c => c.status == 'active');
    }

    this.state={
      activeCardId: activeCard ? activeCard.uid : null,
      isAddNewCard: false,
      couponCode: '',
      isApplying: false,
      isCardFormVisible: false,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
  }

  componentWillUnmount() {
    this.props.actions.clearCouponInput();
  }

  handleSubmit=event => {
    const { close, onSuccess, plan_type }=this.props;
    const { activeCardId, couponCode } = this.state;
    const { billingInfo } = this.props;
    event.preventDefault();
    this.props.actions.subscribeStripe(
      this.props.match.params.id,
      plan_type,
      activeCardId,
      couponCode,
      billingInfo.subscription ? true : false,
    )
    this.props.close();
  };

  renderCard=(card, i) => {
    const { activeCardId }=this.state;
    const isActive=activeCardId == card.uid;
    const cardBrand="card-brand-" + card.card.brand.toLowerCase().replace(' ', '');

    return (<div className="subscription-card" key={i} onClick={() => this.setState({
      activeCardId: card.uid
    })}>
      <div className="subscription-card-brand">
        <Svg name={cardBrand} />
      </div>
      <div className="card-no">**** **** **** {card.card.last4}</div>
      <div className="subscription-card-check">
        {isActive && <CheckCircleIcon />}
      </div>
    </div>);
  };

  _postCoupon=event => {
    event.preventDefault();
    if(this.state.couponCode == ''){
      return;
    }
    const { activeCardId, couponCode } = this.state;
    this.props.actions.postCoupon(
      this.props.match.params.id,
      this.props.plan,
      activeCardId,
      couponCode
    );
    
  };

  onAddNewCard = () => {
    this.setState({
      isCardFormVisible: true
    });
  };

  render() {
    const { billingInfo, plan, close, coupon, errorCoupon, isApplying }=this.props;
    const { couponCode, activeCardId, isCardFormVisible }=this.state;
    return (
      <Dialog maxWidth="md" open={true} onClose={close} className="subscription-form-container">
        <DialogContent>
          {isCardFormVisible && <StripeWrapper><CardForm cardToken={null} onSuccess={() => {}} close={() => this.setState({
            isCardFormVisible: false})}/></StripeWrapper>}
          <div className="subscription-form-content">
            <Grid container justify="flex-end">
              <Button onClick={close} className="btn-close">
                <Svg name="modal-close" />
              </Button>
            </Grid>
            <h2>
              Subscribe to {plan.name}
            </h2>
            <Grid container alignItems="center" justify="center">
              <div className="subscription-form-price">
                <p className="form-price">${plan.price}</p>
              </div>
              <div className="subscription-form-period">
                {plan.period == 'PER_MONTH' && '/mo'}
                {plan.period == 'PER_YEAR' && '/yr'}
              </div>
            </Grid>
            <h5>Your Cards</h5>
            <div className="subscription-card-list">
              {billingInfo.cards.map((card, i) => this.renderCard(card, i))}
            </div>
            <Button className="new-card-button" onClick={() => this.onAddNewCard()}>
              Add New Card
            </Button>
            <h5>Coupon Code</h5>
            { 
              (coupon == null && errorCoupon == null) &&
              <div className="subscription-coupon-code">
                <input 
                  type="text"
                  value={couponCode} 
                  className="coupon-code" 
                  onChange={(e) => this.setState({ couponCode: e.target.value})} 
                  placeholder="Your Code"
                />
                <div className="coupon-code-apply" onClick={this._postCoupon}>Apply</div>
              </div>
            }
            {
              (coupon != null && errorCoupon == null) && 
              <div className="subscription-coupon-code">
                <div className="valid-coupon-code">
                  Code Activate! Save {coupon.amountOff ? '$' + coupon.amountOff : coupon.percentOff + '%'}
                </div>
                <div className="coupon-code-apply"><Svg name="checkbox" /></div>
              </div>
            }
            {
              (coupon == null && errorCoupon != null) &&
              <div className="subscription-coupon-code">
                <div 
                  className="invalid-coupon-code" 
                  onClick={() => { this.props.actions.clearCouponInput();
                  this.setState({couponCode: ''});}}>
                  {errorCoupon}
                </div>
                <div className="coupon-code-apply" disabled={true}>Apply</div>
              </div>
            }
            <div className="subscription-btn-container">
              <Button 
                className="btn-submit" 
                variant="contained" color="primary" 
                onClick={this.handleSubmit} 
                disabled={errorCoupon != null || activeCardId == null || isApplying}>
                Submit
              </Button>
            </div>
          </div>

        </DialogContent>
      </Dialog>
    );
  }
}

SubscriptionForm.propTypes={
  close: PropTypes.func.isRequired,
  billingInfo: PropTypes.object,
  coupon: PropTypes.any,
  errorCoupon: PropTypes.any,
  isApplying: PropTypes.bool
};

const mapStateToProps=state => ({
    billingInfo: state.default.settings.billing.billingInfo,
    errorCoupon: state.default.settings.billing.errorCoupon,
    isApplying: state.default.settings.billing.loadingCoupon,
    coupon: state.default.settings.billing.coupon
});

const mapDispatchToProps=dispatch => ({
  actions: bindActionCreators(
    {
      postCoupon,
      clearCouponInput,
      subscribeStripe
    },
    dispatch
  )
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SubscriptionForm)
);
