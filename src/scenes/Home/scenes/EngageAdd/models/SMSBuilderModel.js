import { parseToArray } from '../../../../../services/utils';

export const SMSBuilderModel = Object.freeze({
    Model: class {
        constructor(inputs = Object.create(null)) {
            this.items = parseToArray(inputs.items);
            this.userReplies = Array.isArray(inputs.userReplies)
                ? inputs.userReplies
                : [];
            this.isNextStep = Boolean(inputs.isNextStep);
            this.nextStepUid = inputs.nextStepUid;
            this.fallBack = inputs.fallBack;
            this.phoneNumberTo = inputs.phoneNumberTo;
        }
    },
    Item: class {
        constructor(inputs = Object.create(null)) {
            this.value = inputs.value;
            this.type = inputs.type;
            this.uid = inputs.uid;
            this.nextStepUid = inputs.nextStepUid;
        }
    },
    UserReplyItem: class {
        constructor(inputs = Object.create(null)) {
            this.text = inputs.text;
            this.uid = inputs.uid;
            this.nextStepUid = inputs.nextStepUid;
        }
    }
});
