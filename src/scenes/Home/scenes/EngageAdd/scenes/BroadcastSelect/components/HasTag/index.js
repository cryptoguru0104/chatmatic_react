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
import { getTagsState } from 'services/tags/selector';

const CONSTRAINTS = [
  {
    key: 'has',
    label: 'Has'
  },
  {
    key: 'hasNot',
    label: 'Has not'
  }
];

class HasTag extends React.Component {
  render() {
    const condition = this.props.conditions.find(
      (condition, index) => index === this.props.conditionIndex
    );

    if (!condition) {
      toastr.error('Index Out Of Error', 'Current Index Invalid');
    }

    const usedTags = [];
    this.props.conditions.forEach(condition => {
      if (condition.type === 'hasTag') {
        usedTags.push(condition.value);
      }
    });
    const unUsedTags = this.props.tags.filter(
      tag => !usedTags.find(usedTag => usedTag === tag.uid)
    );

    const renderCondition = () => {
      if (condition.value) {
        const constraint = CONSTRAINTS.find(
          constraint => constraint.key === condition.constraint
        ).label;
        const selectedTag = this.props.tags.find(
          tag => tag.uid === condition.value
        );

        return (
          <div className="condition-item-container">
            <div className="d-inline-block condition-item">
              <span className="attr-value">
                {constraint +
                  ' Tag ' +
                  (selectedTag
                    ? selectedTag.value
                    : '(Tag not exist any more on this page)')}
              </span>
            </div>
          </div>
        );
      } else if (condition.constraint) {
        return (
          <div className="d-flex condition-item-container">
            <Type conditionIndex={this.props.conditionIndex} />
            <UncontrolledDropdown className="mb-2">
              <DropdownToggle
                className="d-flex justify-content-between align-items-center px-2 dropdown-toggle"
                caret
              >
                <span className="font-weight-normal">
                  {
                    CONSTRAINTS.find(
                      constraint => constraint.key === condition.constraint
                    ).label
                  }
                </span>
              </DropdownToggle>

              <DropdownMenu className="mt-0 p-0 dropdown-menu">
                {CONSTRAINTS.map((constraint, index) => (
                  <DropdownItem key={index}>
                    <div
                      className="p-0 dropdown-item"
                      onClick={() =>
                        this.props.actions.updateBroadcastCondition(
                          this.props.conditionIndex,
                          {
                            type: condition.type,
                            constraint: constraint.key
                          }
                        )
                      }
                    >
                      {constraint.label}
                    </div>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </UncontrolledDropdown>
            <UncontrolledDropdown className="mb-2">
              <DropdownToggle
                className="d-flex justify-content-between align-items-center px-2 dropdown-toggle"
                caret
              >
                <span className="font-weight-normal">Select One</span>
              </DropdownToggle>

              <DropdownMenu className="mt-0 p-0 dropdown-menu">
                {unUsedTags.map((tag, index) => (
                  <DropdownItem key={index}>
                    <div
                      className="p-0 dropdown-item"
                      onClick={() =>
                        this.props.actions.updateBroadcastCondition(
                          this.props.conditionIndex,
                          {
                            type: condition.type,
                            constraint: condition.constraint,
                            value: tag.uid
                          }
                        )
                      }
                    >
                      {tag.value}
                    </div>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </UncontrolledDropdown>
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
                {CONSTRAINTS.map((constraint, index) => (
                  <DropdownItem key={index}>
                    <div
                      className="p-0 dropdown-item"
                      onClick={() =>
                        this.props.actions.updateBroadcastCondition(
                          this.props.conditionIndex,
                          {
                            type: condition.type,
                            constraint: constraint.key
                          }
                        )
                      }
                    >
                      {constraint.label}
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

HasTag.propTypes = {
  conditionIndex: PropTypes.number.isRequired,
  conditions: PropTypes.array.isRequired,
  tags: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  conditions: getEngageAddState(state).broadcast.conditions,
  tags: getTagsState(state).tags
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
)(HasTag);
