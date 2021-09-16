import { handleActions } from 'redux-actions';
import uuid from 'uuid/v4';
import {
    updateEngageInfo,
    deleteEngageInfo,
    addStepInfo,
    updateStepInfo,
    updateSmsPhoneNumber,
    updateSmtpIntegration,
    deleteStepInfo,
    updateItemInfo,
    deleteItemInfo,
    updateCarouselItemInfo,
    deleteCarouselItemInfo,
    addActionButton,
    updateActionButton,
    deleteActionButton,
    addCarouselActionButton,
    updateCarouselActionButton,
    deleteCarouselActionButton,
    swapItem,
    deleteQuickReply,
    addEngage,
    addEngageSucceed,
    addEngageFailed,
    updateEngage,
    updateEngageSucceed,
    updateEngageFailed,
    fileUpload,
    fileUploadSucceed,
    fileUploadFailed,
    pageFileUpload,
    pageFileUploadSucceed,
    pageFileUploadFailed,
    // Broadcast Actions
    saveBroadcast,
    saveBroadcastSucceed,
    saveBroadcastFailed,
    updateBroadcast,
    addBroadcastCondition,
    updateBroadcastCondition,
    deleteBroadcastCondition,
    getWidgetTypes,
    getWidgetTypesSucceed,
    getWidgetTypesFailed,
    getProducts,
    getProductsSucceed,
    getProductsFailed,
    getCollects,
    getCollectsSucceed,
    getCollectsFailed,
} from './actions';
import Constants from '../../../../../config/Constants';
import {
    getDelayBuilderDefaultState,
    getRandomizerBuilderDefaultState,
    getSMSBuilderDefaultState,
    getSMTPBuilderDefaultState,
    getConditionBuilderDefaultState
} from './default-state';

const defaultState = {
    name: '',
    workflowType: '',
    steps: [],
    activeStep: '',
    uid: null,
    broadcast: {},
    loading: false,
    error: null,
    showBuilderAsideMenu: false,
    fileUploading: false,
    uploadedFile: null,
    widgetTypes: [],
    products: [],
    collects: [],
    apiLoading: false,
    apiError: null
};
const getBuilderDefaultState = type => {
    switch (type) {
        case Constants.builderTypes.delayConfig.type:
            return getDelayBuilderDefaultState();
        case Constants.builderTypes.randomizerConfig.type:
            return getRandomizerBuilderDefaultState();
        case Constants.builderTypes.smsConfig.type:
            return getSMSBuilderDefaultState();
        case Constants.builderTypes.smtpConfig.type:
            return getSMTPBuilderDefaultState();
        case Constants.builderTypes.conditionConfig.type:
            return getConditionBuilderDefaultState();
        case 'items':
        default:
            return {
                items: [
                    {
                        type: Constants.toolboxItems.textItem.type,
                        textMessage: null,
                        actionBtns: [],
                        order: 0
                    }
                ]
            };
    }
};

const reducer = handleActions(
    {
        [updateEngageInfo](state, { payload: { engage } }) {
            return {
                ...state,
                ...engage
            };
        },
        [deleteEngageInfo]() {
            return defaultState;
        },
        [addStepInfo](
            state,
            { payload: { stepUid, stepType, name, top, left } }
        ) {
            if (stepType === 'items') { name += ` ${state.steps.filter(s => s.stepType === 'items').length + 1}`; }
            const steps = state.steps.concat([
                {
                    name,
                    items: [],
                    stepUid,
                    quickReplies: [],
                    stepType,
                    position: {
                        y: top,
                        x: left
                    },
                    ...getBuilderDefaultState(stepType)
                }
            ]);
            return {
                ...state,
                steps
            };
        },
        [updateStepInfo](state, { payload: { stepUid, step } }) {
            const newSteps = state.steps.map(item => {
                if (item.stepUid != stepUid) return item;
                return {
                    ...item,
                    ...step
                };
            });
            return {
                ...state,
                steps: newSteps
            };
        },
        [updateSmsPhoneNumber](state, { payload: { phone } }) {
            return {
                ...state,
                smsPhone: phone
            };
        },
        [updateSmtpIntegration](state, { payload: { smtpIntegration }}) {
            return {
                ...state,
                smtpIntegration: smtpIntegration
            };
        },
        [deleteStepInfo](state, { payload: { stepUid } }) {
            return {
                ...state,
                steps: state.steps.filter(step => step.stepUid !== stepUid)
            };
        },
        [updateItemInfo](state, { payload: { itemIndex, item } }) {
            const steps = state.steps.map(step => {
                if (step.stepUid != state.activeStep) return step;

                const items = step.items.map((arryItem, index) => {
                    if (index !== itemIndex) return arryItem;
                    return {
                        ...arryItem,
                        ...item
                    };
                });

                return {
                    ...step,
                    items
                };
            });

            return {
                ...state,
                steps
            };
        },
        [deleteItemInfo](state, { payload: { itemIndex } }) {
            const steps = state.steps.map(step => {
                if (step.stepUid != state.activeStep) return step;
                return {
                    ...step,
                    items: step.items.filter(
                        (item, index) => index !== itemIndex
                    )
                };
            });

            return {
                ...state,
                steps
            };
        },
        [updateCarouselItemInfo](
            state,
            { payload: { itemIndex, carouselIndex, item } }
        ) {
            const steps = state.steps.map(step => {
                if (step.stepUid != state.activeStep) return step;

                const items = step.items.map((arryItem, index) => {
                    if (index !== itemIndex) return arryItem;

                    const carouselItems = arryItem.items
                        ? arryItem.items.map((carouselItem, index) => {
                              if (index !== carouselIndex) return carouselItem;

                              return {
                                  ...carouselItem,
                                  ...item
                              };
                          })
                        : [];

                    return {
                        ...arryItem,
                        items: carouselItems
                    };
                });

                return {
                    ...step,
                    items
                };
            });

            return {
                ...state,
                steps
            };
        },
        [deleteCarouselItemInfo](
            state,
            { payload: { itemIndex, carouselIndex } }
        ) {
            const steps = state.steps.map(step => {
                if (step.stepUid != state.activeStep) return step;

                const items = step.items.map((item, index) => {
                    if (index !== itemIndex) return item;

                    const items = item.items.filter(
                        (carouselItem, index) => index !== carouselIndex
                    );

                    return {
                        ...item,
                        items
                    };
                });

                return {
                    ...step,
                    items
                };
            });

            return {
                ...state,
                steps
            };
        },
        [addActionButton](state, { payload: { itemIndex } }) {
            const steps = state.steps.map(step => {
                if (step.stepUid != state.activeStep) return step;

                const items = step.items.map((item, index) => {
                    if (index !== itemIndex) return item;

                    const actionBtns = item.actionBtns || [];

                    return {
                        ...item,
                        actionBtns: actionBtns.concat([
                            { label: '', uid: uuid() }
                        ])
                    };
                });

                return {
                    ...step,
                    items
                };
            });

            return {
                ...state,
                steps
            };
        },
        [updateActionButton](
            state,
            { payload: { itemIndex, actionBtnIndex, actionBtn } }
        ) {
            const steps = state.steps.map(step => {
                if (step.stepUid != state.activeStep) return step;

                const items = step.items.map((item, index) => {
                    if (index !== itemIndex) return item;

                    const actionBtns = item.actionBtns.map(
                        (actionBtnItem, index) => {
                            if (index !== actionBtnIndex) return actionBtnItem;

                            return {
                                ...actionBtnItem,
                                ...actionBtn
                            };
                        }
                    );

                    return {
                        ...item,
                        actionBtns
                    };
                });

                return {
                    ...step,
                    items
                };
            });

            return {
                ...state,
                steps
            };
        },
        [deleteActionButton](
            state,
            { payload: { itemIndex, actionBtnIndex } }
        ) {
            const steps = state.steps.map(step => {
                if (step.stepUid != state.activeStep) return step;

                const items = step.items.map((item, index) => {
                    if (index !== itemIndex) return item;

                    const actionBtns = item.actionBtns.filter(
                        (actionBtnItem, index) => index !== actionBtnIndex
                    );

                    return {
                        ...item,
                        actionBtns
                    };
                });

                return {
                    ...step,
                    items
                };
            });

            return {
                ...state,
                steps
            };
        },
        [addCarouselActionButton](
            state,
            { payload: { itemIndex, carouselIndex } }
        ) {
            const steps = state.steps.map(step => {
                if (step.stepUid != state.activeStep) return step;

                const items = step.items.map((item, index) => {
                    if (index !== itemIndex) return item;

                    const items = item.items.map((carouselItem, index) => {
                        if (index !== carouselIndex) return carouselItem;

                        const actionBtns = carouselItem.actionBtns || [];

                        return {
                            ...carouselItem,
                            actionBtns: actionBtns.concat([
                                { label: '', uid: uuid() }
                            ])
                        };
                    });

                    return {
                        ...item,
                        items
                    };
                });

                return {
                    ...step,
                    items
                };
            });

            return {
                ...state,
                steps
            };
        },
        [updateCarouselActionButton](
            state,
            { payload: { itemIndex, carouselIndex, actionBtnIndex, actionBtn } }
        ) {
            const steps = state.steps.map(step => {
                if (step.stepUid != state.activeStep) return step;

                const items = step.items.map((item, index) => {
                    if (index !== itemIndex) return item;

                    const items = item.items.map((carouselItem, index) => {
                        if (index !== carouselIndex) return carouselItem;

                        const actionBtns = carouselItem.actionBtns.map(
                            (actionBtnItem, index) => {
                                if (index !== actionBtnIndex)
                                    return actionBtnItem;

                                return {
                                    ...actionBtnItem,
                                    ...actionBtn
                                };
                            }
                        );

                        return {
                            ...carouselItem,
                            actionBtns
                        };
                    });

                    return {
                        ...item,
                        items
                    };
                });

                return {
                    ...step,
                    items
                };
            });

            return {
                ...state,
                steps
            };
        },
        [deleteCarouselActionButton](
            state,
            { payload: { itemIndex, carouselIndex, actionBtnIndex } }
        ) {
            const steps = state.steps.map(step => {
                if (step.stepUid != state.activeStep) return step;

                const items = step.items.map((item, index) => {
                    if (index !== itemIndex) return item;

                    const items = item.items.map((carouselItem, index) => {
                        if (index !== carouselIndex) return carouselItem;

                        const actionBtns = carouselItem.actionBtns.filter(
                            (actionBtnItem, index) => index !== actionBtnIndex
                        );

                        return {
                            ...carouselItem,
                            actionBtns
                        };
                    });

                    return {
                        ...item,
                        items
                    };
                });

                return {
                    ...step,
                    items
                };
            });

            return {
                ...state,
                steps
            };
        },
        [swapItem](state, { payload: { oldItemIndex, newItemIndex } }) {
            const steps = state.steps.map(step => {
                if (step.stepUid.toString() === state.activeStep.toString()) {
                    [step.items[oldItemIndex], step.items[newItemIndex]] = [
                        step.items[newItemIndex],
                        step.items[oldItemIndex]
                    ];
                }

                return step;
            });

            return {
                ...state,
                steps
            };
        },
        [deleteQuickReply](state, { payload: { quickReplyIndex } }) {
            const steps = state.steps.map(step => {
                if (step.stepUid != state.activeStep) return step;

                const quickReplies = step.quickReplies.filter(
                    (quickReply, index) => index !== quickReplyIndex
                );

                return {
                    ...step,
                    quickReplies
                };
            });

            return {
                ...state,
                steps
            };
        },
        [addEngage](state) {
            return {
                ...state,
                loading: true,
                error: null
            };
        },
        [addEngageSucceed](state, { payload: { uid } }) {
            return {
                ...state,
                uid,
                loading: false,
                error: null
            };
        },
        [addEngageFailed](state, { payload: { error } }) {
            return {
                ...state,
                loading: false,
                error
            };
        },
        [updateEngage](state) {
            return {
                ...state,
                loading: true,
                error: null
            };
        },
        [updateEngageSucceed](state, { payload: { uid } }) {
            return {
                ...state,
                uid,
                loading: false,
                error: null
            };
        },
        [updateEngageFailed](state, { payload: { error } }) {
            return {
                ...state,
                loading: false,
                error
            };
        },
        [fileUpload](state) {
            return {
                ...state,
                error: null
            };
        },
        [fileUploadSucceed](
            state,
            { payload: { stepUid, itemIndex, fileUid, url, carouselItemIndex } }
        ) {
            const steps = state.steps.map(step => {
                if (step.stepUid !== stepUid) return step;

                const items = step.items.map((item, index) => {
                    if (index !== itemIndex) return item;

                    if (item.type === 'carousel') {
                        const carouselItems = item.items.map(
                            (carouselItem, index) => {
                                if (index !== carouselItemIndex)
                                    return carouselItem;

                                return {
                                    ...carouselItem,
                                    mediaUid: fileUid,
                                    image: url
                                };
                            }
                        );

                        return {
                            ...item,
                            items: carouselItems
                        };
                    }

                    let mediaSrc = { error: false };

                    if (item.type === 'audio') {
                        mediaSrc['audio'] = url;
                    } else if (item.type === 'video') {
                        mediaSrc['video'] = url;
                    } else {
                        mediaSrc['image'] = url;
                    }

                    return {
                        ...item,
                        mediaUid: fileUid,
                        ...mediaSrc
                    };
                });

                return {
                    ...step,
                    items
                };
            });

            return {
                ...state,
                steps
            };
        },
        [fileUploadFailed](state, { payload: { error } }) {
            return {
                ...state,
                error
            };
        },
        [pageFileUpload](state) {
            return {
                ...state,
                fileUploading: true,
                uploadedFile: null,
                error: null
            };
        },
        [pageFileUploadSucceed](
            state,
            { payload: { fileUid, url } }
        ) {
            const uploadedFile = {
                fileUid,
                url
            }
            console.log('uploadedFile', uploadedFile);
            return {
                ...state,
                fileUploading: false,
                uploadedFile
            };
        },
        [pageFileUploadFailed](state, { payload: { error } }) {
            return {
                ...state,
                fileUploading: false,
                error
            };
        },
        [saveBroadcast](state) {
            return {
                ...state,
                loading: true,
                error: null
            };
        },
        [saveBroadcastSucceed](state) {
            return {
                ...state,
                loading: false,
                error: null
            };
        },
        [saveBroadcastFailed](state, { payload: { error } }) {
            return {
                ...state,
                loading: false,
                error
            };
        },
        [updateBroadcast](state, { payload: { broadcast } }) {
            return {
                ...state,
                broadcast: {
                    ...state.broadcast,
                    ...broadcast
                }
            };
        },
        [addBroadcastCondition](state) {
            if (state.broadcast && state.broadcast.conditions) {
                return {
                    ...state,
                    broadcast: {
                        ...state.broadcast,
                        conditions: state.broadcast.conditions.concat([
                            { type: '' }
                        ])
                    }
                };
            } else {
                let broadcast = state.broadcast || {};

                return {
                    ...state,
                    broadcast: {
                        ...broadcast,
                        conditions: [{ type: '' }]
                    }
                };
            }
        },
        [updateBroadcastCondition](
            state,
            { payload: { conditionIndex, condition } }
        ) {
            const conditions = state.broadcast.conditions.map(
                (element, index) => {
                    return index !== conditionIndex ? element : condition;
                }
            );

            return {
                ...state,
                broadcast: {
                    ...state.broadcast,
                    conditions
                }
            };
        },
        [deleteBroadcastCondition](state, { payload: { conditionIndex } }) {
            const conditions = state.broadcast.conditions.filter(
                (element, index) => index !== conditionIndex
            );

            return {
                ...state,
                broadcast: {
                    ...state.broadcast,
                    conditions
                }
            };
        },
        [getWidgetTypes](state, { payload: { pageId } }) {
            return {
                ...state,
            };
        },
        [getWidgetTypesSucceed](state, { payload: { widgetTypes } }) {
            return {
                ...state,
                widgetTypes, // ------------ to add a loading --------- cannot flush update on rendering error occurred.
            };
        },
        [getWidgetTypesFailed](state, { payload: { error } }) {
            return {
                ...state,
                error,      // ------------ to add a loading ---------
            };
        },
        [getProducts](state, { payload: {pageId, integration_uid} }) {
            return {
                ...state,
                apiLoading: true
            };
        },
        [getProductsSucceed](state, { payload: { products } }) {
            return {
                ...state,
                apiLoading: false,
                products
            };
        },
        [getProductsFailed](state, { payload: {apiError} }) {
            return {
                ...state,
                apiLoading: false,
                apiError,
            };
        },
        [getCollects](state, { payload: {pageId, integration_uid} }) {
            return {
                ...state,
                apiLoading: true,
            };
        },
        [getCollectsSucceed](state, { payload: { collects } }) {
            return {
                ...state,
                apiLoading: false,
                collects
            };
        },
        [getCollectsFailed](state, { payload: {apiError} }) {
            return {
                ...state,
                apiLoading: false,
                apiError,
            };
        },
    },
    defaultState
);

export default reducer;
