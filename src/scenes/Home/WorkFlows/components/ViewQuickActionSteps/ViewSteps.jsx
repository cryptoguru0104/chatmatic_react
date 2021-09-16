import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Icon, Input, Button, Image } from 'semantic-ui-react';
import { Block, Svg, TransparencyBar } from '../../../Layout';
import { parseToArray } from '../../../../../services/utils';
import Constants from '../../../../../config/Constants';

export const ViewRandomzierStep = props => {
    const { options, handleAddActionStep, stepUid } = props;

    return (
        <Block className="view-randomizer buttonsBlock">
            {((Array.isArray(options) && options) || []).map((item, index) => (
                <Block
                    key={`btn_${index}`}
                    id={`btn-rd_${item.uid}_${stepUid}`}
                    className={`buttonsCol ${!item.nextStepUid ? 'error' : ''}`}
                >
                    <span className="btnText left">{item.option}</span>
                    <Block className="btnText right">
                        <span className="rangeText">{item.percentage}%</span>
                        {!item.nextStepUid && (
                            <button
                                className="drag-con"
                                onMouseDown={e => {
                                    if (
                                        typeof handleAddActionStep ===
                                        'function'
                                    )
                                        handleAddActionStep(
                                            e,
                                            `btn-rd_${item.uid}_${stepUid}`
                                        );
                                }}
                            >
                                <Svg name="plus" />
                            </button>
                        )}
                    </Block>
                </Block>
            ))}
        </Block>
    );
};

export const ViewConditionStep = props => {
    const { ifElseBlocks, nextStepUid, handleAddActionStep, stepUid } = props;
    const conditions = parseToArray(ifElseBlocks).map(
        block => block.conditions
    );

    return (
        <Block className="condition">
            <Block className="buttonsBlock">
                {parseToArray(ifElseBlocks).map((ifElseBlock, blockIndex) => {
                    if (ifElseBlock.conditions.length < 1) return null;
                    return (
                        <Block
                            className={`buttonsCol ${
                                !ifElseBlock.nextStepUid ? 'error' : ''
                            }`}
                            key={blockIndex}
                            id={`btn-cd_${ifElseBlock.uid}_${stepUid}`}
                        >
                            <Block className="txtblock">
                                {ifElseBlock.conditions.map((con, conIdx) => (
                                    <p key={conIdx}>
                                        {con.conditionOn.label}{' '}
                                        {con.condition.label}{' '}
                                        {typeof con.value === 'string'
                                            ? con.value
                                            : con.value &&
                                              con.value.length > 0 &&
                                              con.value.map((v, i) => {
                                                  if (i === 0) {
                                                      return v.value;
                                                  }
                                                  return `, ${v.value}`;
                                              })}
                                    </p>
                                ))}
                            </Block>
                            {!ifElseBlock.nextStepUid && (
                                <button
                                    className="drag-con"
                                    onMouseDown={e =>
                                        handleAddActionStep(
                                            e,
                                            `btn-cd_${ifElseBlock.uid}_${stepUid}`
                                        )
                                    }
                                >
                                    <Svg name="plus" />
                                </button>
                            )}
                        </Block>
                    );
                })}
                <Block
                    className={`buttonsCol ${!nextStepUid ? 'error' : ''}`}
                    id={`btn-cd_${stepUid}`}
                >
                    <Block className="txtblock">
                        <p>The user doesn't match any of these conditions.</p>
                    </Block>
                    {!nextStepUid && (
                        <button
                            className="drag-con"
                            onMouseDown={e =>
                                handleAddActionStep(e, `btn-cd_${stepUid}`)
                            }
                        >
                            <Svg name="plus" />
                        </button>
                    )}
                </Block>
            </Block>
        </Block>
    );
};

export const ViewSMSStep = props => {
    const {
        items,
        userReplies,
        fallBack,
        stepUid,
        handleAddActionStep,
        isNextStep,
        nextStepUid
    } = props;
    return (
        <Block className="SMSBlock">
            {parseToArray(items).map((item, index) => (
                <React.Fragment key={index}>
                    {item.type === Constants.smsBuilderItemTypes.text ? (
                        <>
                            {item.value ? (
                                <Block className="addTextBlockwrapper">
                                    <Block className="addTextBlockMain">
                                        <p dangerouslySetInnerHTML={{__html: (item.value || '').replace(/\n/g, '<br />')}} className="txtField" />

                                        {/* <button className="drag-con default">
                                            <Svg name="plus" />
                                        </button> */}
                                    </Block>
                                </Block>
                            ) : (
                                <Block className="addTextplaceholder error">
                                    <p className="txtField">Add text</p>

                                    {/* <button className="drag-con default">
                                        <Svg name="plus" />
                                    </button> */}
                                </Block>
                            )}
                        </>
                    ) : null}
                    {item.type === Constants.smsBuilderItemTypes.image ? (
                        <Block className="single-image-block">
                            {item.value ? (
                                <Block className="imageBlock">
                                    <Image src={item.value} alt="img" />
                                </Block>
                            ) : (
                                <Block className="imageTextBlockMain error">
                                    <button className="btn btn-link btn-add-reply">
                                        <Icon name="image outline" />
                                        Image
                                    </button>
                                </Block>
                            )}
                        </Block>
                    ) : null}
                </React.Fragment>
            ))}
            <Block className="buttonsBlock quickreplies-button">
                {(userReplies || []).map((item, index) => (
                    <Block
                        key={index}
                        className={`buttonsCol ${item.text ? '' : 'error'}`}
                        id={`btn-ur_${item.uid}_${stepUid}`}
                    >
                        <span className="btnText">
                            {item.text || 'Add title'}
                        </span>
                        {!item.nextStepUid && (
                            <button
                                className="drag-con"
                                onMouseDown={e => {
                                    handleAddActionStep(
                                        e,
                                        `btn-ur_${item.uid}_${stepUid}`
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

                {fallBack ? (
                    <Block
                        className="buttonsCol"
                        id={`btn-fb_${fallBack.uid}_${stepUid}`}
                    >
                        <span className="btnText">{fallBack.text}</span>
                        {!fallBack.nextStepUid && (
                            <button
                                className="drag-con"
                                onMouseDown={e => {
                                    handleAddActionStep(
                                        e,
                                        `btn-fb_${fallBack.uid}_${stepUid}`
                                    );
                                }}
                            >
                                <Svg name="plus" />
                            </button>
                        )}
                    </Block>
                ) : null}
            </Block>
            {isNextStep ? (
                <Block className="buttonsBlock delayBtn">
                    <Block className="buttonsCol" id={`btn-sms_${stepUid}`}>
                        <Block className="txtblock">
                            <p className="text-right">Next Step</p>
                        </Block>
                        {!nextStepUid ? (
                            <Button
                                className="drag-con"
                                onMouseDown={e => {
                                    handleAddActionStep(
                                        e,
                                        `btn-sms_${stepUid}`,
                                        stepUid
                                    );
                                }}
                            >
                                <Svg name="plus" />
                            </Button>
                        ) : null}
                    </Block>
                </Block>
            ) : null}
        </Block>
    );
};




export const ViewSMTPStep = props => {
    const {
        items,
        userReplies,
        fallBack,
        stepUid,
        handleAddActionStep,
        isNextStep,
        nextStepUid
    } = props;
    let itemsArray = parseToArray(items), 
        emailSubject = emailSubject = itemsArray[3].value;
    itemsArray.forEach((item, index) => {
        if(item.value) {
        } else if(index != 2) emailSubject = null;
    });
    return (
        <Block className="SMTPBlock">
            {emailSubject? (
                <Block className="addTextBlockwrapper">
                    <Block className="addTextBlockMain">
                        <p dangerouslySetInnerHTML={{__html: (emailSubject|| '').replace(/\n/g, '<br />')}} className="txtField" />

                        {/* <button className="drag-con default">
                            <Svg name="plus" />
                        </button> */}
                    </Block>
                </Block>
            ) : (
                <Block className="addTextplaceholder error">
                    <p className="txtField">Customize Email</p>

                    {/* <button className="drag-con default">
                        <Svg name="plus" />
                    </button> */}
                </Block>
            )}
            <Block className="buttonsBlock quickreplies-button">
                {(userReplies || []).map((item, index) => (
                    <Block
                        key={index}
                        className={`buttonsCol ${item.text ? '' : 'error'}`}
                        id={`btn-ur_${item.uid}_${stepUid}`}
                    >
                        <span className="btnText">
                            {item.text || 'Add title'}
                        </span>
                        {!item.nextStepUid && (
                            <button
                                className="drag-con"
                                onMouseDown={e => {
                                    handleAddActionStep(
                                        e,
                                        `btn-ur_${item.uid}_${stepUid}`
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

                {fallBack ? (
                    <Block
                        className="buttonsCol"
                        id={`btn-fb_${fallBack.uid}_${stepUid}`}
                    >
                        <span className="btnText">{fallBack.text}</span>
                        {!fallBack.nextStepUid && (
                            <button
                                className="drag-con"
                                onMouseDown={e => {
                                    handleAddActionStep(
                                        e,
                                        `btn-fb_${fallBack.uid}_${stepUid}`
                                    );
                                }}
                            >
                                <Svg name="plus" />
                            </button>
                        )}
                    </Block>
                ) : null}
            </Block>
            {isNextStep ? (
                <Block className="buttonsBlock delayBtn">
                    <Block className="buttonsCol" id={`btn-smtp_${stepUid}`}>
                        <Block className="txtblock">
                            <p className="text-right">Next Step</p>
                        </Block>
                        {!nextStepUid ? (
                            <Button
                                className="drag-con"
                                onMouseDown={e => {
                                    handleAddActionStep(
                                        e,
                                        `btn-smtp_${stepUid}`,
                                        stepUid
                                    );
                                }}
                            >
                                <Svg name="plus" />
                            </Button>
                        ) : null}
                    </Block>
                </Block>
            ) : null}
        </Block>
    );
};
