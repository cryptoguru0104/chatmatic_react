import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'components';

import { getActiveWorkflows } from 'services/workflows/selector';
import { getPersistentMenuState } from '../../services/selector';
import { updateEngageInfo } from '../../../../../EngageAdd/services/actions';

import linkIcon from 'assets/images/settings/icon-link.png';
import activeLinkIcon from 'assets/images/settings/icon-active-link.png';
import messageIcon from 'assets/images/settings/icon-message.png';
import activeMessageIcon from 'assets/images/settings/icon-active-message.png';
import './styles.css';

const action = [
  {
    value: 'link',
    label: 'LINK',
    icon: {
      active: activeLinkIcon,
      default: linkIcon
    }
  },
  {
    value: 'message',
    label: 'MESSAGE',
    icon: {
      active: activeMessageIcon,
      default: messageIcon
    }
  }
];

class OptionActionModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actionType: this.props.actionType,
      actionValue: this.props.actionValue
    };
  }

  _deleteMenu = () => {
    Swal({
      title: 'Are you sure?',
      text: 'Please verify that you want to delete this option.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete this option',
      cancelButtonText: 'No, I want to keep it',
      confirmButtonColor: '#f02727'
    }).then(result => {
      if (result.value) {
        this.props.deleteOption();
      }
    });
  };

  _saveChange = () => {
    if (!this.state.actionType || !this.state.actionValue) {
      Swal('Please fill in all the fields.');
    } else {
      this.props.onChange({
        type: this.state.actionType,
        value: this.state.actionValue
      });
    }
  };

  _goToEngageBuilder = () => {
    this.props.actions.updateEngageInfo({
      workflowType: 'general',
      name: '',
      steps: [],
      activeStep: '',
      uid: null,
      broadcast: {}
    });

    this.props.history.push({
      pathname: `/page/${this.props.match.params.id}/engages/add/builder`,
      state: {
        redirectTo: this.props.location.pathname,
        currentMenu: this.props.currentMenu,
        activeOptionIndex: this.props.activeOptionIndex
      }
    });
  };

  _clearActionType = () => {
    this.setState({ actionValue: null });
  };

  render() {
    const activeMessage =
      this.props.workflows.find(
        workflow => workflow.uid === this.state.actionValue
      ) || {};

    return (
      <div
        className="d-flex flex-column option-action-modal-container"
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
      >
        <div className="d-flex justify-content-between align-items-center action-modal-header">
          <span>Select a Action</span>
          <button
            className="btn btn-link p-0 btn-delete-item"
            onClick={this._deleteMenu}
          >
            <i className="fa fa-trash mr-3" />
            Delete Item
          </button>
        </div>
        <button
          className={classnames('btn btn-link btn-action', {
            active: this.state.actionType === 'link'
          })}
          onClick={() =>
            this.setState({
              actionType: 'link',
              actionValue:
                this.props.actionType === 'link' ? this.props.actionValue : ''
            })
          }
        >
          <span>{action[0].label}</span>
          <img
            src={
              this.state.actionType === 'link'
                ? action[0].icon['active']
                : action[0].icon['default']
            }
            alt=""
          />
        </button>
        {this.state.actionType === 'link' && (
          <div className="d-flex flex-column menu-link-container">
            <div
              className="d-flex justify-content-between input-title-container"
              style={{ marginTop: 10 }}
            >
              <label>URL</label>
            </div>
            <input
              type="text"
              className="form-control link-input"
              value={this.state.actionValue || ''}
              onChange={event =>
                this.setState({ actionValue: event.target.value })
              }
            />
          </div>
        )}
        <button
          className={classnames('btn btn-link btn-action', {
            active: this.state.actionType === 'message'
          })}
          onClick={() =>
            this.setState({
              actionType: 'message',
              actionValue:
                this.props.actionType === 'message'
                  ? this.props.actionValue
                  : null
            })
          }
        >
          <span>{action[1].label}</span>
          <img
            src={
              this.state.actionType === 'message'
                ? action[1].icon['active']
                : action[1].icon['default']
            }
            alt=""
          />
        </button>
        {this.state.actionType === 'message' && (
          <div
            className="d-flex flex-column menu-message-container"
            style={{ marginTop: 10 }}
          >
            {!this.state.actionValue && (
              <button
                className="btn btn-link btn-create-new"
                onClick={this._goToEngageBuilder}
              >
                Create New
              </button>
            )}
            <div className="d-flex flex-column select-existing-message-container">
              <div
                className={classnames('d-flex input-title-container', {
                  'justify-content-end': !!this.state.actionValue,
                  'justify-content-between': !this.state.actionValue
                })}
              >
                {!this.state.actionValue && <label>Choose Existing</label>}
                {this.state.actionValue && (
                  <button
                    className="btn btn-link btn-delete"
                    onClick={this._clearActionType}
                  >
                    <i className="fa fa-trash" />
                    Delete Item
                  </button>
                )}
              </div>
              <UncontrolledDropdown style={{ display: 'flex' }}>
                <DropdownToggle
                  className="d-flex justify-content-between align-items-center m-0 flex-grow-1"
                  caret
                >
                  <span>{activeMessage.name || 'Select'}</span>
                </DropdownToggle>

                <DropdownMenu
                  style={{
                    width: '100%',
                    marginLeft: -5,
                    marginTop: 0,
                    padding: 0,
                    boxShadow: 'none',
                    border: '1px solid #ebebeb'
                  }}
                  right
                >
                  {this.props.workflows.map((workflow, index) => (
                    <DropdownItem key={index}>
                      <div
                        onClick={() =>
                          this.setState({ actionValue: workflow.uid })
                        }
                      >
                        {workflow.name}
                      </div>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </div>
        )}
        <button className="btn btn-primary btn-save" onClick={this._saveChange}>
          Save Changes
        </button>
      </div>
    );
  }
}

OptionActionModal.propTypes = {
  actionType: PropTypes.string.isRequired,
  actionValue: PropTypes.any,
  currentMenu: PropTypes.object,
  activeOptionIndex: PropTypes.any,
  workflows: PropTypes.array.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  deleteOption: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  workflows: getActiveWorkflows(state),
  currentMenu: getPersistentMenuState(state).currentMenu,
  activeOptionIndex: getPersistentMenuState(state).activeOptionIndex
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      updateEngageInfo
    },
    dispatch
  )
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OptionActionModal)
);
