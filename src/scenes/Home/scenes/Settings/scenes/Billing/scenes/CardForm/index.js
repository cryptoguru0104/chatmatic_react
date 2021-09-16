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

import { injectStripe, CardElement } from 'react-stripe-elements';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

import {
  addBillingCard
} from '../../services/actions';

import './styles.scss';
import { Svg } from '../../../../../../Layout';

class CardForm extends React.Component {
  constructor(props) {
    super(props);
    const pageId = this.props.match.params.id;

    this.state = {
      pageId: props.pageId ? props.pageId : pageId
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
  }

  handleSubmit = event => {
    const { cardToken, close, onSuccess } = this.props;
    const { pageId } = this.state;

    event.preventDefault();
    this.props.stripe
      .createSource({ type: 'card' })
      .then(({ source }) => {
        this.props.actions.addBillingCard(
          pageId,
          source.id,
          cardToken
        );
        onSuccess(source);
        close();
      })
      .catch(error => {
        toastr.error('Error', 'Invalid Card Number');
      });
  };


  render() {
    const { cardToken, close } = this.props;
    return (
      <Dialog maxWidth="md" open={true} onClose={close} className="card-form-container">
        <DialogContent>
          <Grid container justify="space-between" alignItems="center">
            <h5>{cardToken ? "Update Payment Info" : "Add Credit Card"}</h5>
            <button onClick={close} className="btn-close">
              <Svg name="modal-close" />
            </button>
          </Grid>
          <hr />
          <CardElement options={{
            style:cardElementStyle,
            hidePostalCode:true
          }}/>
          <Grid container justify="flex-end" alignItems="center">
            <Button variant="contained" color="primary" onClick={this.handleSubmit} className="btn-submit">
              {cardToken ? "Update" : "Add Credit Card"}
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>
    );
  }
}

const cardElementStyle = {

};

CardForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  cardToken: PropTypes.string,
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      addBillingCard
    },
    dispatch
  )
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(injectStripe(CardForm))
);
