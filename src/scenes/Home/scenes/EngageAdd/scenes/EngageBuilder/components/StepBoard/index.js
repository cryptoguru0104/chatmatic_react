import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import uuid from 'uuid/v4';
import Swal from 'sweetalert2';
import { toastr } from 'react-redux-toastr';
import { withRouter } from 'react-router-dom';

import { Tooltip } from "@material-ui/core";
import { Popover } from "@material-ui/core";
import Card from '../../../../components/Card';
import Text from '../../../../components/Text';
import Image from '../../../../components/Image';
import Video from '../../../../components/Video';
import Audio from '../../../../components/Audio';
import Carousel from '../../../../components/Carousel';
import Delay from '../../../../components/Delay';
import UserInput from '../../../../components/UserInput';
import QuickReply from '../../../../components/QuickReply';
import AbandonCart from '../../../../components/AbandonCart';
import { getPageFromUrl } from 'services/pages/selector';

import {
  getCurrentStep,
  getEngageAddState
} from '../../../../services/selector';
import {
  updateEngageInfo,
  updateStepInfo,
  addStepInfo
} from '../../../../services/actions';


import chatIcon from "assets/images/icon-chat.png";
import "./styles.css";
import Constants from "../../../../../../../../config/Constants";

const eligibleStepTypes = Object.keys(Constants.builderTypes).map(
  key => Constants.builderTypes[key].type
);

class StepBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      target: null,
      activeQuickReply: {},
      activeQuickReplyIndex: null
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.error && !this.props.error) {
      Swal({
        title: 'Error',
        text: nextProps.error,
        type: 'error',
        showCancelButton: true,
        cancelButtonText: 'Close'
      });
    }
  }

  renderQuickReplies = () => {
      if (this.props.currentStep.quickReplies) {
          return this.props.currentStep.quickReplies.map(
              (quickReply, index) => {
                  return (
                      <button
                          id={`step-item-builder-${quickReply.uid}`}
                          key={index}
                          className="btn btn-link font-weight-normal quick-reply"
                          onClick={event =>
                              this.setState({
                                  target: event.currentTarget,
                                  activeQuickReply: quickReply,
                                  activeQuickReplyIndex: index
                              })
                          }
                      >
                          {quickReply.replyText}
                      </button>
                  );
              }
          );
      }
  };

  saveQuickReply = (quickReply, workflowType, stepUid) => {
    let quickReplies;
    let nextStepUid;
    const isNewWorkflow = eligibleStepTypes.includes(workflowType);
    if (isNewWorkflow) {
        nextStepUid = uuid();
    }
    const newQuickReply = {
        ...quickReply,
        uid: quickReply.uid ? quickReply.uid : uuid(),
        nextStepUid: isNewWorkflow ? nextStepUid : stepUid
    };

    //Adding step type for new workflow
    if (isNewWorkflow) {
      newQuickReply.stepType = workflowType;
    }

    if (quickReply.uid) {
      // update quick reply
      quickReplies = this.props.currentStep.quickReplies.map(
        (item, index) => {
          return item.nextStepUid === quickReply.nextStepUid &&
            index === this.state.activeQuickReplyIndex
            ? newQuickReply
            : item;
        }
      );
    } else {
      // create quick reply
      quickReplies = this.props.currentStep.quickReplies
        ? this.props.currentStep.quickReplies.concat([newQuickReply])
        : [newQuickReply];
    }

        if (
            workflowType === "sms" &&
            this.props.page &&
            !this.props.page.smsAccount
        ) {
            // show warning
        } else {
            this.props.engageActions.updateStepInfo(this.props.activeStep, {
                quickReplies
            });
        }
        if (nextStepUid) {
            let defaultStepTitle = undefined;
            Object.keys(Constants.builderTypes).map(key => {
                if (Constants.builderTypes[key].type === workflowType) {
                    defaultStepTitle = Constants.builderTypes[key].label;
                }
            });
            console.log("workflowType", workflowType);
            if (
                workflowType === "sms" &&
                this.props.page &&
                !this.props.page.smsAccount
            ) {
                toastr.error(
                    "Error",
                    `Please select an SMS billing plan to use this feature from settings.`
                );
                return false;
            } else {
                this.props.engageActions.addStepInfo(
                    nextStepUid,
                    workflowType,
                    defaultStepTitle
                );
                this.props.engageActions.updateEngageInfo({
                    activeStep: nextStepUid
                });
            }
          }
    this.setState({
      target: null,
      activeQuickReply: {},
      activeQuickReplyIndex: null
    });
  };

    renderItem = (item, index, restrictForJSON) => {
        switch (item.type) {
            case "card":
                return (
                    <Card
                        itemIndex={index}
                        isRestrictedForJSON={restrictForJSON}
                        key={index}
                        pageId={this.props.pageId}
                    />
                );
            case "text":
                return (
                    <Text
                        itemIndex={index}
                        isRestrictedForJSON={restrictForJSON}
                        key={index}
                        pageId={this.props.pageId}
                    />
                );
            case "image":
                return (
                    <Image
                        itemIndex={index}
                        isRestrictedForJSON={restrictForJSON}
                        key={index}
                        pageId={this.props.pageId}
                    />
                );
            case "video":
                return (
                    <Video
                        itemIndex={index}
                        key={index}
                        pageId={this.props.pageId}
                    />
                );
            case "audio":
                return (
                    <Audio
                        itemIndex={index}
                        key={index}
                        pageId={this.props.pageId}
                    />
                );
            case "carousel":
                return (
                    <Carousel
                        itemIndex={index}
                        isRestrictedForJSON={restrictForJSON}
                        key={index}
                        pageId={this.props.pageId}
                    />
                );
            case "free_text_input":
                return (
                    <UserInput
                        itemIndex={index}
                        key={index}
                        pageId={this.props.pageId}
                    />
                );
            
            case 'shopify_cart_abandonment':
              return (
                <AbandonCart
                  itemIndex={index}
                  key={index}
                  pageId={this.props.pageId}
                />
              );
            default:
                return <Delay itemIndex={index} key={index} options={{showTyping: this.props.page.source == 'fb' ? true : false}} />;
        }
    };

    renderItems = restrictForJSON => {
        return this.props.currentStep.items.map((item, index) => {
            return (
                <div
                    key={index}
                    id={`step-item-builder-${item.uid}`}
                    className="card-item-builder-outer"
                >
                    {this.renderItem(item, index, restrictForJSON)}
                </div>
            );
        });
    };

    render() {
        const { activeStep, isRestrictedForJSON, steps } = this.props;
        const stepIndex = steps.findIndex(
            s => s.stepUid == activeStep.toString()
        );
        const restrictForJSON = isRestrictedForJSON && stepIndex == 0;
        if (!this.props.currentStep) {
            return (
                <div className="d-flex flex-column justify-content-center align-items-center step-no-content">
                    <img src={chatIcon} alt="" />
                    <span>
                        Please Choose One Of The Tools From Our Toolbox To Begin
                        Creating Your Message.
                    </span>
                </div>
            );
        }
        console.log("this.state.target", this.state.target);
        return (
            <div id="steps-builder-outer" className="step-content">
                <div className="d-flex flex-row">
                    <div className="d-flex flex-column step-content-container">
                        {this.renderItems(restrictForJSON)}
                        <div className="d-flex flex-column align-items-center quick-reply-container">
                            <div className="d-flex justify-content-center flex-wrap quick-reply-items">
                                {this.renderQuickReplies()}
                            </div>
                            {!!this.props.currentStep.items.length &&
                                this.props.currentStep.items.slice(-1)[0]
                                    .type !== "free_text_input" &&
                                (!this.props.currentStep.quickReplies ||
                                    this.props.currentStep.quickReplies.length <
                                        11) && (
                                    <Tooltip arrow title="Add a Quick Reply">
                                        <button
                                            className={classnames(
                                                "btn btn-link btn-add-reply",
                                                {
                                                    active: this.state.target
                                                }
                                            )}
                                            onClick={event =>
                                                this.setState({
                                                    target: event.currentTarget,
                                                    activeQuickReply: {},
                                                    activeQuickReplyIndex: this
                                                        .props.currentStep
                                                        .quickReplies.length
                                                })
                                            }
                                        >
                                            <i className="fa fa-plus" />
                                            Add Quick Reply
                                        </button>
                                    </Tooltip>
                                )}
                        </div>
                    </div>
                    <div className="flex-grow-1" />
                </div>
                {this.state.target && (
                    <Popover
                        id={
                            this.state.target
                                ? "popover-quick-reply"
                                : undefined
                        }
                        open={this.state.target || false}
                        anchorEl={this.state.target}
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "left"
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right"
                        }}
                        disablePortal
                        onClose={() => this.setState({ target: null })}
                        className="popover-quick-reply"
                    >
                        <QuickReply
                            isRestrictedForJSON={restrictForJSON}
                            quickReply={this.state.activeQuickReply}
                            quickReplyIndex={this.state.activeQuickReplyIndex}
                            onSave={this.saveQuickReply}
                        />
                    </Popover>
        )}
      </div>
    );
  }
}

StepBoard.propTypes = {
  pageId: PropTypes.string.isRequired,
  currentStep: PropTypes.object,
  steps: PropTypes.array.isRequired,
  activeStep: PropTypes.any.isRequired,
  engageActions: PropTypes.object.isRequired,
  error: PropTypes.any,
  isRestrictedForJSON: PropTypes.bool.isRequired
};

const mapStateToProps = (state, props) => ({
  currentStep: getCurrentStep(state),
  steps: getEngageAddState(state).steps,
  activeStep: getEngageAddState(state).activeStep,
  error: state.default.scenes.engageAdd.error,
  page: getPageFromUrl(state, props),
  widgetTypes: getEngageAddState(state).widgetTypes,
  integrationTypes: state.default.settings.integrations.integrationTypes,
});

const mapDispatchToProps = dispatch => ({
  engageActions: bindActionCreators(
    {
      updateEngageInfo,
      updateStepInfo,
      addStepInfo
    },
    dispatch
  )
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(StepBoard)
);
