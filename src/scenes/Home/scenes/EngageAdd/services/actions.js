import { createActions } from 'redux-actions';

const {
    getWidgetTypes,
    getWidgetTypesSucceed,
    getWidgetTypesFailed,
    getProducts,
    getProductsSucceed,
    getProductsFailed,
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
    saveBroadcast, //  update broadcast on DB
    saveBroadcastSucceed,
    saveBroadcastFailed,
    updateBroadcast, // update store with form changes
    addBroadcastCondition,
    updateBroadcastCondition,
    deleteBroadcastCondition,
    getCollects,
    getCollectsSucceed,
    getCollectsFailed,
} = createActions({
    GET_WIDGET_TYPES: pageId => ({ pageId }),
    GET_WIDGET_TYPES_SUCCEED: widgetTypes => ({ widgetTypes }),
    GET_WIDGET_TYPES_FAILED: error => ({ error }),
    GET_PRODUCTS: (pageId, integration_uid) => ({pageId, integration_uid}),
    GET_PRODUCTS_SUCCEED: products => ({ products }),
    GET_PRODUCTS_FAILED: error => ({ error }),
    UPDATE_ENGAGE_INFO: engage => ({ engage }),
    DELETE_ENGAGE_INFO: () => ({}),
    ADD_STEP_INFO: (
        stepUid,
        stepType = 'items',
        name = 'Step Title',
        top = 0,
        left = 0
    ) => ({
        stepUid,
        stepType,
        name,
        top,
        left
    }),
    UPDATE_STEP_INFO: (stepUid, step) => ({ stepUid, step }),
    UPDATE_SMS_PHONE_NUMBER: phone => ({ phone }),
    UPDATE_SMTP_INTEGRATION: smtpIntegration => ({ smtpIntegration }),
    DELETE_STEP_INFO: stepUid => ({ stepUid }),
    UPDATE_ITEM_INFO: (itemIndex, item) => ({ itemIndex, item }),
    DELETE_ITEM_INFO: itemIndex => ({ itemIndex }),
    UPDATE_CAROUSEL_ITEM_INFO: (itemIndex, carouselIndex, item) => ({
        itemIndex,
        carouselIndex,
        item
    }),
    DELETE_CAROUSEL_ITEM_INFO: (itemIndex, carouselIndex) => ({
        itemIndex,
        carouselIndex
    }),
    ADD_ACTION_BUTTON: itemIndex => ({ itemIndex }),
    UPDATE_ACTION_BUTTON: (itemIndex, actionBtnIndex, actionBtn) => ({
        itemIndex,
        actionBtnIndex,
        actionBtn
    }),
    DELETE_ACTION_BUTTON: (itemIndex, actionBtnIndex) => ({
        itemIndex,
        actionBtnIndex
    }),
    ADD_CAROUSEL_ACTION_BUTTON: (itemIndex, carouselIndex) => ({
        itemIndex,
        carouselIndex
    }),
    UPDATE_CAROUSEL_ACTION_BUTTON: (
        itemIndex,
        carouselIndex,
        actionBtnIndex,
        actionBtn
    ) => ({ itemIndex, carouselIndex, actionBtnIndex, actionBtn }),
    DELETE_CAROUSEL_ACTION_BUTTON: (
        itemIndex,
        carouselIndex,
        actionBtnIndex
    ) => ({ itemIndex, carouselIndex, actionBtnIndex }),
    SWAP_ITEM: (oldItemIndex, newItemIndex) => ({ oldItemIndex, newItemIndex }),
    DELETE_QUICK_REPLY: quickReplyIndex => ({ quickReplyIndex }),
    ADD_ENGAGE: (pageId, engage) => ({ pageId, engage }),
    ADD_ENGAGE_SUCCEED: uid => ({ uid }),
    ADD_ENGAGE_FAILED: error => ({ error }),
    UPDATE_ENGAGE: (pageId, engage) => ({ pageId, engage }),
    UPDATE_ENGAGE_SUCCEED: uid => ({ uid }),
    UPDATE_ENGAGE_FAILED: error => ({ error }),
    FILE_UPLOAD: (
        pageId,
        stepUid,
        itemIndex,
        src,
        carouselItemIndex = 0,
        url = null
    ) => ({
        pageId,
        stepUid,
        itemIndex,
        src,
        carouselItemIndex,
        url
    }),
    FILE_UPLOAD_SUCCEED: (
        stepUid,
        itemIndex,
        fileUid,
        url,
        carouselItemIndex
    ) => ({
        stepUid,
        itemIndex,
        fileUid,
        url,
        carouselItemIndex
    }),
    FILE_UPLOAD_FAILED: error => ({ error }),
    PAGE_FILE_UPLOAD: (
        pageId,
        fileType,
        src,
        url = null
    ) => ({
        pageId,
        fileType,
        src,
        url
    }),
    PAGE_FILE_UPLOAD_SUCCEED: (
        fileUid,
        url,
    ) => ({
        fileUid,
        url
    }),
    PAGE_FILE_UPLOAD_FAILED: error => ({ error }),
    FILE_UPLOAD_PROGRESS: percent => ({ percent }),

    SAVE_BROADCAST: pageId => ({ pageId }),
    GET_BROADCAST_SUBSCRIBERS: (pageId, broadcastId, conditions) => ({
        pageId,
        broadcastId,
        conditions
    }),
    GET_BROADCAST_SUBSCRIBERS_SUCCEED: subscribers => ({ subscribers }),
    GET_BROADCAST_SUBSCRIBERS_FAILED: error => ({ error }),
    SAVE_BROADCAST_SUCCEED: () => ({}),
    SAVE_BROADCAST_FAILED: error => ({ error }),
    UPDATE_BROADCAST: broadcast => ({ broadcast }),
    ADD_BROADCAST_CONDITION: () => ({}),
    UPDATE_BROADCAST_CONDITION: (conditionIndex, condition) => ({
        conditionIndex,
        condition
    }),
    DELETE_BROADCAST_CONDITION: conditionIndex => ({ conditionIndex }),
    GET_COLLECTS: (pageId, integration_uid) => ({pageId, integration_uid}),
    GET_COLLECTS_SUCCEED: collects => ({ collects }),
    GET_COLLECTS_FAILED: error => ({ error }),
});

export {
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
};
