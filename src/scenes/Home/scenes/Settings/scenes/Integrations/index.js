import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { toastr } from 'react-redux-toastr';
import { Grid, Card, CardHeader , CardContent, Button, IconButton , Menu, MenuItem } from '@material-ui/core';

import { Check as CheckIcon, Remove as RemoveIcon, MoreVert as MoreVertIcon } from '@material-ui/icons';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import IntegrationAdd from './scenes/IntegrationAdd';
import IntegrationAddList from './scenes/IntegrationAddList';

import { deleteIntegration } from './services/actions';
import { getIntegrations, getIntegrationTypes } from './services/actions';

import './styles.css';

import iconEmpty from 'assets/images/icon-integrations-empty.png';
import InfoToggle from '../../../../components/InfoToggle';

class Integrations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      integrationMenuEl: null,
      activeIntegration: null,
      showIntegrationAdd: false,
      activeIntegrationType: null,
      showIntegrationAddList: false,
    };
  }

  componentDidMount() {
    this.props.actions.getIntegrations(this.props.match.params.id);
    this.props.actions.getIntegrationTypes(this.props.match.params.id);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.loading) {
      Swal({
        title: 'Please wait...',
        text: 'Loading Integrations...',
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
        toastr.error(nextProps.error);
      }
    }
  }

  _deleteIntegration = integrationId => {
    Swal({
      title: 'Are you sure you wanna do that?',
      text:
        'That will remove this integration and all the cool stuff it can do',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Remove this integration',
      cancelButtonText: 'No, I want to keep it',
      confirmButtonColor: '#f02727'
    }).then(result => {
      if (result.value) {
        this.props.actions.deleteIntegration(
          this.props.match.params.id,
          integrationId
        );
      }
    });
  };

  _renderIntegrationType = (integrationType, integration) => {
    return (
      <Card className="integration-item-container">
        <CardContent>
          <div className="integration-item-action d-flex justify-content-between ">
            <img src={require("assets/images/icon-" + integrationType.slug + ".png")} alt="" width={35} height={35} />
            <div className="d-flex justify-content-between">
              {(integration && integration.active) && <div className="status status-active"><CheckIcon className="status-icon" />COMPLETED</div>}
              {(integration && !integration.active) && <div className="status status-inactive"><RemoveIcon className="status-icon" />INACTIVE</div>}

              {(integration && integration.active) && <Button variant="contained" color="primary" className="btn-edit" onClick={() =>{
                if(integrationType.slug == 'shopify') {
                  console.log('Not yet implemented');
                }
                else {
                  this.setState({
                    showIntegrationAdd: true,
                    activeIntegrationType: integrationType,
                    activeIntegration: integration
                  });
                }
              }}>MANAGE</Button>}
              {(!integration || !integration.active) && <Button variant="contained" color="primary" className="btn-edit" onClick={() =>
                this.setState({
                  showIntegrationAdd: true,
                  activeIntegrationType: integrationType,
                  activeIntegration: integration
                })
              }>CONNECT</Button>}

              {(integration) && <IconButton aria-label="more" aria-controls={"settings-menu-" + integrationType.uid} aria-haspopup="true" onClick={
                (event, data) => {
                  this.setState({
                    activeIntegration: integration,
                    integrationMenuEl: event.currentTarget
                  });
                }
              }>
                <MoreVertIcon />
              </IconButton>}
            </div>
          </div>
          <div className="item-contents">
            <h4 className="item-title">{integrationType.name + (integrationType.slug == 'webhook' ? '-' + integration.name : '')}</h4>
            <div className="item-description" dangerouslySetInnerHTML={{
              __html:integrationType.description
            }}>{}</div>
          </div>
        </CardContent> 
      </Card>
    );
  };

  render() {
    const { activeIntegration, showIntegrationAddList } = this.state;

    if(showIntegrationAddList) {
      return <IntegrationAddList onBack={() => {
          this.setState({
            showIntegrationAddList: false
          });
      }} />
    }

    return (
      <div
        className="d-flex flex-column integrations-container"
        data-aos="fade"
      >
        <div className="mb-3 w-100">
          <Grid container direction="row" justify="flex-start">
            <h2 className="m-0 title">Page Integrations</h2>
            <InfoToggle text='Below you will see a list of Integrations that are currently connected. If you see none, you can click "Add New Integration" to get started' />
          </Grid>
          <Button variant="contained"  color="primary" className="btn-add-integration" onClick={() =>{
              this.setState({
                showIntegrationAddList: true
              });
            }} startIcon={<AddCircleOutlineIcon />}>Add New Integration</Button>
        </div>
        
        <Grid container spacing={2} className="d-flex integrations-list">
          {this.props.integrations.length > 0 &&  (<>
            {this.props.integrations.map((integration, index) => {
              return <Grid key={index} item xs={12} sm={6} md={6} lg={3}>
                {this._renderIntegrationType(integration.integrationType, integration)}
              </Grid>
            })}
          </>)}
          {this.props.integrations.length == 0 && <div className="integrations-emtpy-container">
            <img src={iconEmpty} />
            <h4>No Integration</h4>
            <div>Create one-off flows to promote flash sales, events or product launches.</div>
            <Button variant="contained"  color="secondary" className="btn-add-integration" onClick={() =>{
              this.setState({
                showIntegrationAddList: true
              });
            }} startIcon={<AddCircleOutlineIcon />}>Add New Integration</Button>
          </div>}
        </Grid>


        <Menu
          id="settings-menu" 
          anchorEl={this.state.integrationMenuEl}
          keepMounted
          open={Boolean(this.state.integrationMenuEl)}
          onClose={() => {
            this.setState({
              integrationMenuEl: null,
              activeIntegration: null,
            });
          }}
        >
          {/* {(activeIntegration && activeIntegration.integrationType.slug == 'webhook') && 
          <MenuItem onClick={() => {
            this.setState({
              integrationMenuEl: null,
              activeIntegration: null
            });
            this.setState({
              showIntegrationAdd: true,
              activeIntegrationType: activeIntegration.integrationType
            });
          }}>
            Add new
          </MenuItem>} */}
          <MenuItem onClick={() => {
            let integrationId = this.state.activeIntegration.uid;
            this.setState({
              integrationMenuEl: null,
              activeIntegration: null
            });
            this._deleteIntegration(integrationId);
          }}>
            Disconnect
          </MenuItem>
        </Menu>

        {this.state.showIntegrationAdd && 
        <IntegrationAdd
          integrationType={this.state.activeIntegrationType}
          integration={this.state.activeIntegration}
          onBack={() =>
            this.setState({
              activeIntegrationType: null,
              showIntegrationAdd: false
            })
          }
        />}
      </div>
    );
  }
}

Integrations.propTypes = {
  integrations: PropTypes.array.isRequired,
  integrationTypes: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.any,
  actions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  integrations: state.default.settings.integrations.integrations,
  integrationTypes: state.default.settings.integrations.integrationTypes,
  loading: state.default.settings.integrations.loading,
  error: state.default.settings.integrations.error
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      deleteIntegration,
      getIntegrations,
      getIntegrationTypes
    },
    dispatch
  )
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Integrations)
);
