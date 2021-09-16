import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';
import { toastr } from 'react-redux-toastr';

import { getCurrentStep, getAllSteps } from '../../../scenes/EngageAdd/services/selector';
import {
    Dropdown,
    Button,
    Divider,
    Input,
    List,
    Icon,
    Checkbox
} from 'semantic-ui-react';
import { Block, Svg } from '../../../Layout';
import { conditionBuilder } from '../../../../../config/Constants';
import { parseToArray, cloneObject } from '../../../../../services/utils';
import { ConditionBuilderModel } from '../../../scenes/EngageAdd/models/ConditionBuilderModel';
import { updateStepInfo } from '../../../scenes/EngageAdd/services/actions';
import {
    conditionOptions,
    conValueRenderTypes,
    conditionCategories
} from '../../../../../constants/conditionBuilderConstants';
import ReactDatePicker from 'react-datepicker';
import { getTagsState } from '../../../../../services/tags/selector';
import { getWorkflowTriggers } from '../../../../../services/workflows/selector';
// import { conditionBuilderTransformer } from '../../../../../services/workflows/transformers';

//#region Component Constants
const ifElseConditions = Object.keys(conditionBuilder.ifElseOperator).map(
    (key, idx) => ({
        key: idx,
        text: conditionBuilder.ifElseOperator[key].label,
        value: conditionBuilder.ifElseOperator[key].operator
    })
);
const conditionSelectionStep = Object.freeze({
    none: 0,
    options: 1,
    operators: 2
});
const conOperatorPopupElmId = 'con-op_' + uuid();
//#endregion

class ConditionBuilder extends React.Component {
    //#region Life cycle hooks
    constructor(props) {
        super(props);
        const currentState = new ConditionBuilderModel.Model(
            cloneObject(this.props.currentStep)
        );
        this.state = {
            ...currentState,
            conditionPopup: { id: null, step: conditionSelectionStep.none }
        };

        //#region This bindings
        this.addIfElseBlock = this.addIfElseBlock.bind(this);
        this.removeIfElseBlock = this.removeIfElseBlock.bind(this);
        this.updateIfElseBlock = this.updateIfElseBlock.bind(this);

        this.addIfElseCondition = this.addIfElseCondition.bind(this);
        this.removeIfElseCondition = this.removeIfElseCondition.bind(this);
        this.updateIfElseCondition = this.updateIfElseCondition.bind(this);

        this.setStore = this.setStore.bind(this);
        this.closeOptionConditions = this.closeOptionConditions.bind(this);
        //#endregion
    }

    componentDidMount() {
        const taghasCondition = conditionOptions.find(co => co.key === 'has');
        const taghasntCondition = conditionOptions.find(co => co.key === 'doesNotHave');
        const userCondition = conditionOptions.find(co => co.key === 'user');
        const userClickedCondition = conditionOptions.find(co => co.key === 'userClicked');
        const { steps } = this.props;
        // console.log('steps', steps);
        // const qaCondition = conditionOptions.find(co => co.key === 'quickReply');

        if (userClickedCondition) {
            let btnArr = [];
            this.props.steps.forEach(s => {
                if (s.type === 'items' || s.stepType === 'items') {
                    btnArr = this._getAllKeys(s, btnArr);
                }
            });

            let qrArr = [];
            this.props.steps.forEach(s => {
                if (s.type === 'items' || s.stepType === 'items') {
                    qrArr = this._getAllKeys(s, qrArr, 'quickReplies');
                }
            });
            // console.log('btnArr', btnArr);
            // console.log('qrArr', qrArr);
            
            userClickedCondition.conditions.forEach(c => {
                // console.log('c =>', c);
                if (c.key === 'Button') {
                    c.values = btnArr.map(a => ({ uid: a.uid, value: a.label }));
                } else if (c.key === 'QuickReply') {
                    c.values = qrArr.map(q => ({ uid: q.uid, value: q.replyText }));
                }
            });
        }

        if (taghasCondition) {
            taghasCondition.conditions.forEach(c => {
                c.values = this.props.tags;
            });
            taghasntCondition.conditions.forEach(c => {
                c.values = this.props.tags;
            });
        }

        if (userCondition) {
            const modValues = this.props.workflowTriggers.map(t => ({
                uid: t.uid,
                value: t.triggerName
            }));
            userCondition.conditions.forEach(c => {
                c.values = modValues;
            });
        }
    }
    //#endregion

    _getAllKeys = (obj, oldArr, findKey = 'actionBtns') => {
        Object.keys(obj || {}).map(key => {
            if (obj[key]) {
                // console.log('key', key);
                if (findKey === key) {
                    // console.log('match', key);
                    oldArr = oldArr.concat(obj[key]);
                } else if (Array.isArray(obj[key])) {
                    obj[key].map(item =>
                        oldArr = this._getAllKeys(item, oldArr, findKey)
                    );
                } else if (typeof obj[key] === 'object') {
                    oldArr = this._getAllKeys(obj[key], oldArr, findKey);
                }
            }
        });
        return oldArr;
    };

    //#region Functionalities

    //#region If Else
    addIfElseBlock = (refList = []) => {
        const ifElseBlocks = [...parseToArray(refList)];
        ifElseBlocks.push(
            new ConditionBuilderModel.IfElse({
                uid: uuid(),
                operator: conditionBuilder.ifElseOperator.and.operator
            })
        );
        this.setStore({ ifElseBlocks });
    };

    removeIfElseBlock = (index = -1, refList = []) => {
        if (index > -1) {
            const ifElseBlocks = [...parseToArray(refList)];
            ifElseBlocks.splice(index, 1);
            this.setStore({ ifElseBlocks });
        }
    };

    updateIfElseBlock = (index = -1, payLoad = {}, refList = []) => {
        const ifElseBlocks = parseToArray(refList).map((item, idx) => {
            if (idx !== index) return item;
            return { ...item, ...payLoad };
        });
        this.setStore({ ifElseBlocks });
    };
    //#endregion

    //#region If Else Condition
    addIfElseCondition = (
        payLoad = {},
        ifElseIndex = -1,
        refIfElseBlocks = []
    ) => {
        console.log('pay', payLoad, ifElseIndex, refIfElseBlocks);
        // return
        if (ifElseIndex > -1) {
            const ifElseBlocks = [...parseToArray(refIfElseBlocks)];
            const currentIfElse = ifElseBlocks[ifElseIndex];
            if (currentIfElse) {
                if (currentIfElse.conditions.filter(c => c.condition.key === payLoad.condition.key && c.conditionOn.key === payLoad.conditionOn.key).length > 0) {
                    this.setState({
                        conditionPopup: { id: null, step: conditionSelectionStep.none }
                    });
                    toastr.warning('You already have same condition in this if block');
                    return;
                }
                const objIfElseCondition = new ConditionBuilderModel.Condition(
                    payLoad
                );
                objIfElseCondition.uid = uuid();
                parseToArray(currentIfElse.conditions).push(objIfElseCondition);

                
                this.setStore({ ifElseBlocks });

                //Showing option conditions menu
                this.setState({
                    conditionPopup: {
                        id: objIfElseCondition.uid,
                        step: conditionSelectionStep.operators
                    }
                });
            }
        }
    };

    removeIfElseCondition = (
        index = -1,
        ifElseIndex = -1,
        refIfElseBlocks = []
    ) => {
        if (ifElseIndex > -1 && index > -1) {
            const ifElseBlocks = [...parseToArray(refIfElseBlocks)];
            const currentIfElse = ifElseBlocks[ifElseIndex];
            if (currentIfElse) {
                parseToArray(currentIfElse.conditions).splice(index, 1);
                this.setStore({ ifElseBlocks });
            }
        }
    };

    updateIfElseCondition = (
        index = -1,
        payLoad = {},
        ifElseIndex = -1,
        refElseBlocks = []
    ) => {
        if (index > -1 && ifElseIndex > -1) {
            const ifElseBlocks = [...parseToArray(refElseBlocks)];
            const currentIfElse = ifElseBlocks[ifElseIndex];
            if (currentIfElse) {
                const currentCondition = parseToArray(currentIfElse.conditions)[
                    index
                ];
                if (currentCondition) {
                    // console.log('payLoad =>', payLoad, currentCondition);
                    // return false
                    if (
                        currentCondition.conditionOn.key === 'userClicked'
                        && payLoad.condition
                        && payLoad.condition.key !== currentCondition.condition.key
                    ) {
                        payLoad.value = null;
                    } else if (
                        payLoad &&
                        payLoad.valueType ===
                        conValueRenderTypes.multipleOptions
                    ) {
                        let value = currentCondition.value || [];
                        if (value.length && payLoad.value) {
                            // console.log('value =>>', value, payLoad);
                            const ind = value.findIndex(
                                v => v.uid === payLoad.value.uid
                            );
                            if (ind !== -1) {
                                value = value.filter(
                                    v => v.uid !== payLoad.value.uid
                                );
                            } else if (payLoad.value) {
                                value.push(payLoad.value);
                            }
                        } else if (payLoad.value) {
                            value.push(payLoad.value);
                        }
                        payLoad.value = value;
                    }

                    const newCondition = { ...currentCondition, ...payLoad };
                    // console.log('newCondition =>', newCondition);
                    // return false
                    currentIfElse.conditions[index] = newCondition;
                    this.setStore({ currentIfElse });
                }
            }
        }
    };
    //#endregion

    //#region Save and store
    setStore = (modProps = Object.create(null), isReduxStore = true) => {
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
            this.setState(newState);
        }
    };
    //#endregion

    //#endregion

    //#region Renderables

    renderIfElseBlocks = (ifElseBlocks = []) => {
        const conPopup = this.state.conditionPopup;
        const multipleBlocks = ifElseBlocks.length > 1;
        const isAddCondition = uid =>
            conPopup.id === uid &&
            conPopup.step === conditionSelectionStep.options;
        return parseToArray(ifElseBlocks).map((item, index) => {
            return (
                <Block className="condition-main-block" key={index}>
                    {multipleBlocks ? (
                        <Block className="ifNotBlock pos-relative">
                            <Button
                                size="tiny"
                                circular
                                onClick={() =>
                                    this.removeIfElseBlock(index, ifElseBlocks)
                                }
                            >
                                <Svg name="delete" />
                            </Button>
                            {index !== 0 && (
                                <Divider horizontal>If not</Divider>
                            )}
                        </Block>
                    ) : null}

                    <Block className="condition-titles">
                        <p>Does the user match</p>
                        <Dropdown
                            fluid
                            className="condition-button-block"
                            options={ifElseConditions}
                            value={item.operator}
                            onChange={(e, d) =>
                                this.updateIfElseBlock(
                                    index,
                                    { operator: d.value },
                                    ifElseBlocks
                                )
                            }
                        />
                    </Block>

                    <Block className="conditionBlock">
                        {this.renderConditions(
                            item.conditions,
                            index,
                            ifElseBlocks
                        )}
                        <Button
                            fluid
                            basic
                            size="big"
                            className="pos-relative"
                            onClick={() => {
                                this.setState({
                                    conditionPopup: {
                                        id: item.uid,
                                        step: conditionSelectionStep.options
                                    }
                                });
                            }}
                        >
                            + Condition
                            {isAddCondition(item.uid)
                                ? this.renderConditionOptions(
                                    ({ uid, label, key }) => {
                                        const conditionOption = conditionOptions.find(
                                            o => o.uid === uid
                                        );
                                        if (conditionOption) {
                                            const condition =
                                                conditionOption.conditions[0];
                                            this.addIfElseCondition(
                                                {
                                                    conditionOn: {
                                                        uid,
                                                        label,
                                                        key
                                                    },
                                                    condition: {
                                                        uid: condition.uid,
                                                        label:
                                                            condition.label,
                                                        key: condition.key
                                                    }
                                                },
                                                index,
                                                ifElseBlocks
                                            );
                                        }
                                    }
                                )
                                : null}
                        </Button>
                    </Block>

                    {/* <Block>
                        <p>Yes, the user matches</p>
                        <Button size="big" fluid basic>
                            Choose Next Step
                        </Button>
                    </Block> */}
                </Block>
            );
        });
    };

    renderConditions = (
        list = [],
        ifElseBlockIndex = -1,
        ifElseBlocks = []
    ) => {
        const conPopup = this.state.conditionPopup;
        function isConditionOptions(key) {
            return (
                conPopup.id === key &&
                conPopup.step === conditionSelectionStep.options
            );
        }
        function isOptionConditions(key) {
            return (
                conPopup.id === key &&
                conPopup.step === conditionSelectionStep.operators
            );
        }
        const showOptionConditions = uid => {
            if (
                this.state.conditionPopup.step !==
                conditionSelectionStep.operators
            ) {
                this.setState({
                    conditionPopup: {
                        id: uid,
                        step: conditionSelectionStep.operators
                    }
                });
            }
        };
        const onConditionOptionSelect = (option, conIndex, conUid) => {
            const currentOption = conditionOptions.find(
                c => c.uid === option.uid
            );
            if (currentOption) {
                this.updateIfElseCondition(
                    conIndex,
                    {
                        conditionOn: option,
                        condition: currentOption.conditions[0]
                    },
                    ifElseBlockIndex,
                    ifElseBlocks
                );
                showOptionConditions(conUid);
            }
        };
        function getErrorClass(item = {}) {
            if (item.valueType !== conValueRenderTypes.none && !item.value) {
                return 'error-txt';
            }
            return '';
        }

        return parseToArray(list).map((item, index) => (
            <Block key={index} className="genderBlock render-conditions">
                <span
                    className="poplink link"
                    onClick={() => {
                        this.setState({
                            conditionPopup: {
                                id: item.uid,
                                step: conditionSelectionStep.options
                            }
                        });
                    }}
                >
                    {item.conditionOn.label}
                    {isConditionOptions(item.uid)
                        ? this.renderConditionOptions(option => {
                            onConditionOptionSelect(option, index, item.uid);
                        })
                        : null}
                </span>
                <span
                    className={`poplink link ${getErrorClass(item)}`}
                    onClick={e => showOptionConditions(item.uid)}
                >
                    {item.condition.label}
                    {isOptionConditions(item.uid)
                        ? this.renderOperatorPopup(
                            item.conditionOn,
                            item.condition,
                            item.value,
                            payLoad => {
                                this.updateIfElseCondition(
                                    index,
                                    payLoad,
                                    ifElseBlockIndex,
                                    ifElseBlocks
                                );
                            }
                        )
                        : null}
                    &nbsp;
                    {typeof item.value === 'string'
                        ? item.value
                        : item.value &&
                        item.value.length > 0 &&
                        item.value.map((v, i) => {
                            if (i === 0) {
                                return v.value;
                            }
                            return `, ${v.value}`;
                        })}
                </span>
                <span>
                    <Button
                        size="tiny"
                        circular
                        onClick={() =>
                            this.removeIfElseCondition(
                                index,
                                ifElseBlockIndex,
                                ifElseBlocks
                            )
                        }
                    >
                        <Svg name="delete" />
                    </Button>
                </span>
            </Block>
        ));
    };

    //#region Condition Selection
    renderConditionOptions = (onOptionSelect = payLoad => { }) => {
        let optionSelected = false;
        return (
            <Dropdown
                defaultOpen
                className="pos-absolute right-v-center"
                onClose={() => {
                    if (!optionSelected)
                        this.setState({
                            conditionPopup: {
                                id: null,
                                step: conditionSelectionStep.none
                            }
                        });
                }}
            >
                <Dropdown.Menu>
                    <Input size="small" name="Search" />
                    {conditionCategories.map((cItem, cIndex) => (
                        <React.Fragment key={cIndex}>
                            <Dropdown.Header content={cIndex.name} />
                            <Dropdown.Divider />
                            {parseToArray(cItem.options).map(
                                (oItem, oIndex) => (
                                    <Dropdown.Item
                                        key={oIndex}
                                        text={oItem.label}
                                        value={oItem.uid}
                                        onClick={(e, d) => {
                                            optionSelected = true;
                                            onOptionSelect({
                                                uid: d.value,
                                                label: d.text,
                                                key: oItem.key
                                            });
                                        }}
                                    />
                                )
                            )}
                        </React.Fragment>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        );
    };

    renderOperatorPopup = (
        conditionOn,
        condition,
        value,
        onConditionSelect = ({ }) => { }
    ) => {
        document.addEventListener('click', this.closeOptionConditions, false);
        const conditionOption = conditionOptions.find(
            o => o.uid === conditionOn.uid
        );
        const conditions = parseToArray(
            conditionOption && conditionOption.conditions
        );
        const currentConDetail =
            conditions.find(c => c.uid === condition.uid) || {};
        // console.log('conditions => ', conditions);
        return (
            <Block className="genderPopup" id={conOperatorPopupElmId}>
                <Block className="popleft">
                    <List>
                        {conditions.map((op, idx) => (
                            <List.Item
                                key={idx}
                                onClick={() => {
                                    const condition = conditions.find(
                                        c => c.uid == op.uid
                                    );
                                    onConditionSelect({
                                        condition: {
                                            uid: op.uid,
                                            label: op.label,
                                            key: op.key
                                        },
                                        value: null,
                                        valueType: condition.valueType
                                    });
                                    if (
                                        condition &&
                                        condition.valueType ===
                                        conValueRenderTypes.none
                                    )
                                        this.closeOptionConditions(null, true);
                                }}
                            >
                                <a
                                    href="#"
                                    className={`${
                                        op.uid === condition.uid ? 'active' : ''
                                        }`}
                                >
                                    {op.label}
                                </a>
                            </List.Item>
                        ))}
                    </List>
                </Block>
                {currentConDetail.valueType !== conValueRenderTypes.none ? (
                    <Block className="popright">
                        {this.renderOperatorValRenderType(
                            value,
                            currentConDetail,
                            onConditionSelect
                        )}
                    </Block>
                ) : null}
            </Block>
        );
    };

    renderOperatorValRenderType = (
        value = null,
        currentConDetail = {},
        onConditionSelect = ({ }) => { }
    ) => {
        switch (currentConDetail.valueType) {
            case conValueRenderTypes.multipleOptions:
                const values =
                    value && value.length > 0 ? value.map(v => v.uid) : [];
                return (
                    <Block className="list">
                        {currentConDetail.values.map((v, i) => (
                            <a
                                href="#"
                                key={i}
                                className={`multi ${
                                    values.includes(v.uid) ? 'active' : ''
                                    }`}
                                onClick={() => {
                                    onConditionSelect({
                                        value: v,
                                        valueType:
                                            conValueRenderTypes.multipleOptions
                                    });
                                    // this.closeOptionConditions(null, true);
                                }}
                            >
                                <span>
                                    {typeof v === 'object' ? v.value : v}
                                </span>
                            </a>
                        ))}
                    </Block>
                );
            case conValueRenderTypes.options:
                return (
                    <Block className="list">
                        {currentConDetail.values.map((v, i) => (
                            <a
                                href="#"
                                key={i}
                                className={`${v === value ? 'active' : ''}`}
                                onClick={() => {
                                    onConditionSelect({
                                        value: v,
                                        valueType: conValueRenderTypes.options
                                    });
                                    this.closeOptionConditions(null, true);
                                }}
                            >
                                <span>
                                    {typeof v === 'object' ? v.value : v}
                                </span>
                            </a>
                        ))}
                    </Block>
                );
            case conValueRenderTypes.text:
                return (
                    <Block>
                        <Input
                            type="text"
                            placeholder="Enter text"
                            value={currentConDetail.value}
                            onChange={(e, d) => {
                                onConditionSelect({
                                    value: d.value,
                                    valueType: conValueRenderTypes.text
                                });
                            }}
                        />
                        <br />
                        <Checkbox
                            label="Case Sensitivity"
                            type="checkbox"
                            // checked={currentConDetail.caseSensitivity}
                            onChange={(e, d) => {
                                onConditionSelect({
                                    caseSensitivity: d.checked
                                });
                            }}
                        />
                    </Block>
                );
            case conValueRenderTypes.datePicker:
                const selectedDate = currentConDetail.value
                    ? new Date(currentConDetail.value)
                    : new Date();
                return (
                    <Block>
                        <ReactDatePicker
                            selected={selectedDate}
                            onChange={date => {
                                onConditionSelect({
                                    value: date.toDateString(),
                                    valueType: conValueRenderTypes.datePicker
                                });
                            }}
                        />
                    </Block>
                );
            default:
                return null;
        }
    };

    closeOptionConditions = (e, onDemand = false) => {
        if (!onDemand) {
            const elm = document.getElementById(conOperatorPopupElmId);
            if (elm && elm.contains(e.target)) return;
        }
        document.removeEventListener('click', this.closeOptionConditions, this);
        if (this.state.conditionPopup.id) {
            this.setState({
                conditionPopup: { id: null, step: conditionSelectionStep.none }
            });
        }
    };
    //#endregion

    //#endregion

    render() {
        const { ifElseBlocks } = this.props.currentStep;
        return (
            <Block className="condition-wrapper-aside">
                {this.renderIfElseBlocks(ifElseBlocks)}
                <Block className="ifnotBlock">
                    <Divider horizontal>If not</Divider>
                    <Block>
                        <Button
                            size="big"
                            fluid
                            basic
                            onClick={() => this.addIfElseBlock(ifElseBlocks)}
                        >
                            Choose Another Condition
                        </Button>
                    </Block>
                    {/* <br />
                    <Block>
                        <Button size="big" fluid basic>
                            Choose Next Step
                        </Button>
                    </Block> */}
                </Block>
            </Block>
        );
    }
}

ConditionBuilder.propTypes = {
    currentStep: PropTypes.object
};
const mapStateToProps = state => {
    return {
        currentStep: getCurrentStep(state),
        steps: getAllSteps(state),
        tags: getTagsState(state).tags,
        workflowTriggers: getWorkflowTriggers(state)
    };
};
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({ updateStepInfo }, dispatch)
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(ConditionBuilder)
);
