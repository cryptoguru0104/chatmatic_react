import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Dropdown, Button, Checkbox, Input } from 'semantic-ui-react';

import {
    dayNames,
    durationTypes,
    hours24
} from '../../../../../constants/AppConstants';
import { getCurrentStep } from '../../../scenes/EngageAdd/services/selector';
import { Block } from '../../../Layout';
import { updateStepInfo } from '../../../scenes/EngageAdd/services/actions';

//#region Constants
const delayDurationTypes = [
    { key: 1, text: 'Days', value: durationTypes.day.value },
    { key: 2, text: 'Hours', value: durationTypes.hour.value },
    { key: 3, text: 'Minutes', value: durationTypes.minute.value }
];
const hours = hours24.map((hr, idx) => ({ key: idx, text: hr, value: hr }));
const days = Object.keys(dayNames).map((key, idx) => ({
    key: idx,
    text: dayNames[key].label,
    value: dayNames[key].value
}));
//#endregion

class DelayBuilder extends React.Component {
    //#region Life cycle hooks
    constructor(props) {
        super(props);
        this.state = {
            durationCount: 1,
            durationType: durationTypes.hour.value,
            isContinueTime: false,
            selectedDays: [],
            startTime: '00',
            endTime: '00'
        };
        this.saveBuilderState = this.saveBuilderState.bind(this);
    }
    //#endregion

    saveBuilderState = builderState => {
        this.props.actions.updateStepInfo(
            this.props.currentStep.stepUid,
            builderState
        );
    };
    //#region Renderables
    //#endregion

    render() {
        const data = this.props.currentStep;

        return (
            <React.Fragment>
                <Block className="delay-duration">
                    <p>Delay Duration</p>
                    <Block className="delay-list">
                        <Input
                            type="number"
                            value={data.durationCount}
                            onChange={(e, d) => {
                                this.saveBuilderState({
                                    ...data,
                                    durationCount: parseInt(d.value)
                                });
                            }}
                        />
                        <Dropdown
                            selection
                            options={delayDurationTypes}
                            value={data.durationType}
                            onChange={(e, d) => {
                                this.saveBuilderState({
                                    ...data,
                                    durationType: d.value
                                });
                            }}
                        />
                    </Block>
                    <Block className="time-limit">
                        <Checkbox
                            checked={data.isContinueTime}
                            onChange={(e, d) => {
                                this.saveBuilderState({
                                    ...data,
                                    isContinueTime: !data.isContinueTime
                                });
                            }}
                            label="Set continue time limit"
                            type="checkbox"
                        />
                    </Block>
                    {data.isContinueTime ? (
                        <Block className="list-selections-container">
                            <Block className="list-selections">
                                <Dropdown
                                    selection
                                    options={hours}
                                    className="min-time"
                                    value={data.startTime}
                                    onChange={(e, d) => {
                                        this.saveBuilderState({
                                            ...data,
                                            startTime: d.value
                                        });
                                    }}
                                />
                                <Dropdown
                                    selection
                                    options={hours}
                                    value={data.endTime}
                                    onChange={(e, d) => {
                                        this.saveBuilderState({
                                            ...data,
                                            endTime: d.value
                                        });
                                    }}
                                />
                            </Block>
                            <Dropdown
                                multiple
                                selection
                                button={true}
                                options={days}
                                text="Choose Day"
                                type="checkbox"
                                fluid
                                onChange={(e, d) => {
                                    this.saveBuilderState({
                                        ...data,
                                        selectedDays: d.value
                                    });
                                }}
                                value={data.selectedDays}
                            />
                        </Block>
                    ) : null}
                    {!data.nextStepUid ? (
                        <Block className="nextstepBtn">
                            <Button>Choose Next Step</Button>
                        </Block>
                    ) : null}
                    <Block className="wait-text">
                        {data.isContinueTime ? (
                            <p>
                                Wait at least&nbsp;
                                {data.durationCount}&nbsp;
                                {data.durationType}&nbsp; and then continue
                                at&nbsp;
                                {data.startTime} - {data.endTime}
                                &nbsp;
                                {data.selectedDays.map((d, i) => (
                                    <span key={i}>{d}, </span>
                                ))}
                            </p>
                        ) : (
                            <p>
                                Wait {data.durationCount} {data.durationType}{' '}
                                and then continue
                            </p>
                        )}
                    </Block>
                </Block>
            </React.Fragment>
        );
    }
}

DelayBuilder.propTypes = {
    currentStep: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    currentStep: getCurrentStep(state)
});
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({ updateStepInfo }, dispatch)
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(DelayBuilder)
);
