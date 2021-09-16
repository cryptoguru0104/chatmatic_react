import uuid from 'uuid/v4';

export const conValueRenderTypes = Object.freeze({
    none: 'none',
    options: 'options',
    multipleOptions: 'multiple-options',
    number: 'number',
    text: 'text',
    datePicker: 'date-picker',
    timePicker: 'time-picker',
    dateTimePicker: 'date-time-picker'
});

export const operators = Object.freeze({
    is: {
        uid: uuid(),
        label: 'is',
        key: 'Is'
    },
    isNot: {
        uid: uuid(),
        label: `isn't`,
        key: 'IsNot'
    },
    hasAnyValue: {
        uid: uuid(),
        label: 'has any value',
        key: 'HasAnyValue'
    },
    isUnknown: {
        uid: uuid(),
        label: 'is unknown',
        key: 'IsUnknown'
    },
    contains: {
        uid: uuid(),
        label: 'contains',
        key: 'Contains'
    },
    notContain: {
        uid: uuid(),
        label: `doesn't contain`,
        key: 'DoesNotContain'
    },
    has: {
        uid: uuid(),
        label: `has`,
        key: 'Has'
    },
    hasNot: {
        uid: uuid(),
        label: `hasn't`,
        key: 'HasNot'
    },
    before: {
        uid: uuid(),
        label: 'before',
        key: 'Before'
    },
    after: {
        uid: uuid(),
        label: 'after',
        key: 'After'
    },
    on: {
        uid: uuid(),
        label: 'on',
        key: 'On'
    },
    subscribedTo: {
        uid: uuid(),
        label: 'subscribed to',
        key: 'SubscribedTo'
    },
    notSubscribedTo: {
        uid: uuid(),
        label: 'not subscribed to',
        key: 'NotSubscribedTo'
    },
    button: {
        uid: uuid(),
        label: 'button',
        key: 'Button'
    },
    quickReply: {
        uid: uuid(),
        label: 'quick reply',
        key: 'QuickReply'
    },
    tag: {
        uid: uuid(),
        label: `tag`,
        key: 'Tag'
    }
});

export const conditionCategories = Object.freeze([
    {
        uid: uuid(),
        name: 'System Defined',
        options: [
            // {
            //     uid: uuid(),
            //     label: 'Gender',
            //     key: 'gender',
            //     conditions: [
            //         {
            //             ...operators.is,
            //             valueType: conValueRenderTypes.options,
            //             values: ['male', 'female']
            //         }
            //     ]
            // },
            {
                uid: uuid(),
                label: 'Subscribed',
                key: 'subscribedDate',
                conditions: [
                    {
                        ...operators.after,
                        valueType: conValueRenderTypes.datePicker
                    },
                    {
                        ...operators.before,
                        valueType: conValueRenderTypes.datePicker
                    },
                    {
                        ...operators.on,
                        valueType: conValueRenderTypes.datePicker
                    }
                ]
            },
            {
                uid: uuid(),
                label: 'User',
                key: 'user',
                conditions: [
                    {
                        ...operators.subscribedTo,
                        valueType: conValueRenderTypes.multipleOptions,
                        values: []
                    },
                    {
                        ...operators.notSubscribedTo,
                        valueType: conValueRenderTypes.multipleOptions,
                        values: []
                    }
                ]
            },
            {
                uid: uuid(),
                label: 'Has',
                key: 'has',
                conditions: [
                    {
                        ...operators.tag,
                        valueType: conValueRenderTypes.multipleOptions,
                        values: []
                    }
                ]
            },
            {
                uid: uuid(),
                label: "Doesn't have",
                key: 'doesNotHave',
                conditions: [
                    {
                        ...operators.tag,
                        valueType: conValueRenderTypes.multipleOptions,
                        values: []
                    }
                ]
            },
            {
                uid: uuid(),
                label: 'User clicked',
                key: 'userClicked',
                conditions: [
                    {
                        ...operators.button,
                        valueType: conValueRenderTypes.multipleOptions,
                        values: []
                    },
                    {
                        ...operators.quickReply,
                        valueType: conValueRenderTypes.multipleOptions,
                        values: []
                    }
                ]
            },
            // {
            //     uid: uuid(),
            //     label: 'Quick reply',
            //     key: 'quickReply',
            //     conditions: [
            //         {
            //             ...operators.clicked,
            //             valueType: conValueRenderTypes.multipleOptions,
            //             values: []
            //         }
            //     ]
            // }
        ]
    }
]);

export const conditionOptions = conditionCategories[0].options;

//Keys mapping
export const getConditionKeyMappedIds = () => {
    const keyDetails = {};
    conditionOptions.forEach(o => {
        o.conditions.forEach(oc => {
            keyDetails[o.key + oc.key] = {
                conditionOn: { ...o },
                condition: { ...oc }
            };
        });
    });
    return keyDetails;
};
