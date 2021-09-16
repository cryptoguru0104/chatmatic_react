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

const CONSTRAINTS = [
  {
    key: 'subscribed',
    label: 'Subscribed to'
  },
  {
    key: 'unsubscribed',
    label: 'Not Subscribed to'
  }
];

class SubscribedCampaign extends React.Component {
  render() {
    const condition = this.props.conditions.find(
      (condition, index) => index === this.props.conditionIndex
    );

    if (!condition) {
      toastr.error('Index Out Of Error', 'Current Index Invalid');
    }

    const usedCampaigns = [];
    this.props.conditions.forEach(condition => {
      if (condition.type === 'ifUser') {
        usedCampaigns.push(condition.value);
      }
    });
    const unUsedCampaigns = this.props.campaigns.filter(
      campaign =>
        !usedCampaigns.find(usedCampaign => usedCampaign === campaign.uid)
    );

    const renderCondition = () => {
      if (condition.value) {
        const constraint = CONSTRAINTS.find(
          constraint => constraint.key === condition.constraint
        ).label;
        const selectedCampaign = this.props.campaigns.find(
          campaign => campaign.uid === condition.value
        );

        return (
          <div className="condition-item-container">
            <div className="d-inline-block condition-item">
              <span className="attr-value">
                {'If User Is ' +
                  constraint +
                  ' ' +
                  (selectedCampaign
                    ? selectedCampaign.campaignName
                    : '(Campaign not exist any more on this page)')}
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
                {unUsedCampaigns.map((campaign, index) => (
                  <DropdownItem key={index}>
                    <div
                      className="p-0 dropdown-item"
                      onClick={() =>
                        this.props.actions.updateBroadcastCondition(
                          this.props.conditionIndex,
                          {
                            type: condition.type,
                            constraint: condition.constraint,
                            value: campaign.uid
                          }
                        )
                      }
                    >
                      {campaign.campaignName}
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

SubscribedCampaign.propTypes = {
  conditionIndex: PropTypes.number.isRequired,
  conditions: PropTypes.array.isRequired,
  campaigns: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  conditions: getEngageAddState(state).broadcast.conditions,
  campaigns: state.default.campaigns.campaigns
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
)(SubscribedCampaign);
