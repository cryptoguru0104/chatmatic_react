import React from 'react';
import { Icon } from 'semantic-ui-react';

import { Block, Svg } from '../../Layout';

const SmartDelay = props => {
    const { id: stepId, handleAddActionStep } = props;
    return (
        <React.Fragment>
            {/* <Block className="mydiv trans smartDelay">
                    <Block className="selectBox heightAuto">
                        <Block className="HeadingBlock">
                            <h2>Smart Delay</h2>
                        </Block> */}
            <Block className="smartDelaywrapper">
                <Block className="smartDelaytxt">
                    <p>
                        <Icon name="clock outline" />
                        {props.isContinueTime ? (
                            <>
                                Wait at least&nbsp;
                                {props.durationCount}&nbsp;
                                {props.durationType}&nbsp; and then continue
                                at&nbsp;
                                {props.startTime}&nbsp;-&nbsp;{props.endTime}
                                &nbsp;
                                {props.selectedDays.map((d, i) => (
                                    <React.Fragment key={i}>
                                        {d},{' '}
                                    </React.Fragment>
                                ))}
                            </>
                        ) : (
                            <>
                                Wait {props.durationCount}&nbsp;
                                {props.durationType} and then continue
                            </>
                        )}
                    </p>
                </Block>
                {!props.nextStepUid ? (
                    <Block className="buttonsBlock delayBtn">
                        <Block className="buttonsCol" id={`btn-dy_${stepId}`}>
                            <Block className="txtblock">
                                <p className="text-right">Next Step</p>
                            </Block>
                            <button
                                className="drag-con"
                                onMouseDown={e => {
                                    if (
                                        typeof handleAddActionStep ===
                                        'function'
                                    )
                                        handleAddActionStep(
                                            e,
                                            `btn-dy_${stepId}`,
                                            stepId
                                        );
                                }}
                            >
                                <Svg name="plus" />
                            </button>
                        </Block>
                    </Block>
                ) : null}
                {/* </Block>
                    </Block> */}
            </Block>
        </React.Fragment>
    );
};

export default SmartDelay;
