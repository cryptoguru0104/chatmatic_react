import React from "react";
import PropTypes from "prop-types";
import uuid from "uuid/v4";

import { messageRenderType } from "../../../../../constants/AppConstants";
import { Block, TransparencyBar, Svg } from "../../../Layout";
import { Checkbox, Input, Button, Message, Icon } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getCurrentStep } from "../../../scenes/EngageAdd/services/selector";
import { updateStepInfo } from "../../../scenes/EngageAdd/services/actions";
import { cloneObject, parseToArray } from "../../../../../services/utils";
import {
    RandomizerBuliderModel,
    RandomizerBuilderItemModel
} from "../../../scenes/EngageAdd/models/RandomizerBuilderModel";

class RandomizerBuilder extends React.Component {
    //#region Life cycle hooks
    constructor(props) {
        super(props);

        const currentState = new RandomizerBuliderModel(
            cloneObject(this.props.currentStep)
        );
        this.state = {
            ...currentState,
            message: {
                type: messageRenderType.none,
                messages: [
                    "Split the traffic",
                    "Distribution total must equal 100%"
                ]
            }
        };
        this.updateRange = this.updateRange.bind(this);
        this.addVariation = this.addVariation.bind(this);
        this.setStore = this.setStore.bind(this);
        this.getValidationMessage = this.getValidationMessage.bind(this);
    }
    //#endregion

    UNSAFE_componentWillReceiveProps = nextProps => {
        const { options } = this.state;
        let updateSate = false;
        nextProps.currentStep.options.forEach(op => {
            if (op.nextStepUid) {
                const ind = options.findIndex(o => o.option === op.option);
                if (ind !== -1 && op.nextStepUid !== options[ind].nextStepUid) {
                    options[ind].nextStepUid = op.nextStepUid;
                    updateSate = true;
                }
            }
        });
        if (updateSate) {
            this.setState({ ...options });
        }
    };

    //#region Variation Functionality
    updateRandomPath = (checked = false) => {
        this.setStore({ isRandomPath: Boolean(checked) });
    };
    updateRange = (argIndex, argValue, refItems = []) => {
        if (!Array.isArray(refItems)) throw new Error("Items must be array");
        const options = refItems.map((item, index) => {
            if (argIndex !== index) return item;
            item.percentage = parseInt(argValue);
            return item;
        });
        this.setStore({ options });
    };
    addVariation = (refItems = []) => {
        if (!Array.isArray(refItems)) throw new Error("Items must be array");
        const itemCount = refItems.length;
        if (itemCount < 6) {
            const options = [...refItems];
            let nextTitle = "A";
            if (options.length > 0) {
                const nextCharCode =
                    options[itemCount - 1].option.charCodeAt() + 1;
                nextTitle = String.fromCharCode(nextCharCode);
            }
            options.push(
                new RandomizerBuilderItemModel({
                    option: nextTitle,
                    percentage: 50,
                    uid: uuid()
                })
            );
            this.setStore({ options });
        }
    };
    removeVariation = (index, refItems = []) => {
        if (!Array.isArray(refItems)) throw new Error("Items must be array");
        if (Number.isSafeInteger(index)) {
            const options = [...refItems];
            options.splice(index, 1);
            this.setStore({ options });
        }
    };
    getValidationMessage = (state = {}) => {
        const { options = [], message = {} } = state;
        if (options.length < 1) {
            message.type = messageRenderType.error;
            message.messages = ["Please add at least 2 variations"];
        } else {
            let totalRange = 0;
            for (const iterator of options) {
                totalRange += iterator.percentage;
            }
            if (totalRange > 100 || totalRange < 100) {
                message.type = messageRenderType.error;
                message.messages = [
                    `Distribution total must equal 100% Current is ${totalRange}%`
                ];
            } else {
                message.type = messageRenderType.none;
                message.messages = [
                    "Split the traffic",
                    "Distribution total must equal 100%"
                ];
            }
        }
        return message;
    };
    //#endregion

    //#region Save
    onSave = () => {
        if (this.state.message.type !== messageRenderType.error) {
            this.setStore(new RandomizerBuliderModel(this.state), true);
        }
    };
    setStore = (modProps = Object.create(null), isReduxStore = false) => {
        if (isReduxStore) {
            const newState = {
                ...cloneObject(this.props.currentStep),
                ...modProps
            };
            this.props.actions.updateStepInfo(
                this.props.currentStep.stepUid,
                newState
            );
        } else {
            const newState = { ...this.state, ...modProps };
            const validationMsg = this.getValidationMessage(newState);
            this.setState({
                ...newState,
                ...validationMsg
            });

            let isError = false;
            if (this.state.message.type === messageRenderType.error)
                isError = true;
            this.props.actions.updateStepInfo(this.props.currentStep.stepUid, {
                ...this.props.currentStep,
                isError
            });
        }
    };
    //#endregion

    //#region Renderables
    renderVaritionMessages = (message = {}) => {
        if (parseToArray(message.messages).length > 0) {
            return (
                <Block className="randomizermsgText">
                    <Message
                        info={message.type !== messageRenderType.error}
                        error={message.type === messageRenderType.error}
                    >
                        <Message.List items={message.messages} />
                    </Message>
                </Block>
            );
        } else {
            return <></>;
        }
    };
    renderVariations = (options = []) => {
        return (options || []).map((item, index) => (
            <Block
                className={`randomizerMainBlock ${String(
                    item.option
                ).toLowerCase()}-slider`}
                key={index}
            >
                <Block className="transparency">
                    <span>{item.option}</span>
                    <TransparencyBar
                        value={item.percentage}
                        handleChange={value => {
                            this.updateRange(index, value, options);
                        }}
                    />
                    <Input
                        size="small"
                        type="number"
                        value={item.percentage}
                        onChange={e => {
                            this.updateRange(index, e.target.value, options);
                        }}
                    />
                    <span>%</span>
                    <Button
                        size="tiny"
                        onClick={() => {
                            this.removeVariation(index, options);
                        }}
                    >
                        <Svg name="delete" />
                    </Button>
                </Block>
                {/* <Block className="btnNextstep">
                    <Button>Choose Next Step</Button>
                </Block> */}
            </Block>
        ));
    };
    renderAddVariationButton = (refItems = []) => {
        if (!Array.isArray(refItems)) throw new Error("Items must be array");
        if (refItems.length < 6) {
            return (
                <Block className="new-variation">
                    <Button onClick={() => this.addVariation(refItems)}>
                        New Variation
                    </Button>
                </Block>
            );
        } else {
            return (
                <Block className="randomizermsgText">
                    <Message
                        info
                        content="You`ve reached the maximum number of variations"
                        compact
                    />
                </Block>
            );
        }
    };
    //#endregion

    render() {
        const { options = [], isRandomPath = false, message } = this.state;
        return (
            <React.Fragment>
                {/* <Checkbox
                    label="Random path every type"
                    type="checkbox"
                    checked={isRandomPath}
                    onChange={(e, d) => this.updateRandomPath(d.checked)}
                /> */}
                {this.renderVaritionMessages(message)}
                <Block className="randomizerMainWrapper">
                    {this.renderVariations(options)}
                </Block>
                {this.renderAddVariationButton(options)}
                <br />
                <Block className="savebuttonBlock">
                    <Button fluid onClick={this.onSave} color="blue">
                        Save
                    </Button>
                </Block>
            </React.Fragment>
        );
    }
}

RandomizerBuilder.propTypes = {
    currentStep: PropTypes.object
};
const mapStateToProps = state => ({
    currentStep: getCurrentStep(state)
});
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            updateStepInfo
        },
        dispatch
    )
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(RandomizerBuilder)
);
