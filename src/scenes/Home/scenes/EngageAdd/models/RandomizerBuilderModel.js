export class RandomizerBuliderModel {
    constructor(args = Object.create(null)) {
        const inputs = args || {};
        this.isRandomPath = Boolean(inputs.isRandomPath);
        this.options = Array.isArray(inputs.options) ? inputs.options : [];
        this.isError = Boolean(inputs.isError);
    }
}
export class RandomizerBuilderItemModel {
    constructor(args = Object.create(null)) {
        const inputs = args || {};
        this.option = String(inputs.option);
        this.percentage = Number(inputs.percentage);
        this.uid = inputs.uid;
        this.nextStepUid = inputs.nextStepUid;
    }
}
