import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toastr } from 'react-redux-toastr';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { Grid, Card, CardHeader , CardContent } from '@material-ui/core';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import integrationIcon from 'assets/images/icon-sendgrid.png';

import './styles.css';

class SMTPIntegrationAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
  }

  renderIntegrationForm = () => {
    const { integration } = this.props;

    return (<Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={8}>
        <Card className="integration-item-form-container">
          <CardContent>
            <h5>How to integrate SMTP.com</h5>
            <ul className="guide">
              <li>Enter your SMTP.com API Key.</li>
            </ul>
            <form className="">
              <div className="form-group">
                <h5 htmlFor="apiKey" className="m-0">API Key</h5>
                <input type="text" className="form-control" id="apiKey" ref="apiKeyRef" placeholder="API Key" defaultValue={integration ? integration.parameters.apiKey : ''} />
              </div>
            </form>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={12} md={4}>
        <Card className="integration-item-benefits-container">
          <CardContent>
            <h5><img src={integrationIcon} className="icon-title" /> Main benefits</h5>
            <ul className="benefits">
              <li><CheckCircleIcon />Automate sending out email.</li>
              <li><CheckCircleIcon />Send requests to past customers in one go!.</li>
              <li><CheckCircleIcon />Add multiple Chatmatic widgets.</li>
            </ul>
          </CardContent>
        </Card>
      </Grid>
    </Grid>);
  };

  _submitIntegration = () => {
    if (
      !this.refs.apiKeyRef ||
      !this.refs.apiKeyRef.value
    ) {
      toastr.warning('Please type all the required fields');
    } else {
      const api_key = this.refs.apiKeyRef.value;
      const parameters = {
        username: 'api',
        password: api_key,
        api_key: api_key
      };

      this.props.saveIntegration('SMTP', false, parameters, 'SMTP');

      this.props.onClose();
    }
  };

  render() {
    return (
      <Dialog 
      className=""
      aria-labelledby="transition-modal-title"
      open={true}
      fullWidth={true}
      maxWidth="md"
      onClose={this.props.onClose}>
        <DialogContent className="dialog-integration-container">
          <h4 className="title">Connect SMTP.com</h4>
          {this.renderIntegrationForm()}
          <div className="dialog-actions">
            <Button variant="contained" onClick={this.props.onClose}>CANCEL</Button>
            <Button variant="contained" onClick={this._submitIntegration} color="primary">CONNECT</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}

SMTPIntegrationAdd.propTypes = {
  integration: PropTypes.object,
  saveIntegration: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
    },
    dispatch
  )
});

export default 
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SMTPIntegrationAdd);


