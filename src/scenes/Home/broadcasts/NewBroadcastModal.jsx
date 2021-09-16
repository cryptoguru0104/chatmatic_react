import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Grid, Button, IconButton } from '@material-ui/core';
import { toastr } from 'react-redux-toastr';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import { getPageFromUrl } from 'services/pages/selector';

import CloseIcon from '@material-ui/icons/Close';

import { Svg, Block } from '../Layout';

import './NewBroadcastModal.scss';

import CONSTANTS from 'config/Constants';
const TYPES = CONSTANTS.broadcastTypes;
class NewBroadcastModal extends Component {
  state = {
    type: null
  };

  componentDidMount = () => {
  };

  onSelect = (type) => {
    if (type === 'broadcast-sms' && (!this.props.billingInfo || this.props.billingInfo.cards.length == 0 ) && (this.props.page && !this.props.page.smsAccount)) {
      toastr.error(
        'Error',
        `Please add a credit card to use this feature from settings.`
      );
      return false;
    } else if(type === 'broadcast-email' && this.props.integrations.filter(i => i.active && ['sendgrid', 'mailgun', 'smtp'].includes(i.integrationType.slug) ).length == 0) {
      toastr.error(
        'Error',
        `Please add a SMTP integration to use this feature from settings.`
      );
      return false;
    }
    const { onClose, onSelect } = this.props;
    onSelect(type);
    onClose();
  }

  render() {
    const { onClose, onSelect } = this.props;
    const { type } = this.state;

    return (
      <Dialog 
      className="broadcast-modal-container"
      aria-labelledby="broadcast-modal-title"
      open={true}
      fullWidth={true}
      maxWidth="sm"
      onClose={onClose}>
        <DialogTitle disableTypography id="broadcast-modal-title" className="broadcast-modal-title">
          <Grid container direction="row" justify="flex-end" alignItems="center">
            <IconButton onClick={onClose}><CloseIcon /></IconButton>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <h2>Add New Broadcast</h2>
          <Block className="broadcast-modal-content">
            <Grid container justify="space-between" spacing={3} alignItems="stretch">
              {TYPES.map(t => <Grid item xs={6} sm={4} key={t.type}>
                <Block className={`type-item ${t.type == type ? 'selected' : ''}`} onClick={() => this.onSelect(t.type)}>
                  <Block className="icon-container">
                    <Svg name={t.icon} />
                  </Block>
                  <div className="title">{t.title}</div>
                  <div className="desc">{t.desc}</div>
                </Block>
              </Grid>)}
            </Grid>
          </Block>
        </DialogContent>
      </Dialog>
    );
  }
}

const mapStateToProps = (state, props) => ({
  page: getPageFromUrl(state, props),
  billingInfo: state.default.settings.billing.billingInfo,
  integrations: state.default.settings.integrations.integrations,
  stripeSources: state.default.auth.stripeSources
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
    },
    dispatch
  )
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewBroadcastModal));
