import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import { withRouter } from 'react-router-dom';

import { getGeneralWorkflows } from 'services/workflows/selector';
import { getCampaignAdd } from '../../../../../../services/selector';
import { updateNewCampaignInfo } from '../../../../../../services/actions';
import { updateEngageInfo } from '../../../../../../../EngageAdd/services/actions';

class SubmitAction extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOption: 'select_existing_engage'
    };
  }

  _inputChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  _submit = () => {
    if (!this.props.campaignAdd.campaignName) {
      toastr.warning(
        'Campaign Name Missing!',
        'You must provide your campaign with a name.'
      );
    } else if (!this.props.campaignAdd.workflowUid) {
      toastr.warning(
        'Engagement Missing!',
        'You must select an engagement that will be launched when someone subscribes to this campaign.'
      );
    } else {
      this.props.onSelectStep('howToUseIt');
      this.props.actions.updateNewCampaignInfo(
        this.props.match.params.id,
        {},
        true
      );
    }
  };

  _changeWorkflowUid = workflowUid => {
    this.props.actions.updateNewCampaignInfo(
      this.props.match.params.id,
      { workflowUid },
      false
    );
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
      if (!this.props.campaignAdd.workflowUid) {
        return (
          <span className="d-flex align-items-center align-items-center warning-alert">
            <i className="fa fa-times-circle-o mr-3" />
            Please select an engagement from the list below
          </span>
        );
      } else {
        const engagementName = this.props.workflows.find(
          workflow => workflow.uid === this.props.campaignAdd.workflowUid
        ).name;
        return (
          <div className="d-flex flex-column align-items-center">
            <span className="d-flex align-items-center align-items-center success-alert">
              <i className="fa fa-check-circle-o mr-3" />
              {`Using Engagement: ${engagementName}`}
            </span>
            <button
              className="btn btn-edit-engagement text-white"
              onClick={() =>
                this._goToEngageBuilder(this.props.campaignAdd.workflowUid)
              }
            >
              Edit Engagement
            </button>
          </div>
        );
      }
    };

    const renderMessageSelection = () => {
      if (this.state.selectedOption === 'select_existing_engage') {
        return (
          <div className="d-flex flex-column w-100 message-selection">
            <div
              className="d-flex justify-content-center w-100 alert-container"
              style={{
                minHeight: !this.props.campaignAdd.workflowUid ? 64 : 115
              }}
            >
              {renderMessageAlert()}
            </div>
            <div className="d-flex flex-column mt-3 p-2 message-list">
              {this.props.workflows.map((workflow, index) => (
                <span
                  className="engage-item"
                  key={index}
                  onClick={() => this._changeWorkflowUid(workflow.uid)}
                  style={{
                    color:
                      workflow.uid === this.props.campaignAdd.workflowUid
                        ? 'white'
                        : 'inherit',
                    backgroundColor:
                      workflow.uid === this.props.campaignAdd.workflowUid
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
      <div>
        <div className="form-group text-center mt-5">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="selectedOption"
              id="select_existing_engage"
              value="select_existing_engage"
              onChange={this._inputChange}
              checked={this.state.selectedOption === 'select_existing_engage'}
            />
            <label
              className="form-check-label"
              htmlFor="select_existing_engage"
            >
              Select Existing Automation Or Message
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="selectedOption"
              id="create_new_engage"
              value="create_new_engage"
              onChange={this._inputChange}
              checked={this.state.selectedOption === 'create_new_engage'}
            />
            <label className="form-check-label" htmlFor="create_new_engage">
              Create New
            </label>
          </div>
        </div>
        {renderMessageSelection()}
        <div className="d-flex justify-content-between mt-4">
          <button
            className="btn btn-white border px-5 rounded-0"
            onClick={() => this.props.onSelectStep('postsubmit')}
          >
            <i className="fa fa-arrow-left mr-2" />
            Back
          </button>
          <button
            className="btn btn-primary px-5 ml-auto rounded-0"
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

SubmitAction.propTypes = {
  onSelectStep: PropTypes.func.isRequired,
  campaignAdd: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  workflows: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  campaignAdd: getCampaignAdd(state),
  workflows: getGeneralWorkflows(state)
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
  )(SubmitAction)
);
