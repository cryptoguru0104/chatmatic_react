import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import _ from 'lodash';

/** Import components */
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'components';

import { getActiveItem, getCurrentStep } from '../../services/selector';
import {
  updateItemInfo,
  deleteItemInfo,
  swapItem
} from '../../services/actions';
import { Svg } from "../../../../Layout";

import './styles.css';

class Delay extends React.Component {
  _deleteComponent = () => {
    Swal({
      title: 'Are you sure?',
      text: 'Please verify that you want to delete this delay',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete this delay',
      cancelButtonText: 'No, I want to keep it',
      confirmButtonColor: '#f02727'
    }).then(result => {
      if (result.value) {
        this.props.actions.deleteItemInfo(this.props.itemIndex);
      }
    });
  };

  render() {
    return (
      <div className="position-relative d-flex flex-column delay-container">
        <div className="d-flex align-items-center delay-header">
          <span>Select a delay(sec)</span>
        </div>
        <div className={"d-flex flex-column delay-content" + (this.props.options.showTyping ? "" : " delay-footer")}>
          <UncontrolledDropdown style={{ display: 'flex' }}>
            <DropdownToggle
              className="d-flex justify-content-between align-items-center m-0 flex-grow-1"
              style={{
                boxShadow: 'none',
                borderRadius: '6px',
                background: '#fff',
                color: '#6b6f87',
                size: '15px',
                border: 'none !important',
              }}
              caret
            >
              <span>{this.props.currentItem.delayTime}</span>
            </DropdownToggle>

            <DropdownMenu
              style={{
                width: '100%',
                marginLeft: -5,
                marginTop: 0,
                padding: 0,
                boxShadow: 'none',
                border: '0px solid #ebebeb'
              }}
              right
            >
              {_.range(10).map((item, index) => (
                <DropdownItem key={index}>
                  <div
                    onClick={() =>
                      this.props.actions.updateItemInfo(this.props.itemIndex, {
                        delayTime: index + 1
                      })
                    }
                  >
                    {index + 1}
                  </div>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
        {this.props.options.showTyping && <label className="d-flex align-items-center delay-footer">
          <input
            type="checkbox"
            checked={this.props.currentItem.showTyping}
            onChange={event =>
              this.props.actions.updateItemInfo(this.props.itemIndex, {
                showTyping: event.target.checked
              })
            }
          />
          <span className="pl-2">Show Typing</span>
        </label> }
        <div className="position-absolute d-flex flex-column swap-container">
          {this.props.itemIndex > 0 && (
            <button
              className="btn btn-link btn-swap-prev mr-0"
              onClick={() =>
                this.props.actions.swapItem(
                  this.props.itemIndex,
                  this.props.itemIndex - 1
                )
              }
            >
              <i className="fa fa-arrow-up" />
            </button>
          )}
          {this.props.currentStep.items.length - 1 > this.props.itemIndex &&
            this.props.currentStep.items[this.props.itemIndex + 1].type !==
              'free_text_input' && (
              <button
                className="btn btn-link btn-swap-next"
                onClick={() =>
                  this.props.actions.swapItem(
                    this.props.itemIndex,
                    this.props.itemIndex + 1
                  )
                }
              >
                <i className="fa fa-arrow-down" />
              </button>
            )}
        </div>
        <div
          className="position-absolute d-flex justify-content-center align-items-center bg-white delete-btn"
          onClick={this._deleteComponent}
        >
          <Svg name="delete" />
        </div>
      </div>
    );
  }
}

Delay.propTypes = {
  itemIndex: PropTypes.number.isRequired,
  currentStep: PropTypes.object.isRequired,
  currentItem: PropTypes.shape({
    type: PropTypes.string.isRequired,
    showTyping: PropTypes.bool,
    delayTime: PropTypes.number
  }).isRequired,
  actions: PropTypes.shape({
    updateItemInfo: PropTypes.func.isRequired,
    deleteItemInfo: PropTypes.func.isRequired
  }).isRequired,
  options: {
    showTyping: PropTypes.bool
  }.isRequired
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
      swapItem
    },
    dispatch
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Delay);
