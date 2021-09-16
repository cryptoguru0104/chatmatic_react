import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import { Popover } from 'components';
import UserInputSettings from '../UserInputSettings';
import TextEdit from '../TextEdit';
import classnames from 'classnames';
import uuidv1 from 'uuid/v1';
import { getActiveItem, getCurrentStep } from '../../services/selector';

import {
  updateItemInfo,
  deleteItemInfo,
  addStepInfo,
  updateEngageInfo
} from '../../services/actions';
import { Svg } from "../../../../Layout";

import './styles.css';

class UserInput extends React.Component {
  state = {
    activeSettings: null,
    target: null
  };

  _deleteComponent = () => {
    Swal({
      title: 'Are you sure?',
      text: 'Please verify that you want to delete this User Input',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete this User Input',
      cancelButtonText: 'No, I want to keep it',
      confirmButtonColor: '#f02727'
    }).then(result => {
      if (result.value) {
        this.props.actions.deleteItemInfo(this.props.itemIndex);
      }
    });
  };

  _save = (userInputSettings, workflowType) => {
    const { actions, itemIndex } = this.props;
    let nextStepUid;
    if (workflowType === 'new') {
      nextStepUid = uuidv1();
      userInputSettings.nextStepUid = nextStepUid;
    }

    actions.updateItemInfo(itemIndex, { ...userInputSettings });
    if (nextStepUid) {
      this.props.actions.addStepInfo(nextStepUid);
      this.props.actions.updateEngageInfo({
        activeStep: nextStepUid
      });
    }
    this.setState({
      target: null
    });
  };

  render() {
    const { itemIndex, pageId } = this.props;

    return (
      <React.Fragment>
        <div className="position-relative d-flex flex-column text-container userinput-container">
          <div className="d-flex flex-column position-relative text-content">
            <TextEdit
              placeholder="Ask Your Subscriber For Information"
              textMessage={this.props.currentItem.textMessage || ''}
              updateItemInfo={data =>
                this.props.actions.updateItemInfo(this.props.itemIndex, data)
              }
            />
          </div>
          <div
            className="position-absolute d-flex justify-content-center align-items-center bg-white delete-btn"
            onClick={this._deleteComponent}
          >
            <Svg name="delete" />
          </div>
          {this.state.target && (
            <Popover
              isOpen={true}
              target={this.state.target}
              offset={75}
              toggle={() => this.setState({ target: null })}
              className="popover-quick-reply"
            >
              <UserInputSettings
                onSave={this._save}
                userInputSettings={this.props.currentItem}
              />
            </Popover>
          )}
          <div className="text-container my-0">
            <div className="connector" />
          </div>
          <div className="position-relative value-container">
            <div className="d-flex flex-column align-items-center settings-container">
              <div className="d-flex justify-content-center flex-wrap">
                <button
                  className={classnames('btn btn-link btn-settings', {
                    active: this.state.target
                  })}
                  onClick={event => this.setState({ target: event.target })}
                >
                  <i className="fa fa-cogs" />
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

UserInput.propTypes = {
  itemIndex: PropTypes.number.isRequired,
  pageId: PropTypes.string.isRequired,
  currentStep: PropTypes.object.isRequired,
  currentItem: PropTypes.shape({
    customFieldUid: PropTypes.number,
    nextStepUid: PropTypes.any,
    textMessage: PropTypes.string,
    type: PropTypes.string.isRequired
  }).isRequired,
  actions: PropTypes.shape({
    updateItemInfo: PropTypes.func.isRequired,
    deleteItemInfo: PropTypes.func.isRequired
  }).isRequired
};

const mapStateToProps = (state, props) => ({
  currentItem: getActiveItem(state, props),
  currentStep: getCurrentStep(state)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      updateItemInfo,
      deleteItemInfo,
      addStepInfo,
      updateEngageInfo
    },
    dispatch
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserInput);
