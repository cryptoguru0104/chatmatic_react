import DelayBuilderModel from '../models/DelayBuilderModel';
import { durationTypes } from '../../../../../constants/AppConstants';
import uuid from 'uuid/v4';
import {
    RandomizerBuliderModel,
    RandomizerBuilderItemModel
} from '../models/RandomizerBuilderModel';
import { SMSBuilderModel } from '../models/SMSBuilderModel';
import { SMTPBuilderModel } from '../models/SMTPBuilderModel';
import Constants, { conditionBuilder } from '../../../../../config/Constants';
import { ConditionBuilderModel } from '../models/ConditionBuilderModel';

export const getDelayBuilderDefaultState = () => {
    const obj = new DelayBuilderModel();
    obj.delayType = 'remaining';
    obj.amount = 1;
    obj.timeUnit = durationTypes.hour.value;
    obj.isContinueTime = false;
    obj.startTime = '00';
    obj.endTime = '01';
    obj.nextStepUid = null;
    return obj;
};

export const getRandomizerBuilderDefaultState = () => {
    const obj = new RandomizerBuliderModel();
    obj.isRandomPath = false;
    obj.options = [
        new RandomizerBuilderItemModel({
            option: 'A',
            percentage: 50,
            uid: uuid(),
            nextStepUid: null
        }),
        new RandomizerBuilderItemModel({
            option: 'B',
            percentage: 50,
            uid: uuid(),
            nextStepUid: null
        })
    ];
    return obj;
};

export const getSMSBuilderDefaultState = () => {
    const obj = new SMSBuilderModel.Model();
    obj.items = [
        new SMSBuilderModel.Item({
            value: '',
            type: Constants.smsBuilderItemTypes.text,
            uid: uuid(),
            nextStepUid: null
        })
    ];
    obj.phoneNumberTo = null;
    obj.userReplies = [];
    obj.fallBack = null;
    obj.isNextStep = true;
    obj.nextStepUid = null;
    return obj;
};
export const getSMTPBuilderDefaultState = () => {
    const obj = new SMTPBuilderModel.Model();
    obj.items = [
        new SMTPBuilderModel.Item({
            value: '',
            type: Constants.smtpBuilderItemTypes.text,
            uid: uuid(),
            nextStepUid: null
        }),
        new SMTPBuilderModel.Item({
            value: '',
            type: Constants.smtpBuilderItemTypes.text,
            uid: uuid(),
            nextStepUid: null
        }),
        new SMTPBuilderModel.Item({
            value: '',
            type: Constants.smtpBuilderItemTypes.text,
            uid: uuid(),
            nextStepUid: null
        }),
        new SMTPBuilderModel.Item({
            value: '',
            type: Constants.smtpBuilderItemTypes.text,
            uid: uuid(),
            nextStepUid: null
        }),
        new SMTPBuilderModel.Item({
            value: '',
            type: Constants.smtpBuilderItemTypes.editor,
            uid: uuid(),
            nextStepUid: null
        })
    ];
    obj.userReplies = [];
    obj.smtpIntegration = -1;
    obj.fallBack = null;
    obj.isNextStep = true;
    obj.nextStepUid = null;
    return obj;
};

export const getConditionBuilderDefaultState = () => {
    const model = new ConditionBuilderModel.Model();
    const objIfElse = new ConditionBuilderModel.IfElse();
    objIfElse.uid = uuid();
    objIfElse.operator = conditionBuilder.ifElseOperator.and.operator;
    objIfElse.conditions = [];
    model.ifElseBlocks = [objIfElse];
    return model;
};
