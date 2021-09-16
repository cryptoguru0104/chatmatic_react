import uuid from 'uuid/v4';
import { ConditionBuilderModel } from '../../scenes/Home/scenes/EngageAdd/models/ConditionBuilderModel';
import { parseToArray } from '../../services/utils';
import { getConditionKeyMappedIds } from '../../constants/conditionBuilderConstants';

export const conditionBuilderTransformer = Object.freeze({
    forApi: (uiConditionModel = {}) => {
        if (!uiConditionModel) throw new Error('Condition transformer error');
        const stepData = {
            name: uiConditionModel.name,
            type: uiConditionModel.stepType,
            stepUid: uiConditionModel.stepUid,
            childUid: uiConditionModel.nextStepUid̰ || null,
            position: uiConditionModel.position,
            options: []
        };

        const ifElseBlocks = new ConditionBuilderModel.Model(uiConditionModel);

        let nextCharCode = 64;
        stepData.options = ifElseBlocks.ifElseBlocks.map(block => {
            const ifElseModel = new ConditionBuilderModel.IfElse(block);
            const optionTitle = String.fromCharCode(++nextCharCode);
            const transIFElse = {
                option: optionTitle,
                nextStepUid: ifElseModel.nextStepUid,
                match: ifElseModel.operator == 'or' ? 'if_any' : 'if_all',
                conditions: {}
            };
            if (ifElseModel.conditions.length > 0) {
                ifElseModel.conditions.forEach(c => {
                    const conModel = new ConditionBuilderModel.Condition(c);
                    if (
                        conModel.conditionOn &&
                        conModel.condition &&
                        conModel.value
                    ) {
                        const key = `${conModel.conditionOn.key}${conModel.condition.key}`;
                        transIFElse.conditions[key] =
                            typeof conModel.value === 'string'
                                ? (conModel.value || '').toLowerCase()
                                : conModel.value.map(v => {
                                      //   console.log('v =>', v, conModel.value);
                                      return v.uid;
                                  });

                        // console.log(
                        //     'transIFElse.conditions[key] =>',
                        //     transIFElse.conditions[key]
                        // );
                    }
                });
            }

            // console.log('transIFElse', transIFElse);
            return transIFElse;
        });

        if (uiConditionModel.nextStepUid) {
            stepData.options.push({
                nextStepUid: uiConditionModel.nextStepUid,
                option: 'None match',
                match: 'if_all'
            });
        }

        // console.log('stepData', stepData);

        return stepData;
    },

    forUi: (apiConditionModel = {}) => {
        if (!apiConditionModel) throw new Error('Condition transformer error');
        const mappedIds = getConditionKeyMappedIds();
        const allOpns = parseToArray(apiConditionModel.options);
        const ind = allOpns.findIndex(o => o.conditions === null);
        const options = allOpns.filter(o => o.conditions !== null).reverse();
        const stepData = {
            name: apiConditionModel.name,
            stepType: apiConditionModel.type,
            stepUid: apiConditionModel.stepUid,
            nextStepUid: ind !== -1 ? allOpns[ind].nextStepUid : null,
            position: apiConditionModel.position,
            ifElseBlocks: []
        };

        stepData.ifElseBlocks = options.map(c => {
            const ifElseModel = new ConditionBuilderModel.IfElse();
            ifElseModel.uid = uuid();
            ifElseModel.option = c.option;
            ifElseModel.operator = c.match === 'if_any' ? 'or' : 'and';
            ifElseModel.nextStepUid = c.nextStepUid;
            ifElseModel.conditions = Object.keys(c.conditions || {}).map(k => {
                const conModel = new ConditionBuilderModel.Condition();
                conModel.conditionOn = mappedIds[k].conditionOn;
                conModel.condition = mappedIds[k].condition;
                conModel.valueType = mappedIds[k].condition.valueType;
                if (parseToArray(c.conditions[k]).length) {
                    conModel.value = c.conditions[k].map(v => ({
                        uid: v.uid,
                        value: v.name
                    }));
                } else {
                    conModel.value = c.conditions[k];
                }
                delete conModel.condition.valueType;
                delete conModel.condition.values;
                delete conModel.conditionOn.conditions;
                conModel.uid = uuid();
                return conModel;
            });
            return ifElseModel;
        });

        return stepData;
    }
});

export const transformStepsToLocal = steps => {
    return steps.map(s => {
        s.stepType = s.type;

        if (s.type && s.type === 'sms' && s.options) {
            s.items = [{ value: s.options.smsTextMessage, type: 'text' }];
            s.phoneNumberTo = s.options.phoneNumberTo;
            s.isNextStep = true;
            delete s.options;
        } else if (s.type && s.type === 'smtp' && s.options) {
            s.items = [
                { value: s.options.fromName, type: 'text' },
                { value: s.options.fromEmailAddress, type: 'text' },
                { value: s.options.toEmailAddress, type: 'text' },
                { value: s.options.subject, type: 'text' },
                { value: s.options.body, type: 'editor' }
            ];
            s.smtpIntegration = s.options.smtpIntegration;
            s.isNextStep = true;
            delete s.options;
        } else if (s.type && s.type === 'conditions') {
            s = conditionBuilderTransformer.forUi(s);
        } else if (s.type && s.type === 'randomizer' && s.options) {
            s.options = s.options.reverse();
        } else if (s.type && s.type === 'delay' && s.options) {
            s.amount = s.options.amount;
            s.timeUnit = s.options.timeUnit;
            s.nextStepUid = s.options.nextStepUid;
            s.delayType = s.options.type;
            delete s.options;
        }

        if (s.childUid) {
            s.nextStepUid = s.childUid;
            delete s.childUid;
        }

        return s;
    });
};
