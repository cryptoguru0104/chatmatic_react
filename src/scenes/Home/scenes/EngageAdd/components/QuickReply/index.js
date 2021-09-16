import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { orderBy } from 'lodash';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { Picker } from 'emoji-mart';
import CreatableSelect from 'react-select/lib/Creatable';
import { toastr } from 'react-redux-toastr';

import { getTagsState } from 'services/tags/selector';
import { getActiveWorkflows } from 'services/workflows/selector';
import { getAutomationsState } from '../../../Settings/scenes/Automations/services/selector';
import { deleteQuickReply } from '../../services/actions';
import { addTag } from 'services/tags/actions';
import { getEngageAddState, getCurrentStep } from '../../services/selector';
import { getPageFromUrl } from 'services/pages/selector';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'components';
import CustomFieldSelect from '../CustomFieldSelect';

import './styles.css';
import Constants from '../../../../../../config/Constants';
import { defaultCustomFields } from 'constants/AppConstants';

const replyTypes = {
  fb: [
    {
      key: 'text',
      label: 'Text'
    },
    {
      key: 'email',
      label: 'Email'
    },
    {
      key: 'phone',
      label: 'Phone Number'
    }
  ],
  ig: [
    {
      key: 'text',
      label: 'Text'
    },
  ]
};
const userInputFormat = 'text';

class QuickReply extends React.Component {
  constructor(props) {
    super(props);

    this.currentEmojiInputPos = null;

    this.state = {
      replyType: this.props.quickReply.replyType || 'text',
      showEmojiBox: false,
      automationUid: this.props.quickReply.automationUid || null,
      customFieldUid: this.props.quickReply.customFieldUid || null,
      customFieldValue: this.props.quickReply.customFieldValue || null,
      tags: this.props.quickReply.tags || [],
      workflowType: this.props.quickReply.nextStepUid
        ? this.props.steps.findIndex(
          s => s.stepUid === this.props.quickReply.nextStepUid
        ) > -1
          ? 'existing'
          : 'workflow'
        : Constants.builderTypes.messageConfig.type,
      nextStepUid: this.props.quickReply.nextStepUid || null,
      replyText:
        this.props.quickReply.replyText ||
        this._getReplyText(this.props.quickReply.replyType || 'text')
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

  _getReplyText = type => {
    switch (type) {
      case 'email':
        return 'Email' || '';
      case 'phone':
        return 'Phone' || '';
      case 'location':
        return 'Location' || '';
      default:
        return '';
    }
  };

  _changeReplyType = type => {
    this.setState({ replyType: type, replyText: this._getReplyText(type) });
  };

  _saveQuickReply = () => {
    if (!this.state.replyText) {
      toastr.warning('Please type the Quick Reply Text.');
    } else if (
      !this.state.nextStepUid &&
      this.state.workflowType === 'existing'
    ) {
      toastr.warning('Please select one of the existing messages.');
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
          ...this.props.quickReply,
          replyType: this.state.replyType,
          replyText: this.state.replyText,
          tags,
          automationUid: this.state.automationUid,
          customFieldUid: this.state.customFieldUid,
          customFieldValue: this.state.customFieldValue
        },
        this.state.workflowType,
        this.state.nextStepUid
      );
    }
  };

  _addEmoji = event => {
    if (event.unified.length <= 5) {
      let emojiPic = String.fromCodePoint(`0x${event.unified}`);

      this.setState({
        replyText: [
          this.state.replyText.slice(0, this.currentEmojiInputPos),
          emojiPic,
          this.state.replyText.slice(this.currentEmojiInputPos)
        ].join(''),
        showEmojiBox: false
      });
    } else {
      let sym = event.unified.split('-');
      let codesArray = [];
      sym.forEach(el => codesArray.push('0x' + el));

      let emojiPic = String.fromCodePoint(...codesArray);
      this.setState({
        replyText: [
          this.state.replyText.slice(0, this.currentEmojiInputPos),
          emojiPic,
          this.state.replyText.slice(this.currentEmojiInputPos)
        ].join(''),
        showEmojiBox: false
      });
    }

    if (this.labelRef) {
      this.replyTextRef.focus();
    }
  };

  _customFieldOnChange = uid => {
    this.setState({ customFieldUid: uid });
  };

  _deleteItem = () => {
    Swal({
      title: 'Are you sure?',
      text: 'Please verify that you want to delete the quick reply.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#f02727'
    }).then(result => {
      if (result.value) {
        this.props.actions.deleteQuickReply(this.props.quickReplyIndex);
      }
    });
  };

  render() {
    const { isRestrictedForJSON, currentStep, steps, newWorkflowType, page } = this.props;
    const selectedAutomation = !!this.state.automationUid
      ? this.props.automations.find(
        automation => automation.uid === this.state.automationUid
      ) || {}
      : {};

    let isDisableOtherTypes = false;
    if (
      currentStep &&
      steps[0].stepUid === currentStep.stepUid &&
      (
        newWorkflowType === 'privateReply' ||
        newWorkflowType === 'JSON'
      )
    ) {
      isDisableOtherTypes = true;
    }

    let pageReplyTypes = [];
    if(page.source) {
      pageReplyTypes = replyTypes[page.source];
    }

    const _renderReplyText = () => {
      if (this.state.replyType === 'text') {
        return (
          <div className="form-group">
            <label>Quick Reply Text:</label>
            <div className="position-relative d-flex align-items-center value-container">
              <input
                ref={ref => (this.replyTextRef = ref)}
                type="text"
                value={this.state.replyText}
                onClick={event => {
                  this.currentEmojiInputPos =
                    event.target.selectionStart;
                }}
                onKeyUp={event => {
                  this.currentEmojiInputPos =
                    event.target.selectionStart;
                }}
                onChange={event => {
                  if (event.target.value.length <= 20) {
                    this.setState({
                      replyText: event.target.value
                    });
                  }
                  this.currentEmojiInputPos =
                    event.target.selectionStart;
                }}
              />
              <div className="d-flex align-items-center position-absolute">
                <button
                  className="btn btn-link p-0"
                  onClick={() =>
                    this.setState({
                      showEmojiBox: !this.state
                        .showEmojiBox
                    })
                  }
                >
                  <i className="fa fa-smile-o" />
                </button>
                <span
                  style={{
                    color:
                      this.state.replyText.length === 20
                        ? 'red'
                        : 'inherit'
                  }}
                >
                  {this.state.replyText.length}
                                    /20
                                </span>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="form-group">
            <label>Save As:</label>
            <input
              type="text"
              className="form-control input-save-as"
              value={this.state.replyText}
              onChange={event =>
                this.setState({ replyText: event.target.value })
              }
              disabled={this.state.replyType !== 'text'}
            />
          </div>
        );
      }
    };

    const _renderMessageContainer = () => {
      const selectedStepIndex = this.props.steps.findIndex(
        step => step.stepUid === this.state.nextStepUid
      );

      return (
        <div className="d-flex flex-column action-type-container">
          <label className="mt-2">Button Action</label>
          <div className="form-group row">
            <label className="mt-2 col-10">
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
            {Object.keys(Constants.builderTypes).map((key, idx) => (
              <label className="mt-2 col-10" key={idx}>
                <input
                  onChange={event =>
                    this.setState({
                      workflowType: event.target.value,
                      nextStepUid: null
                    })
                  }
                  type="radio"
                  value={Constants.builderTypes[key].type}
                  checked={
                    this.state.workflowType ===
                    Constants.builderTypes[key].type
                  }
                />
                <span className="pl-2">
                  {Constants.builderTypes[key].label}
                </span>
              </label>
            ))}
            <label className="mt-2 col-10">
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
          {/* <div className="d-flex mb-0 action-types align-items-start">
                    </div> */}
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
                      ? this.props.steps[
                        selectedStepIndex
                      ].name ||
                      `Step ${selectedStepIndex + 1}`
                      : 'Select...'}
                  </span>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu" right>
                  {this.props.steps.map((step, index) => {
                    if (
                      step.stepUid !==
                      this.props.activeStep
                    ) {
                      return (
                        <DropdownItem key={index}>
                          <div
                            onClick={() =>
                              this.setState({
                                nextStepUid:
                                  step.stepUid
                              })
                            }
                          >
                            {step.name ||
                              `Step ${index + 1}`}
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
                        x =>
                          x.rootWorkflowStepUid ==
                          this.state.nextStepUid
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
                              nextStepUid:
                                workflow.rootWorkflowStepUid
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
      );
    };

    let selectedReplyType = pageReplyTypes.find( reply => reply.key === this.state.replyType);

    return (
      <div className="d-flex flex-column quick-reply-modal-container">
        {/* {this.props.quickReply.nextStepUid && (
                    <div className="d-flex justify-content-end quick-reply-modal-header">
                        <button
                            className="btn btn-link text-danger p-0"
                            onClick={this._deleteItem}
                        >
                            <i className="fa fa-trash-o mr-3" />
                            Delete Item
                        </button>
                    </div>
                )} */}
        {!isDisableOtherTypes &&
          <div className="form-group">
            <label>Action:</label>
            <UncontrolledDropdown>
              <DropdownToggle
                className="py-0 m-0 w-100 dropdown-toggle"
                caret
              >
                <span>{ selectedReplyType ? selectedReplyType.label : '' }</span>
              </DropdownToggle>

              <DropdownMenu className="dropdown-menu" right>
                {pageReplyTypes.map((type, index) => (
                  <DropdownItem key={index}>
                    <div
                      onClick={() =>
                        this._changeReplyType(type.key)
                      }
                    >
                      {type.label}
                    </div>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        }
        {_renderReplyText()}
        {_renderMessageContainer()}
        <div className="d-flex flex-column action-type-container">
          <CustomFieldSelect
            labelName="Save to Field"
            onChange={this._customFieldOnChange}
            validationType={userInputFormat}
            customFieldUid={this.state.customFieldUid}
            defaultFields={this.props.page.source == 'fb' ? [] : []}
          />
        </div>
        <div className="form-group">
          <div className="d-flex justify-content-between align-items-center py-1">
            <label>Save Value:</label>
            <span>Optional</span>
          </div>
          <div className="position-relative d-flex align-items-center value-container full">
            <input
              type="text"
              value={this.state.customFieldValue || ''}
              onChange={event => {
                this.setState({
                  customFieldValue: event.target.value
                });
              }}
            />
          </div>
        </div>
        <div className="form-group tags-container">
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
              (option.uid && option.uid.toString()) ||
              option.value
            }
            onCreateOption={value => {
              this.setState({
                tags: this.state.tags.concat([
                  { value, uid: value }
                ])
              });
              this.props.actions.addTag(
                this.props.match.params.id,
                value
              );
            }}
            value={this.state.tags}
            isValidNewOption={label => {
              if (!label) return false;

              let returnValue = true;

              this.props.pageTags.forEach(option => {
                if (
                  label.toLowerCase() ===
                  option.value.toLowerCase()
                )
                  returnValue = false;
              });

              return returnValue;
            }}
          />
        </div>
        {this.props.automations && this.props.automations.length > 0 && (
          <div className="form-group">
            <div className="d-flex justify-content-between align-items-center py-1">
              <label>Trigger Automation</label>
              <span>Optional</span>
            </div>
            <UncontrolledDropdown>
              <DropdownToggle
                className="py-0 m-0 w-100 dropdown-toggle"
                caret
              >
                <span>{selectedAutomation.name || 'No automation'}</span>
              </DropdownToggle>

              <DropdownMenu className="dropdown-menu" right>
                {this.props.automations.map(
                  (automation, index) => (
                    <DropdownItem key={index}>
                      <div
                        onClick={() =>
                          this.setState({
                            automationUid:
                              automation.uid
                          })
                        }
                      >
                        {automation.name}
                      </div>
                    </DropdownItem>
                  )
                )}
                <DropdownItem key={"null_index"}>
                  <div
                    onClick={() =>
                      this.setState({
                        automationUid:null
                      })
                    }
                  >
                    <div>No automation</div>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        )}
        {this.props.quickReply.nextStepUid && (
          <button
            className="btn btn-danger btn-edit-message"
            onClick={this._deleteItem}
          >
            <i className="fa fa-trash-o mr-3" />
            Delete Item
          </button>
        )}
        <button
          className="btn btn-primary btn-edit-message"
          onClick={this._saveQuickReply}
        >
          {this.state.workflowType === 'existing'
            ? 'Save Changes'
            : 'Edit Next Message'}
        </button>

        <Picker
          style={{
            display: this.state.showEmojiBox
              ? 'inline-block'
              : 'none',
            position: 'absolute',
            top: 98,
            right: 0
          }}
          onSelect={this._addEmoji}
          showSkinTones={false}
          showPreview={false}
        />
      </div>
    );
  }
}

QuickReply.propTypes = {
  quickReply: PropTypes.shape({
    replyType: PropTypes.string,
    replyText: PropTypes.string,
    tags: PropTypes.array,
    automationUid: PropTypes.number,
    customFieldUid: PropTypes.number,
    customFieldValue: PropTypes.string,
    uid: PropTypes.any
  }),
  quickReplyIndex: PropTypes.number.isRequired,
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
  isRestrictedForJSON: PropTypes.bool.isRequired,
  steps: PropTypes.array.isRequired
};

const urlParams = new URLSearchParams(window.location.search);
const mapStateToProps = (state, props) => ({
  pageTags: getTagsState(state).tags,
  addingTag: getTagsState(state).loading,
  addingTagError: getTagsState(state).error,
  automations: getAutomationsState(state).automations,
  activeStep: getEngageAddState(state).activeStep,
  engage: getEngageAddState(state),
  steps: getEngageAddState(state).steps,
  workflows: getActiveWorkflows(state),
  currentStep: getCurrentStep(state),
  newWorkflowType: urlParams.get('type'),
  page: getPageFromUrl(state, props)
});
QuickReply.defaultProps = {
  isRestrictedForJSON: false
};
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      deleteQuickReply,
      addTag
    },
    dispatch
  )
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(QuickReply)
);
