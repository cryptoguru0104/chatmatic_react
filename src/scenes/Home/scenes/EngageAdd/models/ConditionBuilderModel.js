import { parseToArray } from '../../../../../services/utils';

export const ConditionBuilderModel = Object.freeze({
    Model: class {
        constructor(inputs = Object.create(null)) {
            this.ifElseBlocks = parseToArray(inputs.ifElseBlocks);
            this.nextStepUid = inputs.nextStepUid;
        }
    },
    IfElse: class {
        constructor(inputs = Object.create(null)) {
            this.uid = inputs.uid;
            this.nextStepUid = inputs.nextStepUid;
            this.operator = inputs.operator;
            this.conditions = parseToArray(inputs.conditions);
        }
    },
    Else: class {
        constructor(inputs = Object.create(null)) {
            this.uid = inputs.uid;
            this.nextStepUid = inputs.nextStepUid;
        }
    },
    Condition: class {
        constructor(inputs = Object.create(null)) {
            this.uid = inputs.uid;
            this.conditionOn = inputs.conditionOn;
            this.condition = inputs.condition;
            this.valueType = inputs.valueType;
            this.value = inputs.value;
            this.caseSensitivity = inputs.caseSensitivity;
        }
    }
});
