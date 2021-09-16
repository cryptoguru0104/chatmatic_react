import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Icon, Input, Button, Image, Dropdown } from "semantic-ui-react";
import { Block, Svg, TransparencyBar } from "../../../Layout";
import { parseToArray } from "../../../../../services/utils";
import Constants from "../../../../../config/Constants";
import { getCurrentStep } from "../../../scenes/EngageAdd/services/selector";
import { updateStepInfo } from "../../../scenes/EngageAdd/services/actions";
import { durationTypes } from "../../../../../constants/AppConstants";
import DelayBuilderModel from "../../../scenes/EngageAdd/models/DelayBuilderModel";

//#region Constants
const delayDurationTypes = [
    { key: 1, text: "Days", value: durationTypes.day.value },
    { key: 2, text: "Hours", value: durationTypes.hour.value },
    { key: 3, text: "Minutes", value: durationTypes.minute.value }
    // { key: 4, text: 'Seconds', value: durationTypes.second.value }
];

const maxValues = {
    seconds: 60,
    minutes: 60,
    hours: 24,
    days: 30
};
//#endregion

class ViewDelayStep extends React.Component {
    constructor(props) {
        super(props);
        this.setStore = this.setStore.bind(this);
    }

    setStore = newState => {
        this.props.actions.updateStepInfo(
            this.props.currentStep.stepUid,
            newState
        );
    };

    render() {
        const { id: stepUid, handleAddActionStep } = this.props;
        const data = new DelayBuilderModel(this.props);
        const isValidDurationCount =
            data.amount > 0 && data.amount <= maxValues[data.timeUnit];
        return (
            <Block className="smartDelay">
                <Block className="smartDelaywrapper">
                    <Block className="delay-duration">
                        <Block className="delay-list">
                            <Input
                                className={`${
                                    isValidDurationCount ? "" : "error"
                                }`}
                                type="number"
                                value={data.amount}
                                onChange={(e, d) => {
                                    this.setStore({
                                        ...data,
                                        amount: parseInt(d.value)
                                    });
                                }}
                            />
                            <Dropdown
                                selection
                                options={delayDurationTypes}
                                value={data.timeUnit}
                                onChange={(e, d) => {
                                    this.setStore({
                                        ...data,
                                        timeUnit: d.value
                                    });
                                }}
                            />
                        </Block>
                    </Block>
                    <Block className="smartDelaytxt">
                        <p>
                            <Icon name="clock outline" />
                            Wait <b>{isValidDurationCount && data.amount}</b>
                            &nbsp;
                            <b>{data.timeUnit}</b> and then continue
                        </p>
                    </Block>
                    <Block className="buttonsBlock delayBtn">
                        <Block
                            className={`buttonsCol ${
                                !data.nextStepUid ? "error" : ""
                            }`}
                            id={`btn-dy_${stepUid}`}
                        >
                            <Block className="txtblock">
                                <p className="text-center">Next Step</p>
                            </Block>
                            {!data.nextStepUid ? (
                                <button
                                    className="drag-con"
                                    onMouseDown={e => {
                                        handleAddActionStep(
                                            e,
                                            `btn-dy_${stepUid}`,
                                            stepUid
                                        );
                                    }}
                                >
                                    <Svg name="plus" />
                                </button>
                            ) : null}
                        </Block>
                    </Block>
                </Block>
            </Block>
        );
    }
}
ViewDelayStep.propTypes = {
    stepUid: PropTypes.any.isRequired,
    currentStep: PropTypes.object.isRequired,
    handleAddActionStep: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
    currentStep: getCurrentStep(state)
});
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({ updateStepInfo }, dispatch)
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(ViewDelayStep)
);
