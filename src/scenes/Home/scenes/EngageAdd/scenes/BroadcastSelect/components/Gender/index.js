import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import PropTypes from 'prop-types';

import Type from '../Type';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'components';

import {
  deleteBroadcastCondition,
  updateBroadcastCondition
} from '../../../../services/actions';
import { getEngageAddState } from '../../../../services/selector';

const GENDERS = [
  {
    key: 'male',
    label: 'Male'
  },
  {
    key: 'female',
    label: 'Female'
  }
];

class Gender extends React.Component {
  render() {
    const condition = this.props.conditions.find(
      (condition, index) => index === this.props.conditionIndex
    );

    if (!condition) {
      toastr.error('Index Out Of Error', 'Current Index Invalid');
    }

    const renderCondition = () => {
      if (condition.value) {
        return (
          <div className="condition-item-container">
            <div className="d-inline-block condition-item">
              <span className="attr-value">
                {'Gender Is ' +
                  GENDERS.find(gender => gender.key === condition.value).label}
              </span>
            </div>
          </div>
        );
      } else {
        return (
          <div className="d-flex condition-item-container">
            <Type conditionIndex={this.props.conditionIndex} />
            <UncontrolledDropdown className="mb-2">
              <DropdownToggle
                className="d-flex justify-content-between align-items-center px-2 dropdown-toggle"
                caret
              >
                <span className="font-weight-normal">Select One</span>
              </DropdownToggle>

              <DropdownMenu className="mt-0 p-0 dropdown-menu">
                {GENDERS.map((genderOption, index) => (
                  <DropdownItem key={index}>
                    <div
                      className="p-0 dropdown-item"
                      onClick={() =>
                        this.props.actions.updateBroadcastCondition(
                          this.props.conditionIndex,
                          {
                            type: condition.type,
                            value: genderOption.key
                          }
                        )
                      }
                    >
                      {genderOption.label}
                    </div>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        );
      }
    };

    return (
      <div className="d-inline-block">
        <div className="d-flex align-items-center">
          {renderCondition()}
          <button
            className="btn btn-link p-0 ml-2 btn-condition-item"
            onClick={() =>
              this.props.actions.deleteBroadcastCondition(
                this.props.conditionIndex
              )
            }
          >
            <i className="fa fa-close" />
          </button>
        </div>
      </div>
    );
  }
}

Gender.propTypes = {
  conditionIndex: PropTypes.number.isRequired,
  conditions: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  conditions: getEngageAddState(state).broadcast.conditions
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      updateBroadcastCondition,
      deleteBroadcastCondition
    },
    dispatch
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Gender);
