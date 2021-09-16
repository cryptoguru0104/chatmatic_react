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

import webhookIcon from 'assets/images/icon-webhook.png';

import './styles.css';

class WebhookIntegrationAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      domainWhiteList: [],
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
  }

  _removeDomain = domainIndex => {
    const domainWhiteList = this.state.domainWhiteList.filter(
      (domain, index) => index !== domainIndex
    );

    this.setState({ domainWhiteList });
  };

  _addDomain = () => {
    if (this.domainRef.value) {
      this.setState({
        domainWhiteList: this.state.domainWhiteList.concat([
          this.domainRef.value
        ])
      });
      this.domainRef.value = '';
    }
  };

  renderIntegrationForm = () => {
    const { integration } = this.props;

    return (<Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={8}>
        <Card className="integration-item-form-container">
          <CardContent>
            <h5>How to connect a Webhook</h5>
            <ul className="guide">
              <li>Enter your Webhook name, tags and URL</li>
              <li>Enter your Webhook name, tags and URL</li>
              <li>Enter your Webhook name, tags and URL</li>
            </ul>
            <form className="">
              <div className="form-group">
                <h5 htmlFor="webhookName" className="m-0">Webhook Name</h5>
                <input type="text" className="form-control" id="webhookName" ref="webhookNameRef" placeholder="Webhook Name" defaultValue={integration ? integration.name : ''} />
              </div>
              <div className="form-group">
                <h5 htmlFor="webhookName" className="m-0">Tag</h5>
                <input type="text" className="form-control" id="webhookTag" ref="webhookTagRef" placeholder="Webhook Tag"
                  defaultValue={integration ? integration.tag : ''} />
              </div>
              <div className="form-group">
                <h5 htmlFor="webhookUrl" className="m-0">Webhook URL</h5>
                <input type="text" className="form-control" id="webhookUrl" ref="webhookUrlRef" placeholder="Webhook Url" defaultValue={
                    integration ? integration.parameters.webhookUrl : '' }/>
              </div>
            </form>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={12} md={4}>
        <Card className="integration-item-benefits-container">
          <CardContent>
            <h5><img src={webhookIcon} className="icon-title" /> Main benefits</h5>
            <ul className="benefits">
              <li><CheckCircleIcon />Automate review requests.</li>
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
      !this.refs.webhookNameRef ||
      !this.refs.webhookUrlRef ||
      !this.refs.webhookTagRef ||
      !this.refs.webhookNameRef.value ||
      !this.refs.webhookUrlRef.value ||
      !this.refs.webhookTagRef.value
    ) {
      toastr.warning('Please type all the required fields');
    } else {
      const name = this.refs.webhookNameRef.value;
      const tag = this.refs.webhookTagRef.value;
      const parameters = {
        webhookUrl: this.refs.webhookUrlRef.value
      };

      this.props.saveIntegration(name, true, parameters, tag);

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
          <h4 className="title">Connect a Webhook</h4>
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

WebhookIntegrationAdd.propTypes = {
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
  )(WebhookIntegrationAdd);


