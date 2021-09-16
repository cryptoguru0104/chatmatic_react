import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toastr } from 'react-redux-toastr';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { addIntegration, updateIntegration } from '../../services/actions';

import WebhookIntegrationAdd from '../WebhookIntegrationAdd';
import ShopifyIntegrationAdd from '../ShopifyIntegrationAdd';
import SendgridIntegrationAdd from '../SendgridIntegrationAdd';
import MailgunIntegrationAdd from '../MailgunIntegrationAdd';
import SMTPIntegrationAdd from '../SMTPIntegrationAdd';

import './styles.css';
import Swal from 'sweetalert2';

class IntegrationAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      integration: this.props.integration
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.loading) {
      Swal({
        title: 'Please wait...',
        text: 'Saving the integration.',
        onOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
    } else if (this.props.loading) {
      Swal.close();

      if (nextProps.error) {
        toastr.error('Error', nextProps.error);
        this.setState({ isBack: false });
      } else {
      }
    }
  }

  _updateOrCreateIntegration = (name, active, parameters, tag) => {
    const pageId = this.props.match.params.id;
    const { integration } = this.state;
    const reqParams = {
      name,
      active,
      parameters,
      tag
    };

    if (integration) {
      this.props.actions.updateIntegration(
        pageId,
        integration.uid,
        reqParams
      );
    } else {
      this.props.actions.addIntegration(pageId, {
        ...reqParams,
        integrationTypeUid: this.props.integrationType.uid
      });
    }
  }
  render() {
    const { integrationType } = this.props;

    switch (integrationType.slug) {
      case 'shopify':
        return (
          <ShopifyIntegrationAdd integration={this.state.integration} saveIntegration={this._updateOrCreateIntegration} onClose={this.props.onBack}/>
        );
      case 'webhook':
        return (
          <WebhookIntegrationAdd integration={this.state.integration} saveIntegration={this._updateOrCreateIntegration} onClose={this.props.onBack}/>    
        );  
      case 'sendgrid':
        return (
          <SendgridIntegrationAdd integration={this.state.integration} saveIntegration={this._updateOrCreateIntegration} onClose={this.props.onBack}/>    
        ); 
      case 'mailgun':
        return (
          <MailgunIntegrationAdd integration={this.state.integration} saveIntegration={this._updateOrCreateIntegration} onClose={this.props.onBack}/>    
        ); 
      case 'smtp':
        return (
          <SMTPIntegrationAdd integration={this.state.integration} saveIntegration={this._updateOrCreateIntegration} onClose={this.props.onBack}/>    
        ); 
      //no default
    }
  }
}

IntegrationAdd.propTypes = {
  integrationType: PropTypes.object,
  integration: PropTypes.object,
  integrations: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.any,
  onBack: PropTypes.func.isRequired,
  actions: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  integrations: state.default.settings.integrations.integrations,
  loading: state.default.settings.integrations.loading,
  error: state.default.settings.integrations.error
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      addIntegration,
      updateIntegration
    },
    dispatch
  )
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(IntegrationAdd)
);
