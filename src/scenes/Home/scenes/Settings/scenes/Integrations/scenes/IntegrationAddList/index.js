import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';

import AddIcon from '@material-ui/icons/Add';
import { Grid, Card , CardContent, Button } from '@material-ui/core';


import IntegrationAdd from '../IntegrationAdd';


import './styles.css';

class IntegrationAddList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      integrationMenuEl: null,
      showIntegrationAdd: false,
      activeIntegrationType: null,
    };
  }


  _renderIntegrationType = (integrationType) => {
    const { integrations } = this.props;

    let canAdd = false;

    if(integrationType.slug == 'webhook') canAdd = true;
    else if(integrationType.slug == 'shopify') canAdd = false;
    else if(integrations.findIndex(ig => ig.integrationTypeUid == integrationType.uid) == -1) canAdd = true;

    return (
      <Card className="integration-item-container">
        <CardContent>
          <div className="integration-item-action d-flex justify-content-between ">
            <img src={require("assets/images/icon-" + integrationType.slug + ".png")} alt="" width={35} height={35} />
            <div className="d-flex justify-content-between">
              <Button variant="contained" color="primary" className="btn-add" onClick={() =>
                this.setState({
                  showIntegrationAdd: true,
                  activeIntegrationType: integrationType,
                  activeIntegration: null
                })
              } startIcon={<AddIcon />} disabled={!canAdd}>ADD INTEGRATION</Button>
            </div>
          </div>
          <div className="item-contents">
            <h4 className="item-title">{integrationType.slug == 'shopify' ? 'Shopify - Coming Soon' : integrationType.name}</h4>
            <div className="item-description" dangerouslySetInnerHTML={{
              __html:integrationType.description
            }}>{}</div>
          </div>
        </CardContent> 
      </Card>
    );
  };

  render() {
    const { integrationTypes } = this.props;


    return (
      <div
        className="d-flex flex-column integrations-container"
        data-aos="fade"
      >
        <div className="mb-3 w-100">
          <h2 className="m-0 title">Add Integrations</h2>
          <div className="integrations-page-title-icon">i</div>
          <Button variant="contained" color="primary" className="btn-add-integration" onClick={() => this.props.onBack() } >Back To Integrations</Button>
        </div>
        
        <div className="d-flex flex-column integrations-list">
          <Grid container spacing={2}>
            {integrationTypes.map((integrationType, index) => {
              return <Grid key={index} item xs={12} sm={6} md={6} lg={3}>
                {this._renderIntegrationType(integrationType)}
              </Grid>
            })}
          </Grid>
        </div>

        {this.state.showIntegrationAdd && 
        <IntegrationAdd
          integrationType={this.state.activeIntegrationType}
          integration={null}
          onBack={() => {
            this.setState({
              activeIntegrationType: null,
              showIntegrationAdd: false
            });
            this.props.onBack();
          }}
        />}
      </div>
    );
  }
}

IntegrationAdd.propTypes = {
  integrations: PropTypes.array.isRequired,
  integrationTypes: PropTypes.array.isRequired,
  onBack: PropTypes.func.isRequired,
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
    },
    dispatch
  )
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(IntegrationAddList)
);
