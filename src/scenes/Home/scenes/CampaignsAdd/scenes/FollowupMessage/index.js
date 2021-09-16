import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getCampaignAdd } from '../../services/selector';
import { addTag, getTags } from 'services/tags/actions';
import { getCustomFields } from 'services/customfields/actions';
import { getTagsState } from 'services/tags/selector';
import { getActiveWorkflows } from 'services/workflows/selector';
import {
  clearCampaignAddState,
  updateNewCampaignInfo
} from '../../services/actions';
import Swal from 'sweetalert2';
import './styles.css';
import { Button } from 'components';
import { toastr } from 'react-redux-toastr';
import CustomFieldSelect from 'scenes/Home/scenes/EngageAdd/components/CustomFieldSelect';
import Select from 'react-select';
import Constants from 'config/Constants';
/** Import Components */

const EVENT_TYPES = [
  { name: 'User Subscribes To', type: 'workflow' },
  { name: 'User Is Assigned Tag', type: 'tag' },
  { name: 'User Is Assigned Attribute', type: 'attribute' }
];
const STEPS = [1, 2, 3];
class FollowupMessage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentStep: props.campaignAdd.uid == undefined ? 1 : 3,
      delayHours: 0,
      delayMinutes: 0
    };
  }

  componentWillMount() {
    const { actions, campaignAdd } = this.props;
    actions.getTags(this.props.match.params.id);
    actions.getCustomFields(this.props.match.params.id);

    if (campaignAdd.uid !== undefined) {
      this._setInitialState();
    }
  }

  componentWillUnmount() {
    this.props.actions.clearCampaignAddState();
  }

  _setInitialState = () => {
    const { campaignAdd } = this.props;

    const minutes = campaignAdd.followUpDelay / 60;
    this.setState({
      delayHours: Math.floor(minutes / 60),
      delayMinutes: minutes % 60
    });
  };

  componentDidUpdate(prevProps) {
    const { campaignAdd, loading } = this.props;
    if (
      prevProps.campaignAdd !== campaignAdd &&
      campaignAdd.uid == undefined &&
      prevProps.campaignAdd.uid !== undefined
    ) {
      this.setState({ delayHours: 0, delayMinutes: 0, currentStep: 1 });
    }

    if (loading !== prevProps.loading) {
      if (loading) {
        Swal({
          title: 'Please wait...',
          text: 'We are creating a new campaign...',
          onOpen: () => {
            Swal.showLoading();
          },
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false
        });
      } else {
        Swal.close();
        this.props.history.push(
          `/page/${this.props.match.params.id}/campaigns`
        );
      }
    }
  }

  _inputChange = event => {
    this.props.actions.updateNewCampaignInfo(
      this.props.match.params.id,
      { [event.target.name]: event.target.value },
      false
    );
  };

  _delayChangeHours = e => {
    this.setState({ delayHours: parseInt(e.target.value) }, () => {
      this._updateDelay();
    });
  };
  _delayChangeMinutes = e => {
    this.setState({ delayMinutes: parseInt(e.target.value) }, () => {
      this._updateDelay();
    });
  };
  _updateDelay = () => {
    this._updateCampaign({
      name: 'followUpDelay',
      value: (60 * this.state.delayHours + this.state.delayMinutes) * 60
    });
  };
  _messageChange = e => {
    this.setState({ message: e.target.value });
  };

  _handleNextBtnClick = e => {
    const { currentStep, delayHours, delayMinutes } = this.state;
    const { campaignAdd } = this.props;

    if (currentStep == 1) {
      if (!campaignAdd.campaignName) {
        toastr.warning('Campaign Name', 'Please enter a campaign name');
        return;
      }
      if (!campaignAdd.eventType) {
        toastr.warning(
          'Choose an Event',
          'Please choose an event that will trigger this message'
        );
        return;
      }
      if (campaignAdd.eventType == 'tag' && !campaignAdd.eventTypeUid) {
        toastr.warning('Select an Assigned Tag');
        return;
      }
      if (campaignAdd.eventType == 'workflow' && !campaignAdd.eventTypeUid) {
        toastr.warning('Select an Engagement');
        return;
      }
      if (campaignAdd.eventType == 'attribute' && !campaignAdd.eventTypeUid) {
        toastr.warning('Select an Attribute');
        return;
      }
    }
    if (currentStep == 2) {
      const delay = delayHours * 60 + delayMinutes;
      if (delay <= 0) {
        toastr.warning(
          'Select a Delay',
          'Delay must be greater than 0 Minutes'
        );
        return;
      }
    }
    if (currentStep == 3) {
      if (!campaignAdd.workflowUid) {
        toastr.warning(
          'Select a Message',
          'Select what message you would like to send'
        );
        return;
      }
      this.props.actions.updateNewCampaignInfo(
        this.props.match.params.id,
        {},
        true
      );
      return;
    }
    this.setState({ currentStep: currentStep + 1 });
  };

  _handlePreviousBtnClick = e => {
    const { currentStep } = this.state;
    this.setState({ currentStep: currentStep - 1 });
  };

  _updateCampaign = prop => {
    this.props.actions.updateNewCampaignInfo(
      this.props.match.params.id,
      { [prop.name]: prop.value },
      false
    );
  };
  renderStep1() {
    const { campaignAdd } = this.props;
    const { eventType } = this.state;

    return (
      <div className="flex-grow-1">
        <div className="form-group mb-4">
          <label className="m-0">Campaign Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Name..."
            value={campaignAdd.campaignName || ''}
            onChange={this._inputChange}
            name="campaignName"
          />
        </div>
        <div className="form-group topBorder">
          <label className="mb-2 ml-0 text-left">
            Choose An Event That Will Trigger This Message
          </label>
          <div className="step-navigator">
            {EVENT_TYPES.map((t, i) => (
              <div
                key={i}
                className={classnames(
                  'position-relative step-name',
                  campaignAdd.eventType == t.type && 'active'
                )}
                onClick={e => {
                  this._updateCampaign({ name: 'eventType', value: t.type });
                  this._updateCampaign({ name: 'eventTypeUid', value: null });
                }}
              >
                {t.name}
              </div>
            ))}
          </div>
        </div>
        {campaignAdd.eventType == 'workflow' && (
          <div className="form-group tags-container topBorder">
            <div className="d-flex justify-content-between align-items-center py-1">
              <label>Select Engagement:</label>
            </div>
            <Select
              onChange={workflow => {
                this._updateCampaign({
                  name: 'eventTypeUid',
                  value: workflow.uid
                });
              }}
              options={this.props.workflows}
              getOptionLabel={option => option.name}
              getOptionValue={option =>
                (option.uid && option.uid.toString()) || option.value
              }
              isClearable
              isSearchable
              value={this.props.workflows.find(
                x => x.uid == campaignAdd.eventTypeUid
              )}
            />
          </div>
        )}
        {campaignAdd.eventType == 'attribute' && (
          <div className="d-flex flex-column action-type-container topBorder">
            <CustomFieldSelect
              labelName="Select Attribute:"
              onChange={id => {
                this._updateCampaign({ name: 'eventTypeUid', value: id });
              }}
              validationType={null}
              customFieldUid={campaignAdd.eventTypeUid}
            />
          </div>
        )}

        {campaignAdd.eventType == 'tag' && (
          <div className="form-group tags-container topBorder">
            <div className="d-flex justify-content-between align-items-center py-1">
              <label>Select Assigned Tag:</label>
            </div>
            <Select
              onChange={tag => {
                this._updateCampaign({ name: 'eventTypeUid', value: tag.uid });
              }}
              options={this.props.pageTags}
              isClearable={true}
              getOptionLabel={option =>
                'uid' in option ? option.value : option.label
              }
              getOptionValue={option =>
                (option.uid && option.uid) || option.value
              }
              value={this.props.pageTags.find(
                x => x.uid == campaignAdd.eventTypeUid
              )}
            />
          </div>
        )}
      </div>
    );
  }

  renderStep2() {
    return (
      <div className="flex-grow-1">
        <div className="form-group mb-4">
          <label className="m-0">
            How long would you like this delay to be?
            {false && <span>Note: Max delay is 23 Hours, 59 Minutes</span>}
          </label>
          <div>
            <input
              type="number"
              min="0"
              max="23"
              className="form-control d-inline-block mr-1"
              value={this.state.delayHours}
              onChange={this._delayChangeHours}
              name="delayHours"
              style={{ width: '100px' }}
            />
            <span className="mr-3">Hours</span>
            <input
              type="number"
              className="form-control d-inline-block mr-1"
              value={this.state.delayMinutes}
              onChange={this._delayChangeMinutes}
              name="delayMinutes"
              min="0"
              max="59"
              style={{ width: '100px' }}
            />
            <span className="mr-3">Minutes</span>
          </div>
        </div>
      </div>
    );
  }

  renderStep3() {
    const { campaignAdd, workflows } = this.props;

    return (
      <div className="d-flex flex-column scrollable-container">
        <div
          className="form-group mb-4 scrollable-container"
          style={{ flex: '1', overflow: 'hidden' }}
        >
          <label className="m-0">
            What message would you like to send at that time?
          </label>
          <div className="w-100" style={{ overflowY: 'auto' }}>
            <div className="list-group list-group-flush">
              {workflows.map((w, i) => (
                <div
                  className={classnames(
                    'list-group-item list-group-item-action py-2 px-3 border-top-0 clickable',
                    !!campaignAdd.workflowUid &&
                    w.uid == campaignAdd.workflowUid
                      ? 'active'
                      : ''
                  )}
                  onClick={() => {
                    this._updateCampaign({ name: 'workflowUid', value: w.uid });
                  }}
                  key={w.uid}
                >
                  <img
                    src={Constants.workflowIcons[w.workflowType]}
                    alt=""
                    width="11"
                    height="11"
                    className="mr-2"
                  />
                  {w.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderStepButtons(step) {
    const { campaignAdd } = this.props;
    const { currentStep } = this.state;
    if (currentStep !== step) {
      return null;
    }
    return (
      <div style={{ flex: '0 0 auto' }}>
        <Button
          className="float-right mt-3 px-3 btn-next"
          color="primary"
          onClick={this._handleNextBtnClick}
        >
          {step == 3
            ? campaignAdd.uid == undefined
              ? 'Finish'
              : 'Save'
            : 'Next'}
          <i
            className={classnames(
              'fa ml-2',
              step == 3 ? 'fa-save' : 'fa-arrow-right'
            )}
          />
        </Button>
      </div>
    );
  }

  renderStepper(step) {
    return (
      <div style={{ flex: '0 0 auto' }}>
        <div>
          <ul className="stepper stepper-horizontal pt-0">
            <li className={classnames(step >= 1 && 'completed')}>
              <a>
                <span className="circle">1</span>
                <span className="label" />
              </a>
            </li>
            <li className={classnames(step >= 2 && 'completed')}>
              <a>
                <span className="circle">2</span>
                <span className="label" />
              </a>
            </li>
            <li className={classnames(step >= 3 && 'completed')}>
              <a>
                <span className="circle">3</span>
                <span className="label" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  render() {
    const { currentStep } = this.state;

    return (
      <div style={{ position: 'relative' }}>
        <div className="d-flex flex-row w-100 justify-content-start">
          {STEPS.map(s => {
            if (currentStep < s) {
              return null;
            }
            return (
              <div
                className="d-flex flex-column card steps-container scrollable-container mr-3"
                key={s}
              >
                <div className="card-body d-flex flex-column justify-content-between scrollable-container">
                  {this.renderStepper(s)}
                  {s == 1 && this.renderStep1()}
                  {s == 2 && this.renderStep2()}
                  {s == 3 && this.renderStep3()}
                  {this.renderStepButtons(s)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

FollowupMessage.propTypes = {
  campaignAdd: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  workflows: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  pageTags: getTagsState(state).tags,
  campaignAdd: getCampaignAdd(state),
  loading: state.default.scenes.campaignAdd.loading,
  workflows: getActiveWorkflows(state)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      addTag,
      clearCampaignAddState,
      getCustomFields,
      getTags,
      updateNewCampaignInfo
    },
    dispatch
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FollowupMessage);
