import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import CreatableSelect from 'react-select/lib/Creatable';
import { toastr } from 'react-redux-toastr';
import { orderBy } from 'lodash';
import { getTagsState } from 'services/tags/selector';
import { getActiveWorkflows } from 'services/workflows/selector';
import { getAutomationsState } from '../../../Settings/scenes/Automations/services/selector';
import { addTag } from 'services/tags/actions';
import { getEngageAddState } from '../../services/selector';
import CustomFieldSelect from '../CustomFieldSelect';
import { defaultCustomFields } from 'constants/AppConstants';

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'components';

import './styles.css';

export const userInputFormats = [
  {
    key: 'text',
    label: 'Text'
  },
  {
    key: 'number',
    label: 'Number'
  },
  {
    key: 'date',
    label: 'Date'
  }
];

class UserInputSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userInputFormat: 'text',
      automationUid: this.props.userInputSettings.automationUid || null,
      customFieldUid: this.props.userInputSettings.customFieldUid || null,
      tags: this.props.userInputSettings.tags || [],
      nextStepUid: this.props.userInputSettings.nextStepUid || null,
      workflowType: this.props.userInputSettings.nextStepUid
        ? this.props.steps.findIndex(
            s => s.stepUid == this.props.userInputSettings.nextStepUid
          ) > -1
          ? 'existing'
          : 'workflow'
        : 'new'
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.addingTag) {
      Swal({
        title: 'Please wait...',
        text: 'We are adding a new tag to the page...',
        onOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
    } else if (this.props.addingTag) {
      Swal.close();
      if (nextProps.addingTagError) {
        Swal(nextProps.addingTagError);
      }
    }
  }

  _changeUserInputFormat = type => {
    this.setState({
      userInputFormat: type
    });
  };

  _save = () => {
    const { customFieldUid } = this.state;

    if (!customFieldUid) {
      toastr.warning('Please Select "Save Response to Field"');
    } else {
      const tags = this.state.tags.map(tag => {
        const pageTag = this.props.pageTags.find(
          pageTag => pageTag.value === tag.value
        );

        if (!pageTag) {
          Swal(`The tag ${tag.value} was not added to this page.`);
          return tag;
        } else {
          return pageTag;
        }
      });

      this.props.onSave(
        {
          ...this.props.userInputSettings,
          customFieldUid: this.state.customFieldUid,
          tags,
          automationUid: this.state.automationUid,
          nextStepUid: this.state.nextStepUid
        },
        this.state.workflowType
      );
    }
  };

  _customFieldOnChange = uid => {
    this.setState({ customFieldUid: uid });
  };

  render() {
    const { nextStepUid, userInputFormat } = this.state;

    const selectedAutomation = !!this.state.automationUid
      ? this.props.automations.find(
          automation => automation.uid === this.state.automationUid
        )
      : {};

    const selectedStepIndex = this.props.steps.findIndex(
      step => step.stepUid == nextStepUid
    );

    return (
      <div className="d-flex flex-column user-settings-modal-container">
        <div className="form-group">
          <label>User Input Format</label>
          <UncontrolledDropdown>
            <DropdownToggle className="py-0 m-0 w-100 dropdown-toggle" caret>
              <span>
                {
                  userInputFormats.find(reply => reply.key === userInputFormat)
                    .label
                }
              </span>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu" right>
              {userInputFormats.map((type, index) => (
                <DropdownItem key={index}>
                  <div onClick={() => this._changeUserInputFormat(type.key)}>
                    {type.label}
                  </div>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </UncontrolledDropdown>
          <span className="note">
            *chatmatic will not validate the response, it will store however the
            user inputs it
          </span>
        </div>
        <div className="d-flex flex-column action-type-container">
          <CustomFieldSelect
            onChange={this._customFieldOnChange}
            validationType={this.state.userInputFormat}
            customFieldUid={this.state.customFieldUid}
            defaultFields={defaultCustomFields}
          />
        </div>
        <div className="d-flex flex-column action-type-container">
          <div className="form-group">
            <label className="mt-2">User Input Response</label>
            <div className="d-flex mb-0 action-types">
              <label className="d-flex mb-0">
                <input
                  onChange={event =>
                    this.setState({
                      workflowType: event.target.value,
                      nextStepUid: null
                    })
                  }
                  type="radio"
                  value="existing"
                  checked={this.state.workflowType === 'existing'}
                  disabled={this.props.steps.length < 2}
                />
                <span className="pl-2">Send Existing</span>
              </label>
              <label className="d-flex ml-5 mb-0">
                <input
                  onChange={event =>
                    this.setState({
                      workflowType: event.target.value,
                      nextStepUid: null
                    })
                  }
                  type="radio"
                  value="new"
                  checked={this.state.workflowType === 'new'}
                />
                <span className="pl-2">Send New</span>
              </label>
            </div>
            <div className="d-flex mb-0 action-types align-items-start">
              <label className="d-flex mb-0">
                <input
                  onChange={event =>
                    this.setState({
                      workflowType: event.target.value,
                      nextStepUid: null
                    })
                  }
                  type="radio"
                  value="workflow"
                  disabled={
                    this.props.workflows.filter(
                      x => x.uid !== this.props.engage.uid
                    ).length <= 0
                  }
                  checked={this.state.workflowType === 'workflow'}
                />
                <span className="pl-2">Send Existing Workflow</span>
              </label>
            </div>
            {this.state.workflowType === 'existing' && (
              <div className="form-group mt-2">
                <label>Select From Existing:</label>
                <UncontrolledDropdown>
                  <DropdownToggle
                    className="py-0 m-0 w-100 dropdown-toggle"
                    caret
                  >
                    <span>
                      {this.state.nextStepUid
                        ? this.props.steps[selectedStepIndex].name ||
                          `Step ${selectedStepIndex + 1}`
                        : 'Select...'}
                    </span>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu" right>
                    {this.props.steps.map((step, index) => {
                      if (step.stepUid !== this.props.activeStep) {
                        return (
                          <DropdownItem key={index}>
                            <div
                              onClick={() =>
                                this.setState({ nextStepUid: step.stepUid })
                              }
                            >
                              {step.name || `Step ${index + 1}`}
                            </div>
                          </DropdownItem>
                        );
                      }
                    })}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            )}
            {this.state.workflowType === 'workflow' && (
              <div className="form-group mt-2">
                <label>Select From Existing Workflow:</label>
                <UncontrolledDropdown>
                  <DropdownToggle
                    className="py-0 m-0 w-100 dropdown-toggle"
                    caret
                  >
                    <span>
                      {this.state.nextStepUid
                        ? this.props.workflows.find(
                            x => x.steps[0].stepUid == this.state.nextStepUid
                          ).name
                        : 'Select...'}
                    </span>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu" right>
                    {orderBy(
                      this.props.workflows.filter(
                        x => x.uid !== this.props.engage.uid
                      ),
                      'name',
                      'asc'
                    ).map((workflow, index) => {
                      return (
                        <DropdownItem key={index}>
                          <div
                            onClick={() =>
                              this.setState({
                                nextStepUid: workflow.steps[0].stepUid
                              })
                            }
                          >
                            {workflow.name}
                          </div>
                        </DropdownItem>
                      );
                    })}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            )}
          </div>
        </div>
        <div className="form-group divider tags-container">
          <div className="d-flex justify-content-between align-items-center py-1">
            <label>Tag User</label>
            <span>Optional</span>
          </div>
          <CreatableSelect
            isMulti
            onChange={tags => this.setState({ tags })}
            options={this.props.pageTags}
            isClearable={false}
            getOptionLabel={option =>
              'uid' in option ? option.value : option.label
            }
            getOptionValue={option =>
              (option.uid && option.uid.toString()) || option.value
            }
            onCreateOption={value => {
              this.setState({
                tags: this.state.tags.concat([{ value, uid: value }])
              });
              this.props.actions.addTag(this.props.match.params.id, value);
            }}
            value={this.state.tags}
            isValidNewOption={label => {
              if (!label) return false;

              let returnValue = true;

              this.props.pageTags.forEach(option => {
                if (label.toLowerCase() === option.value.toLowerCase())
                  returnValue = false;
              });

              return returnValue;
            }}
          />
        </div>
        <div className="form-group">
          <div className="d-flex justify-content-between align-items-center py-1">
            <label>Trigger Automation</label>
            <span>Optional</span>
          </div>
          <UncontrolledDropdown>
            <DropdownToggle className="py-0 m-0 w-100 dropdown-toggle" caret>
              <span>{selectedAutomation.name || ''}</span>
            </DropdownToggle>

            <DropdownMenu className="dropdown-menu" right>
              {this.props.automations.map((automation, index) => (
                <DropdownItem key={index}>
                  <div
                    onClick={() =>
                      this.setState({ automationUid: automation.uid })
                    }
                  >
                    {automation.name}
                  </div>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
        <button
          className="btn btn-primary btn-edit-message"
          onClick={this._save}
        >
          {this.state.workflowType === 'new'
            ? 'Edit Next Message'
            : 'Save Changes'}
        </button>
      </div>
    );
  }
}

UserInputSettings.propTypes = {
  userInputSettings: PropTypes.shape({
    customFieldUid: PropTypes.number,
    nextStepUid: PropTypes.any,
    tags: PropTypes.array,
    automationUid: PropTypes.number
  }),
  onSave: PropTypes.func.isRequired,
  pageTags: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any,
      label: PropTypes.any
    })
  ).isRequired,
  automations: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.any.isRequired,
      pageUid: PropTypes.number.isRequired,
      active: PropTypes.bool,
      withinDay: PropTypes.number,
      total: PropTypes.number,
      name: PropTypes.string,
      tags: PropTypes.array,
      userUnsubscribe: PropTypes.bool,
      triggerIntegrations: PropTypes.array,
      notifyAdmins: PropTypes.array
    })
  ),
  actions: PropTypes.object.isRequired,
  addingTag: PropTypes.bool.isRequired,
  addingTagError: PropTypes.any,
  activeStep: PropTypes.any.isRequired,
  steps: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  pageTags: getTagsState(state).tags,
  addingTag: getTagsState(state).loading,
  addingTagError: getTagsState(state).error,
  automations: getAutomationsState(state).automations,
  activeStep: getEngageAddState(state).activeStep,
  engage: getEngageAddState(state),
  steps: getEngageAddState(state).steps,
  workflows: getActiveWorkflows(state)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      addTag
    },
    dispatch
  )
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UserInputSettings)
);
