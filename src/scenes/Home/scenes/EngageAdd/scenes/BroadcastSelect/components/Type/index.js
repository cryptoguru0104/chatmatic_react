import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'components';

import { getEngageAddState } from '../../../../services/selector';
import {
  updateBroadcastCondition,
  deleteBroadcastCondition
} from '../../../../services/actions';

const conditionTypes = [
  {
    key: 'user_gender',
    label: 'Gender Is'
  },
  {
    key: 'subscribed_date',
    label: 'Subscribed Date is'
  },
  {
    key: 'ifUser',
    label: 'If User Is'
  },
  {
    key: 'hasTag',
    label: 'Tag'
  }
];

class Type extends React.Component {
  _changeConditionType = conditionType => {
    this.props.actions.updateBroadcastCondition(this.props.conditionIndex, {
      type: conditionType.key
    });
  };

  _filterConditionTypes = () => {
    if (
      this.props.conditions.find(condition => condition.type === 'user_gender')
    ) {
      return conditionTypes.filter(type => {
        return type.key !== 'user_gender';
      });
    } else {
      return conditionTypes;
    }
  };

  render() {
    const condition = this.props.conditions.find(
      (condition, index) => index === this.props.conditionIndex
    );

    const renderType = () => (
      <UncontrolledDropdown className="mb-2">
        <DropdownToggle
          className="d-flex justify-content-between align-items-center px-2 dropdown-toggle"
          caret
        >
          <span className="font-weight-normal">
            {condition.type
              ? conditionTypes.find(type => type.key === condition.type).label
              : 'Select One'}
          </span>
        </DropdownToggle>

        <DropdownMenu className="mt-0 p-0 dropdown-menu">
          {this._filterConditionTypes().map((conditionType, index) => (
            <DropdownItem key={index}>
              <div
                className="p-0 dropdown-item"
                onClick={() =>
                  condition.type !== conditionType.key &&
                  this._changeConditionType(conditionType)
                }
              >
                {conditionType.label}
              </div>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </UncontrolledDropdown>
    );

    if (condition.type) {
      return renderType();
    } else {
      return (
        <div className="d-inline-block">
          <div className="d-flex align-items-center">
            {renderType()}
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
}

Type.propTypes = {
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
)(Type);
