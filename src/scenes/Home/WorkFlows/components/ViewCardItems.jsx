import React, { Fragment } from 'react';
import { Block, Svg } from '../../Layout';
import { Icon, Image, Button } from 'semantic-ui-react';
import { Carousel } from 'react-responsive-carousel';
import ActionButtons from './ActionButtons';
import { parseToArray } from '../../../../services/utils';
import { screenOrientation } from '../../../../constants/AppConstants';

//#region Helper Components
const fileContentStyle = {
    objectFit: 'cover',
    borderRadius: 18
};

export const ViewCardItem = props => {
    const {
        image,
        headline,
        description,
        imageLink,
        actionBtns,
        handleAddActionStep,
        stepId,
        uid,
        orientation
    } = props;
    let orientationClassName = screenOrientation.portrait;
    if (orientation === screenOrientation.landscape) {
        orientationClassName = screenOrientation.landscape;
    }
    return (
        <Block className={`cardBlock-main-board ${orientationClassName}`}>
            <Block className="imageTextBlockMain image-board-block">
                {image ? (
                    <Block style={{ backgroundImage: `url(${image || ''})`}} className="imageBlock image-board-block">
                        <Image src={image} alt="img" />
                    </Block>
                ) : (
                    <button className="btn btn-link btn-add-reply error">
                        <Icon name="image outline" />
                        Image
                    </button>
                )}
                <Block className="image-board-text">
                    <p className="title">{headline || 'Headline Preview'}</p>
                    <p className="subtitle" dangerouslySetInnerHTML={{__html: (description || 'Description').replace(/\n/g, '<br />')}} />
                </Block>
                {/* <a href={imageLink || '#'}>{imageLink || 'Image Link'}</a> */}
            </Block>
            <ActionButtons
                actionBtns={actionBtns}
                handleAddActionStep={handleAddActionStep}
                stepId={stepId}
                itemId={uid}
            />
        </Block>
    );
};

export class ViewCarouselItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSlide: 0
        };
    }

    next = () => {
        this.setState(({ currentSlide }) => ({
            currentSlide:
                currentSlide === parseToArray(this.props.items).length - 1
                    ? currentSlide
                    : currentSlide + 1
        }));
    };

    prev = () => {
        this.setState(({ currentSlide }) => ({
            currentSlide: currentSlide === 0 ? currentSlide : currentSlide - 1
        }));
    };

    render() {
        const {
            items = [],
            handleAddActionStep,
            stepId,
            orientation
        } = this.props;
        let orientationClassName = screenOrientation.portrait;
        if (orientation === screenOrientation.landscape) {
            orientationClassName = screenOrientation.landscape;
        }

        return (
            <Block>
                {parseToArray(items).length > 0 ? (
                    <Block className="imageTextBlockMain carousal-board-block">
                        <Block className="carousal-buttons">
                            {items.map((item, index) => (
                                <Block
                                    id={`btn-cr_${item.uid}_${stepId}`}
                                    className="btn button"
                                    key={index}
                                ></Block>
                            ))}
                        </Block>
                        <Carousel
                            showThumbs={false}
                            selectedItem={this.state.currentSlide}
                        >
                            {items.map((item, index) => (
                                <Fragment key={index}>
                                    <Block
                                        className={`carousal-block ${orientationClassName}`}
                                    >
                                        <Block className="carousal-inner">
                                            <Block className="carousalImg">
                                                {item.image ? (
                                                    <img src={item.image} />
                                                ) : (
                                                    <Block className="imageTextBlockMain error">
                                                        <button className="btn btn-link btn-add-reply">
                                                            <Icon name="image outline" />{' '}
                                                            Image
                                                        </button>
                                                    </Block>
                                                )}
                                            </Block>
                                            <button
                                                onClick={this.prev}
                                                className="slideBtn prev"
                                            >
                                                <span>
                                                    {this.state.currentSlide}{' '}
                                                    Prev
                                                </span>
                                            </button>
                                            <button
                                                onClick={this.next}
                                                className="slideBtn next"
                                            >
                                                <span>
                                                    {this.state.currentSlide}{' '}
                                                    Next
                                                </span>
                                            </button>
                                        </Block>
                                    </Block>
                                    <Block className="contents">
                                        <p className="legend">
                                            {item.headline ||
                                                'Headline Preview'}
                                        </p>
                                        <p dangerouslySetInnerHTML={{__html: (item.description || 'Description').replace(/\n/g, '<br />')}} className="subTitle" />
                                    </Block>
                                    {/* <ActionButtons
                                    actionBtns={item.actionBtns}
                                    handleAddActionStep={handleAddActionStep}
                                    stepId={stepId}
                                    itemId={item.uid}
                                /> */}
                                </Fragment>
                            ))}
                        </Carousel>
                    </Block>
                ) : (
                    <Block className="imageTextBlockMain">
                        <button className="btn btn-link btn-add-reply">
                            <Icon name="images outline" />
                            Carousel
                        </button>
                    </Block>
                )}
            </Block>
        );
    }
}

export const ViewImageItem = props => {
    const { image, actionBtns, handleAddActionStep, stepId, uid } = props;
    return (
        <Block className="single-image-block">
            {image ? (
                <Block className="imageBlock">
                    <Image src={image} alt="img" />
                </Block>
            ) : (
                <Block className="imageTextBlockMain error">
                    <button className="btn btn-link btn-add-reply">
                        <Icon name="image outline" />
                        Image
                    </button>
                </Block>
            )}
            <ActionButtons
                actionBtns={actionBtns}
                handleAddActionStep={handleAddActionStep}
                stepId={stepId}
                itemId={uid}
            />
        </Block>
    );
};

export const ViewAbandonCartItem = props => {
    return (
        <Block className="imageTextBlockMain abandoncart-block">
            <Block style={{
                padding: '15px'
            }}>
                This item will automatically be filled at the time of messaging.
            </Block>
            <button
                className="slideBtn prev"
            >
                <span>
                    Prev
                </span>
            </button>
            <button
                className="slideBtn next"
            >
                <span>
                    Next
                </span>
            </button>
        </Block>
    );
};

export const ViewAudioItem = props => {
    const { audio, actionBtns, handleAddActionStep, stepId, uid } = props;
    return (
        <Block>
            <Block className="imageTextBlockMain audio-board-block">
                {audio ? (
                    <audio controls>
                        <source src={audio} />
                        Your browser does not support the audio element.
                    </audio>
                ) : (
                    <button className="btn btn-link btn-add-reply error">
                        <Icon name="volume off" /> Audio
                    </button>
                )}
            </Block>
            <ActionButtons
                actionBtns={actionBtns}
                handleAddActionStep={handleAddActionStep}
                stepId={stepId}
                itemId={uid}
            />
        </Block>
    );
};

export const ViewVideoItem = props => {
    const { video, actionBtns, handleAddActionStep, stepId, uid } = props;
    return (
        <Block
            className={`imageTextBlockMain video-board-block ${
                parseToArray(actionBtns).length ? 'on-bottom-radius' : ''
            }`}
        >
            {video ? (
                <video className="w-100" style={fileContentStyle} controls>
                    <source src={video} />
                </video>
            ) : (
                <button className="btn btn-link btn-add-reply error">
                    <Icon name="caret square right outline" />
                    Video
                </button>
            )}
            <ActionButtons
                actionBtns={actionBtns}
                handleAddActionStep={handleAddActionStep}
                stepId={stepId}
                itemId={uid}
            />
        </Block>
    );
};

export const ViewTextItem = props => {
    const { textMessage, actionBtns, handleAddActionStep, stepId, uid } = props;
    // console.log('textMessage', textMessage);
    return (
        <Block className="addTextBlockwrapper">
            <Block className="addTextBlockinner">
                {textMessage ? (
                    <Block className="addTextBlockMain">
                        <p dangerouslySetInnerHTML={{__html:textMessage.replace(/\n/g, '<br />')}} className="txtField" />
                    </Block>
                ) : (
                    <Block className="addTextplaceholder error">
                        <p className="txtField">Add text</p>
                    </Block>
                )}
            </Block>
            <ActionButtons
                actionBtns={actionBtns}
                handleAddActionStep={handleAddActionStep}
                stepId={stepId}
                itemId={uid}
            />
        </Block>
    );
};

export const ViewDelayItem = props => {
    const { showTyping, delayTime } = props;
    return (
        <Block className="imageTextBlockMain delay-board-block">
            <button className="btn btn-link btn-add-reply">
                <Icon name="clock outline" />{' '}
                {showTyping ? 'Typing' : 'Waiting'} {Number(delayTime)} sec...
            </button>
        </Block>
    );
};

export const ViewUserInputItem = props => {
    const { textMessage, stepId, uid: itemId } = props;
    return (
        <Block
            id={`btn-ui_${itemId}_${stepId}`}
            className="textField userInputfield"
        >
            <p dangerouslySetInnerHTML={{__html: (textMessage || 'Hey waiting for user input').replace(/\n/g, '<br />')}} className="txtContent" />
        </Block>
    );
};

export const ViewQuickReplies = props => {
    const { quickReplies, stepId, handleAddActionStep, handleCardItemFocus, onMouseDown } = props;
    return (
        <Block className="buttonsBlock quickreplies-button">
            {parseToArray(quickReplies).map((item, index) => (
                <Block
                    onMouseDown={onMouseDown || null}
                    onMouseUp={handleCardItemFocus ? () => {handleCardItemFocus(item)} : null}
                    key={index}
                    className="buttonsCol"
                    id={`btn-qr_${item.uid}_${stepId}`}
                >
                    <span className="btnText">{item.replyText}</span>
                    {!item.nextStepUid && (
                        <button
                            className="drag-con"
                            onMouseDown={e => {
                                if (typeof handleAddActionStep === 'function')
                                    handleAddActionStep(
                                        e,
                                        `btn-qr_${item.uid}_${stepId}`,
                                        stepId
                                    );
                            }}
                        >
                            <Svg name="plus" />
                        </button>
                    )}
                    {/* <button className="drag-con without-plus">
                        <Icon name="circle outline" />
                    </button> */}
                </Block>
            ))}
        </Block>
    );
};
