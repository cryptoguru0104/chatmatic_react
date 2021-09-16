export default class DelayBuilderModel {
    constructor(args = Object.create(null)) {
        const inputs = args || {};
        this.delayType = String(inputs.delayType);
        this.amount = inputs.amount ? Number(inputs.amount) : inputs.amount;
        this.timeUnit = String(inputs.timeUnit);
        // this.isContinueTime = Boolean(inputs.isContinueTime);
        // this.selectedDays = Array.isArray(inputs.selectedDays)
        //     ? inputs.selectedDays
        //     : [];
        // this.startTime = String(inputs.startTime);
        // this.endTime = String(inputs.endTime);
        this.nextStepUid = inputs.nextStepUid;
    }
}
