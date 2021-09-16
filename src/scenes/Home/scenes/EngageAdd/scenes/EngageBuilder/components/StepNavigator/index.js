import React from 'react';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Popover } from 'components';

import { getEngageAddState } from '../../../../services/selector';
import { updateEngageInfo } from '../../../../services/actions';

import './styles.css';

class StepBlock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      popOverTarget: null
    };
  }

  render() {
    const {
      step,
      activeStep,
      stepIndex,
      updateEngageInfo,
      isOrphanStep
    } = this.props;

    return (
      <div className="d-flex flex-column step-navigator mt-2">
        <div
          className={classnames('position-relative step-name', {
            active: step.stepUid === activeStep,
            orphan: isOrphanStep
          })}
          onClick={() => updateEngageInfo({ activeStep: step.stepUid })}
          onMouseEnter={event =>
            isOrphanStep && this.setState({ popOverTarget: event.target })
          }
          onMouseLeave={() =>
            isOrphanStep && this.setState({ popOverTarget: null })
          }
        >
          {step.name ? step.name : `Step ${stepIndex + 1}`}
        </div>
        <ul>
          {step.items.map((item, itemIndex) => (
            <li key={itemIndex}>
              {item.headline
                ? item.headline
                : item.textMessage
                  ? item.textMessage
                  : `${item.type} ${itemIndex + 1}`}
            </li>
          ))}
          {step.quickReplies &&
            step.quickReplies.map((item, itemIndex) => (
              <li key={itemIndex}>{`QuickReply ${itemIndex + 1}`}</li>
            ))}
        </ul>
        {this.state.popOverTarget && (
          <Popover
            isOpen={true}
            target={this.state.popOverTarget}
            offset={75}
            toggle={() => this.setState({ popOverTarget: null })}
            className="popover-container"
            placement="bottom"
          >
            <p className="m-0 p-2 text-center font-weight-bold">
              The Highlighted message block is not attached and will be
              automatically deleted when saving
            </p>
          </Popover>
        )}
      </div>
    );
  }
}

StepBlock.propTypes = {
  step: PropTypes.shape({
    name: PropTypes.string,
    items: PropTypes.array,
    stepUid: PropTypes.any,
    quickReplies: PropTypes.array
  }).isRequired,
  pageId: PropTypes.string.isRequired,
  isOrphanStep: PropTypes.bool.isRequired,
  stepIndex: PropTypes.number.isRequired,
  updateEngageInfo: PropTypes.func.isRequired,
  activeStep: PropTypes.any.isRequired
};

class StepNavigator extends React.Component {
  render() {
    return (
      <div className="steps-nav-container">
        <div className="d-flex flex-column">
          {this.props.steps.map((step, index) => (
            <StepBlock
              step={step}
              pageId={this.props.match.params.id}
              stepIndex={index}
              key={index}
              isOrphanStep={
                !!this.props.orphanSteps.find(
                  orphanStepUid => orphanStepUid === step.stepUid
                )
              }
              activeStep={this.props.activeStep}
              updateEngageInfo={this.props.engageActions.updateEngageInfo}
            />
          ))}
        </div>
      </div>
    );
  }
}

StepNavigator.propTypes = {
  activeStep: PropTypes.any.isRequired,
  steps: PropTypes.array.isRequired,
  engageActions: PropTypes.object.isRequired,
  orphanSteps: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  activeStep: getEngageAddState(state).activeStep,
  steps: getEngageAddState(state).steps
});

const mapDispatchToProps = dispatch => ({
  engageActions: bindActionCreators(
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
  )(StepNavigator)
);
