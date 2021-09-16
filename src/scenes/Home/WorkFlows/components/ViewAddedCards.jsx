import React from 'react';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PropTypes from 'prop-types';


import './ViewAddedCards.scss';
import CardForm from '../../scenes/Settings/scenes/Billing/scenes/CardForm';
import StripeWrapper from '../../../../components/StripeWrapper';
import { Svg } from '../../Layout';

class ViewAddedCards extends React.Component {
  constructor(props) {
    super(props);
    const pageId = this.props.match.params.id;

    const { billingInfo } = props;

    let activeCard = null;
    if(billingInfo && billingInfo.cards) {
      activeCard = billingInfo.cards.find(c => c.status == 'active');
    }

    this.state={
      activeCardId: activeCard ? activeCard.uid : null,
      isCardFormVisible: false,
      pageId: pageId ? pageId : props.pageId
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
  }

  componentWillUnmount() {
  }

  handleSubmit=event => {
    const { activeCardId } = this.state;
    event.preventDefault();
    this.props.onSelectCard(activeCardId);
  };

  renderCard=(card, i) => {
    const { activeCardId }=this.state;
    const isActive=activeCardId == card.uid;
    const cardBrand="card-brand-" + card.card.brand.toLowerCase().replace(' ', '');

    return (<div className="cards-list-card" key={i} onClick={() => this.setState({
      activeCardId: card.uid
    })}>
      <div className="cards-list-card-brand">
        <Svg name={cardBrand} />
      </div>
      <div className="card-no">**** **** **** {card.card.last4}</div>
      <div className="cards-list-card-check">
        {isActive && <CheckCircleIcon />}
      </div>
    </div>);
  };

  onAddNewCard = () => {
    this.setState({
      isCardFormVisible: true
    });
  };

  render() {
    const { billingInfo, close }=this.props;
    const { activeCardId, isCardFormVisible, pageId }=this.state;
    return (
      <Dialog maxWidth="sm" open={true} onClose={close} className="cards-list-form-container">
        <DialogContent>
          {isCardFormVisible && <StripeWrapper><CardForm pageId={pageId} cardToken={null} onSuccess={() => {}} close={() => this.setState({
            isCardFormVisible: false})}/></StripeWrapper>}
          <div className="cards-list-form-content">
            <Grid container justify="space-between">
                <h2>
                Your Cards
                </h2>
                <Button onClick={close} className="btn-close">
                <Svg name="modal-close" />
                </Button>
            </Grid>
            <hr />
            <div className="cards-list-card-list">
              {(billingInfo && billingInfo.cards) && billingInfo.cards.map((card, i) => this.renderCard(card, i))}
            </div>
            <Button className="new-card-button" onClick={() => this.onAddNewCard()}>
              Add New Card
            </Button>
            <div className="cards-list-btn-container">
              <Button 
                className="btn-submit" 
                variant="contained" color="primary" 
                onClick={this.handleSubmit} 
                disabled={activeCardId == null}>
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}

ViewAddedCards.propTypes={
  close: PropTypes.func.isRequired,
  billingInfo: PropTypes.object
};

const mapStateToProps=state => ({
    billingInfo: state.default.settings.billing.billingInfo,
});

const mapDispatchToProps=dispatch => ({
  actions: bindActionCreators(
    {
    },
    dispatch
  )
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ViewAddedCards)
);
