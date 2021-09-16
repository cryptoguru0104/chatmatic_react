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

import { addIntegration, updateIntegration } from '../../services/actions';
import { authenticateIntegration } from '../../services/api';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';


import shopifyIcon from 'assets/images/icon-shopify.png';

import './styles.css';
import Swal from 'sweetalert2';

class ShopifyIntegrationAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }



  componentDidUpdate(prevProps, prevState) {
    let integrationId = null;
    if(!this.props.integration && this.props.newIntegrationId) {
      integrationId = this.props.newIntegrationId;
    }
    else if(this.props.integration && !this.props.loading) {
      integrationId = this.props.integration.uid;
    }

    if(integrationId) {
      this._authenticateIntegration(integrationId);
    }
  }

  renderIntegrationForm = () => {
    const { integration } = this.props;
    
    return (<Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={8}>
        <Card className="integration-item-form-container">
          <CardContent>
            <h5>How to connect Chatmatic to Shopify</h5>
            <ul className="guide">
              <li>Enter your Shopify store name and domain and click <b>Connect</b></li>
              <li>Confirms that you want to integrate with Chatmatic</li>
              <li>Give Chatmatic permissions to connect with Shopify</li>
            </ul>
            <form className="">
              <div className="form-info">
                <div className="form-group">
                  <h5 className="m-0">Enter your Shopify store name</h5>
                  <input type="text" className="form-control" placeholder="Name" ref="integrationNameRef"
                  defaultValue={integration ? integration.name : ''} />
                </div>
              </div>
              <div className="form-info">
                <div className="form-group">
                  <h5 className="m-0">Enter your Shopify domain</h5>
                  <div className="d-flex align-items-center form-group-shop-address">
                    <label className="mr-2 label-left">https://</label>
                    <input type="text" ref="shopNameRef"  className="form-control" placeholder="Your domain"
                    defaultValue={integration ? integration.parameters.shopName : ''} />
                    <label className="ml-2 label-right">.myshopify.com</label>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={12} md={4}>
        <Card className="integration-item-benefits-container">
          <CardContent>
            <h5><img src={shopifyIcon} className="icon-title" /> Main benefits</h5>
            <ul className="benefits">
              <li><CheckCircleIcon />Automate review requests.</li>
              <li><CheckCircleIcon />Send requests to past customers in one go!</li>
              <li><CheckCircleIcon />Add multiple Chatmatic widgets.</li>
            </ul>
          </CardContent>
        </Card>
      </Grid>
    </Grid>);
  };

  _connectIntegration = () => {
    if (!this.refs.shopNameRef || !this.refs.shopNameRef.value
      || !this.refs.integrationNameRef || !this.refs.integrationNameRef.value) {
        toastr.warning('Please type all the required fields');
      }
    else {
      const name = this.refs.integrationNameRef.value;
      const tag = this.refs.shopNameRef.value;
      const parameters = {
        shopName: this.refs.shopNameRef.value
      }

      this.props.saveIntegration(name, false, parameters, tag);
    }
  };

  _authenticateIntegration = async (integrationId) => {
    const pageId = this.props.match.params.id;
    try {
      const res = await authenticateIntegration(pageId, integrationId);

      window.location.replace(res.data.redirect_url);
    }catch(e) {
      toastr.error('Server Error');
    }
  }

  _removeIntegration = () => {
    this.props.actions.updateIntegration(
      this.props.match.params.id,
      this.state.integrationId,
      {
        active: false
      }
    );
  };


  render() {
    return (
      <Dialog 
      className=""
      aria-labelledby="transition-modal-title"
      open={true}
      fullWidth={true}
      maxWidth="md"
      onClose={this.props.onBack}>
        <DialogContent className="dialog-integration-container">
          <h4 className="title">Connect to Shopify</h4>
          {this.renderIntegrationForm()}
          <div className="dialog-actions">
            <Button variant="contained" onClick={this.props.onClose}>CANCEL</Button>
            <Button variant="contained" onClick={this._connectIntegration} color="primary">CONNECT</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}

ShopifyIntegrationAdd.propTypes = {
  integration: PropTypes.object,
  saveIntegration: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  newIntegrationId: PropTypes.any,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  newIntegrationId: state.default.settings.integrations.newIntegrationId,
  loading: state.default.settings.integrations.loading,
});

const mapDispatchToProps = dispatch => ({
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
  )(ShopifyIntegrationAdd)
);