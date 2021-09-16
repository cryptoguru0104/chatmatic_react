import React from 'react';
import { Block, Svg } from '../../Layout';
import { parseToArray } from '../../../../services/utils';
// import Error from './Error'

const ActionButtons = props => {
    const { actionBtns, handleAddActionStep, stepId, itemId } = props;
    if (parseToArray(actionBtns).length < 1) {
        return null;
    }
    function showLinkingButton(item) {
        if (item.label && item.actionType === 'postback' && !item.nextStepUid) {
            return true;
        }
        return false;
    }
    return (
        <Block className="buttonsBlock">
            {(actionBtns || []).map((item, index) => (
                <Block
                    key={`btn_${index}`}
                    id={`btn_${item.uid}_${itemId}_${stepId}`}
                    className={`buttonsCol ${
                        item.label ? '' : 'error'
                    } ${item.actionType || ''}`}
                >
                    {/* <Error /> */}
                    <span className="btnText">
                        {item.label || 'No Button Label'}
                    </span>
                    {showLinkingButton(item) ? (
                        <button
                            className="drag-con"
                            onMouseDown={e => {
                                if (typeof handleAddActionStep === 'function')
                                    handleAddActionStep(
                                        e,
                                        `btn_${item.uid}_${itemId}_${stepId}`,
                                        stepId
                                    );
                            }}
                        >
                            <Svg name="plus" />
                        </button>
                    ) : null}
                </Block>
            ))}
        </Block>
    );
};

export default ActionButtons;
