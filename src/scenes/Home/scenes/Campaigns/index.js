import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { toastr } from 'react-redux-toastr';
import Swal from 'sweetalert2';

/** import components */
import Collapse from './components/Collapse/Collapse';

/** Import Actions */
import { getPageCampaigns as getPageCampaignsAction } from 'services/campaigns/campaignsActions';
import { getPageWorkflows } from 'services/workflows/workflowsActions';

import './styles.css';

class Campaigns extends React.Component {
  componentDidMount() {
    this.props.actions.getPageCampaignsAction(this.props.match.params.id);
    this.props.actions.getPageWorkflows(this.props.match.params.id);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.errorCampaigns &&
      nextProps.errorCampaigns !== this.props.errorCampaigns
    ) {
      toastr.error('Error', nextProps.errorCampaigns);
    }
    if (
      nextProps.errorWorkflows &&
      nextProps.errorWorkflows !== this.props.errorWorkflows
    ) {
      toastr.error('Error', nextProps.errorWorkflows);
    }
    if (nextProps.loadingCampaigns || nextProps.loadingWorkflows) {
      Swal({
        title: 'Please wait...',
        text: 'We are generating a listing of your campaigns...',
        onOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
    } else {
      Swal.close();
    }
  }

  renderCampaigns = () => {
    if (this.props.campaigns) {
      const campaigns = this.props.campaigns.map((campaign, index) => (
        <Collapse
          {...campaign}
          collapse={index}
          pageId={this.props.match.params.id}
          key={index}
        />
      ));

      return (
        <div className="card campaigns-table" data-aos="fade">
          <div className="card-header">
            <div className="row">
              <div className="col-4">
                <small className="font-weight-bold">CAMPAIGN NAME</small>
              </div>
              <div className="col-2">
                <small className="font-weight-bold">SUBSCRIBERS</small>
              </div>
              <div className="col-2">
                <small className="font-weight-bold">VISITS</small>
              </div>
              <div className="col-2">
                <small className="font-weight-bold">CONVERSIONS</small>
              </div>
              <div className="col-2">
                <small className="font-weight-bold">WIDGET TYPE</small>
              </div>
            </div>
          </div>

          <div className="list-group list-group-flush" id="accordion">
            {campaigns}
          </div>
        </div>
      );
    } else {
      return (
        <div data-aos="fade">
          <p>
            <b>You do not have any campaigns for this fan page.</b>
          </p>
          <p>
            Please click the
            <Link to="campaigns/add"> "Add New" </Link>
            button above to begin creating a new one.
          </p>
        </div>
      );
    }
  };

  render() {
    return (
      <div className="d-flex flex-stretch">
        <div className="d-flex align-items-stretch flex-column w-100 campaigns-container">
          <div className="d-flex justify-content-between align-items-center mb-3 campaigns-header">
            <strong className="pl-2">Campaigns</strong>
            <Link to="campaigns/add" className="btn btn-sm btn-primary rounded">
              Add New +
            </Link>
          </div>

          {this.renderCampaigns()}
        </div>
      </div>
    );
  }
}

Campaigns.propTypes = {
  campaigns: PropTypes.array,
  actions: PropTypes.shape({
    getPageCampaignsAction: PropTypes.func,
    getPageWorkflows: PropTypes.func
  }).isRequired,
  loadingCampaigns: PropTypes.bool.isRequired,
  errorCampaigns: PropTypes.any,
  loadingWorkflows: PropTypes.bool.isRequired,
  errorWorkflows: PropTypes.any
};
export default connect(
  (state, props) => ({
    campaigns: state.default.campaigns.campaigns,
    loadingCampaigns: state.default.campaigns.loading,
    errorCampaigns: state.default.campaigns.error,
    loadingWorkflows: state.default.workflows.loading,
    errorWorkflows: state.default.workflows.error
  }),
  dispatch => ({
    actions: bindActionCreators(
      {
        getPageCampaignsAction,
        getPageWorkflows
      },
      dispatch
    )
  })
)(Campaigns);
