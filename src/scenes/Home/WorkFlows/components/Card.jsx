import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Image } from 'semantic-ui-react';
import jQuery from 'jquery';

import { Block, Svg } from '../../Layout';
import Constants from '../../../../config/Constants';
import {
    ViewCardItem,
    ViewCarouselItem,
    ViewAbandonCartItem,
    ViewImageItem,
    ViewAudioItem,
    ViewVideoItem,
    ViewTextItem,
    ViewDelayItem,
    ViewUserInputItem,
    ViewQuickReplies,
} from '../components/ViewCardItems';
import {
    ViewRandomzierStep,
    ViewConditionStep,
    ViewSMSStep,
    ViewSMTPStep
} from './ViewQuickActionSteps/ViewSteps';
import ViewDelayStep from './ViewQuickActionSteps/ViewDelayStep';

import { StatsCard } from '../components';

const builderTypes = Constants.builderTypes;
const eligibleCardActions = [undefined, 'items'];

class Card extends Component {
    constructor(props) {
        super(props);
        // console.log('props::', this.props);
        // this.cardHeight = null;
        // this.cardRef = null;
    }

    toggleMessageBuilder = () => {
        // this.props.dispatch(showMessageBuilder());
    };

    createActionsJSX = message => {
        const { handleChildBtnClick } = this.props;
        if (message.actions && message.actions.length) {
            return message.actions.map((a, i) => (
                <Block key={i} id={a.actionId} className="buttonsCol">
                    <span className="btnText">Button 1</span>
                    {!a.child && (
                        <button
                            onMouseDown={handleChildBtnClick(
                                a.actionId,
                                message.id
                            )}
                            className="drag-con"
                        >
                            <Svg name="plus" />
                        </button>
                    )}
                </Block>
            ));
        }
        return null;
    };

    handleCardItemFocus = (item, callback = false) => {
        if ((Date.now() - this.focusDownAt) > 200 && !callback) { return false; }
        if ((Date.now() - this.focusDownAt) > 10000) { return false; }
        const element = document.getElementById(`step-item-builder-${item.uid}`);
        if (element) {
            setTimeout(() => {
                jQuery("#steps-builder-outer").animate({ scrollTop: element.offsetTop - 200 }, "slow");
                element.classList.add('focus');
                setTimeout(() => element.classList.remove('focus'), 1500);
            }, 100);
        } else {
            setTimeout(() => this.handleCardItemFocus(item, true), 100);
        }
    }

    renderCardItems = ({ items = [], quickReplies = [], id }) => {
        return (
            <Block>
                {Array.isArray(items)
                    ? items.map((item, index) => {
                        return (
                            <Block
                                onMouseDown={() => this.focusDownAt = Date.now()}
                                onMouseUp={() => this.handleCardItemFocus(item, id)}
                                key={index}
                            >
                                {this.renderItem(item, index, id)}
                            </Block>
                        )
                    })
                    : null}
                <ViewQuickReplies
                    quickReplies={quickReplies}
                    stepId={id}
                    handleAddActionStep={this.props.handleChildBtnClick}
                    handleCardItemFocus={this.handleCardItemFocus}
                    onMouseDown={() => this.focusDownAt = Date.now()}
                />
            </Block>
        );
    };

    renderItem = (item, index, id) => {
        switch (item.type) {
            case Constants.toolboxItems.carouselItem.type:
                return (
                    <ViewCarouselItem
                        stepId={id}
                        key={index}
                        {...item}
                        handleAddActionStep={
                            this.props.handleChildBtnClick
                        }
                    />
                );
            case Constants.toolboxItems.cardItem.type:
                return (
                    <ViewCardItem
                        stepId={id}
                        key={index}
                        {...item}
                        handleAddActionStep={
                            this.props.handleChildBtnClick
                        }
                    />
                );
            case 'shopify_cart_abandonment': 
                return (
                    <ViewAbandonCartItem
                        stepId={id}
                        key={index}
                        handleAddActionStep={
                            this.props.handleChildBtnClick
                        }
                    />
                )
            case Constants.toolboxItems.imageItem.type:
                return (
                    <ViewImageItem
                        stepId={id}
                        key={index}
                        {...item}
                        handleAddActionStep={
                            this.props.handleChildBtnClick
                        }
                    />
                );
            case Constants.toolboxItems.audioItem.type:
                return (
                    <ViewAudioItem
                        stepId={id}
                        key={index}
                        {...item}
                        handleAddActionStep={
                            this.props.handleChildBtnClick
                        }
                    />
                );
            case Constants.toolboxItems.videoItem.type:
                return (
                    <ViewVideoItem
                        stepId={id}
                        key={index}
                        {...item}
                        handleAddActionStep={
                            this.props.handleChildBtnClick
                        }
                    />
                );
            case Constants.toolboxItems.textItem.type:
                return (
                    <ViewTextItem
                        stepId={id}
                        key={index}
                        {...item}
                        handleAddActionStep={
                            this.props.handleChildBtnClick
                        }
                    />
                );
            case Constants.toolboxItems.delayItem.type:
                return (
                    <ViewDelayItem
                        stepId={id}
                        key={index}
                        {...item}
                        handleAddActionStep={
                            this.props.handleChildBtnClick
                        }
                    />
                );
            case Constants.toolboxItems.userInputItem.type:
                return (
                    <ViewUserInputItem
                        stepId={id}
                        key={index}
                        {...item}
                        handleAddActionStep={
                            this.props.handleChildBtnClick
                        }
                    />
                );
            default:
                return null;
        }
    }

    renderStepView = data => {
        switch (data.stepType) {
            case builderTypes.delayConfig.type:
                return (
                    <ViewDelayStep
                        {...data}
                        handleAddActionStep={this.props.handleChildBtnClick}
                    />
                );
            case builderTypes.conditionConfig.type:
                return (
                    <ViewConditionStep
                        {...data}
                        handleAddActionStep={this.props.handleChildBtnClick}
                    />
                );
            case builderTypes.randomizerConfig.type:
                return (
                    <ViewRandomzierStep
                        {...data}
                        handleAddActionStep={this.props.handleChildBtnClick}
                    />
                );
            case builderTypes.smsConfig.type:
                return (
                    <ViewSMSStep
                        {...data}
                        handleAddActionStep={this.props.handleChildBtnClick}
                    />
                );
            case builderTypes.smtpConfig.type:
                return (
                    <ViewSMTPStep
                        {...data}
                        handleAddActionStep={this.props.handleChildBtnClick}
                    />
                );
            case builderTypes.messageConfig.type:
            default:
                return this.renderCardItems(data);
        }
    };

    render() {
        const {
            // handleClick,
            handleMouseDown,
            handleDragConn,
            handleDelete,
            data,
            style,
            isPrimary,
            // handleResize,
            isView,
            newWorkflowType
        } = this.props;
        // const actionsJSX = this.createActionsJSX(message);
        return (
            <React.Fragment>
                <div
                    className={`mydiv trans ${data.stepType}`}
                    id={data.id}
                    // onClick={handleClick}
                    // onResize={handleResize}
                    onMouseDown={handleMouseDown}
                    style={style}
                    ref={ref => {
                        this.cardRef = ref;
                    }}
                >
                    {isPrimary && (
                        <Block className="startMessage">
                            <Button className="startBtn">
                                Starting Message
                            </Button>
                        </Block>
                    )}

                    <Block
                        onClick={this.toggleMessageBuilder}
                        className={`selectBox heightAuto step-card ${
                            data.isError ? 'error' : ''
                            }`}
                    >
                        {data.stepStats && data.stepType !== builderTypes.delayConfig.type && (
                            <StatsCard
                                stepId={data.id}
                                stepStats={data.stepStats}
                            />
                        )}

                        {eligibleCardActions.includes(data.stepType) &&
                            !data.nextStepUid &&
                            !data.stepStats &&
                            !isView &&
                            !(
                                newWorkflowType === 'privateReply' ||
                                newWorkflowType === 'JSON'
                            ) &&
                            (
                                <div className="addSequenceButton">
                                    <button
                                        onMouseDown={e => {
                                            handleDragConn(e, true);
                                        }}
                                        className="drag-con"
                                        id={`drag-con-${data.id}`}
                                    >
                                        <Svg name="plus" />
                                    </button>
                                </div>
                            )}
                        {!isPrimary && !data.stepStats && !isView && (
                            <Button
                                onClick={handleDelete}
                                className="btn sequence-delete"
                            >
                                <Svg name="delete" />
                            </Button>
                        )}
                        {/* <Block className="messageBlockwithButton">
            <Block className="headerField">
              <p>
                Would you like to view more from this photo set?
              </p>
            </Block>
            <Block className="buttonsBlock">{actionsJSX}</Block>
          </Block> */}

                        {/* <Block className="messageBlock">
              <Form>
                <Form.Field className="fieldBlock">
                  <label>If User</label>
                  <Select placeholder='Select' options={sequenceOptions} />
                </Form.Field>
              </Form>
          </Block> */}

                        {/* <Block className="conditionBlock">
                            <Form>
                                <Form.Field className="fieldBlock">
                                <label>If User</label>
                                <Select placeholder='Select' options={countryOptions} />
                                </Form.Field>
                                <Form.Field className="fieldBlock">
                                <label>If User</label>
                                <Select placeholder='Select' options={countryOptions} />
                                </Form.Field>
                                <Form.Field className="fieldBlock">
                                <label>If User</label>
                                <Select placeholder='Select' options={countryOptions} />
                                </Form.Field>
                            </Form>
                        </Block> */}

                        <Block className="HeadingBlock">
                            <h2>{data.name}</h2>
                        </Block>
                        {this.renderStepView(data)}
                    </Block>

                    {/* <Block className="selectBox heightAuto imageBlock">
                        <Block className="addSequenceButton"><button className="drag-con"><Svg name="plus" /></button></Block>
                        <Button className="btn sequence-delete"><Svg name="delete" /></Button>
                        <Block className="messageBlockwithButton">
                        <h4>Select Dealy Time</h4>
                        </Block>
                    </Block> */}
                </div>

                {/* <Block className="mydiv trans randomizer">
                    <Block className="selectBox heightAuto">
                        <Block className="HeadingBlock">
                            <h2>Randomizer</h2>
                        </Block>
                        <Block className="buttonsBlock">
                            <Block className="buttonsCol">
                                <span className="btnText">A</span>
                                <span className="btnTextlast">53%</span>
                                <button className="drag-con">
                                    <Svg name="plus" />
                                </button>
                            </Block>
                            <Block className="buttonsCol">
                                <span className="btnText">B</span>
                                <span className="btnTextlast">60%</span>
                                <button className="drag-con without-plus">
                                    <Icon name="circle outline" />
                                </button>
                            </Block>
                        </Block>
                    </Block>
                </Block> */}
                {/* <SmartDelay /> */}
                {/* <ConditionCard /> */}
            </React.Fragment>
        );
    }
}

const urlParams = new URLSearchParams(window.location.search);
export default connect(state => ({
    newWorkflowType: urlParams.get('type')
}))(Card);
