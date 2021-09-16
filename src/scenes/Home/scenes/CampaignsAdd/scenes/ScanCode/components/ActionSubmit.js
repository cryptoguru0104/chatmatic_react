import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';

import { getGeneralWorkflows } from 'services/workflows/selector';
import { getCampaignAdd } from '../../../services/selector';
import { updateNewCampaignInfo } from '../../../services/actions';
import { updateEngageInfo } from '../../../../EngageAdd/services/actions';

class ActionSubmit extends Component {
  state = {
    workflowUid: this.props.campaignAdd.workflowUid || null,
    engageOption: 'existingEngage',
    campaignName: this.props.campaignAdd.campaignName || ''
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      workflowUid: nextProps.campaignAdd.workflowUid || null,
      campaignName: nextProps.campaignAdd.campaignName || ''
    });
  }

  _changeEngageOption = event => {
    this.setState({ engageOption: event.target.value });
  };

  _campaignNameChange = event => {
    this.setState({ campaignName: event.target.value });
  };

  _submit = () => {
    if (!this.state.campaignName) {
      toastr.warning(
        'Campaign Name Missing!',
        'You must provide your campaign with a name.'
      );
    } else if (!this.state.workflowUid) {
      toastr.warning(
        'Engagement Missing!',
        'You must select an engagement that will be launched when someone subscribes to this campaign.'
      );
    } else {
      this.props.nextStep();
      this.props.actions.updateNewCampaignInfo(
        this.props.pageId,
        {
          workflowUid: this.state.workflowUid,
          campaignName: this.state.campaignName
        },
        true
      );
    }
  };

  _goToEngageBuilder = workflowUid => {
    if (!!workflowUid) {
      const workflow = this.props.workflows.find(
        workflow => workflow.uid === workflowUid
      );

      this.props.actions.updateEngageInfo({
        ...workflow,
        activeStep: workflow.steps[0].stepUid
      });
    } else {
      this.props.actions.updateEngageInfo({
        workflowType: 'general',
        name: '',
        steps: [],
        activeStep: '',
        uid: null,
        broadcast: {}
      });
    }

    this.props.history.push({
      pathname: `/page/${this.props.match.params.id}/engages/${
        workflowUid ? workflowUid : 'add'
      }/builder`,
      state: {
        redirectTo: this.props.location.pathname
      }
    });
  };

  render() {
    const renderMessageAlert = () => {
      if (!this.state.workflowUid) {
        return (
          <span className="d-flex align-items-center align-items-center warning-alert">
            <i className="fa fa-times-circle-o mr-3" />
            Please select an engagement from the list below
          </span>
        );
      } else {
        const engagementName = this.props.workflows.find(
          workflow => workflow.uid === this.state.workflowUid
        ).name;
        return (
          <div className="d-flex flex-column align-items-center">
            <span className="d-flex align-items-center align-items-center success-alert">
              <i className="fa fa-check-circle-o mr-3" />
              {`Using Engagement: ${engagementName}`}
            </span>
            <button
              className="btn btn-edit-engagement text-white"
              onClick={() => this._goToEngageBuilder(this.state.workflowUid)}
            >
              Edit Engagement
            </button>
          </div>
        );
      }
    };

    const renderMessageSelection = () => {
      if (this.state.engageOption === 'existingEngage') {
        return (
          <div className="d-flex flex-column w-100 message-selection">
            <div
              className="d-flex justify-content-center w-100 alert-container"
              style={{ minHeight: !this.state.workflowUid ? 64 : 115 }}
            >
              {renderMessageAlert()}
            </div>
            <div className="d-flex flex-column mt-3 p-2 message-list">
              {this.props.workflows.map((workflow, index) => (
                <span
                  className="engage-item"
                  key={index}
                  onClick={() => this.setState({ workflowUid: workflow.uid })}
                  style={{
                    color:
                      workflow.uid === this.state.workflowUid
                        ? 'white'
                        : 'inherit',
                    backgroundColor:
                      workflow.uid === this.state.workflowUid
                        ? '#274bf0'
                        : 'inherit'
                  }}
                >
                  {workflow.name}
                </span>
              ))}
            </div>
          </div>
        );
      } else {
        return (
          <div className="d-flex justify-content-center mt-3 flex-grow-1">
            <button
              className="btn btn-primary btn-new-message"
              style={{ height: 45 }}
              onClick={() => this._goToEngageBuilder(null)}
            >
              Launch Message Builder
            </button>
          </div>
        );
      }
    };

    return (
      <div className="d-flex flex-column align-items-between mt-3 action-submit-container">
        <div className="d-flex justify-content-center action-step-bar">
          <div className="d-flex flex-column align-items-center bg-primary px-3 py-2 text-white action-submit">
            <span>SUBMIT ACTION</span>
            <i className="fa fa-ellipsis-h" />
          </div>
          <div className="d-flex flex-column align-items-center px-3 py-2 how-to-use">
            <span>HOW TO USE IT</span>
            <i className="fa fa-close" />
          </div>
        </div>
        <div className="d-flex form-group px-2 mt-5 campaign-name-container">
          <input
            type="text"
            className="form-control"
            onChange={this._campaignNameChange}
            name="campaignName"
            value={this.state.campaignName}
            placeholder="Add Campaign Name Here"
          />
        </div>
        <div className="d-flex justify-content-center mt-4 message-option">
          <label className="d-flex align-items-center mr-5">
            <input
              onChange={this._changeEngageOption}
              type="radio"
              value="existingEngage"
              checked={this.state.engageOption === 'existingEngage'}
            />
            <span className="pl-2">Select Existing Automation Or Message</span>
          </label>
          <label className="d-flex align-items-center">
            <input
              onChange={this._changeEngageOption}
              type="radio"
              value="newEngage"
              checked={this.state.engageOption === 'newEngage'}
            />
            <span className="pl-2">Create New</span>
          </label>
        </div>
        {renderMessageSelection()}
        <div className="d-flex justify-content-end mt-4 w-100 step-nav-actions">
          <button
            className="btn btn-primary px-5 py-2 btn-next"
            onClick={this._submit}
          >
            Next
            <i className="fa fa-arrow-right ml-2" />
          </button>
        </div>
      </div>
    );
  }
}

ActionSubmit.propTypes = {
  workflows: PropTypes.array.isRequired,
  pageId: PropTypes.string.isRequired,
  campaignAdd: PropTypes.object.isRequired,
  nextStep: PropTypes.func.isRequired,
  actions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  workflows: getGeneralWorkflows(state),
  campaignAdd: getCampaignAdd(state)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      updateNewCampaignInfo,
      updateEngageInfo
    },
    dispatch
  )
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ActionSubmit)
);
