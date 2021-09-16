import { handleActions } from "redux-actions";

import {
    getBillingInfo,
    getBillingInfoSucceed,
    getBillingInfoFailed,
    updateBillingInfo,
    updateBillingInfoSucceed,
    updateBillingInfoFailed,
    updatePrimaryCard,
    updatePrimaryCardSucceed,
    updatePrimaryCardFailed,
    postAppSumoLicense,
    postAppSumoLicenseSucceed,
    postAppSumoLicenseFailed,
    postLicense,
    postCoupon,
    postCouponSucceed,
    postCouponFailed,
    cancelSubscription,
    cancelSubscriptionSucceed,
    cancelSubscriptionFailed,
    updatePaymentInfo,
    updatePaymentInfoSucceed,
    updatePaymentInfoFailed,
    postSmsPlan,
    postSmsPlanSucceed,
    postSmsPlanFailed,
    getSmsPlan,
    getSmsPlanSucceed,
    getSmsPlanFailed,
    addBillingCard,
    deleteBillingCard,
    clearCouponInput,
    subscribeStripe,
    subscribeStripeSucceed,
    subscribeStripeFailed,
    cancelPlan,
    cancelPlanFailed
} from "./actions";

const defaultState = {
    appSumoLoading: false,
    appSumoError: null,
    billingInfo: null,
    newBillingInfo: null,
    loading: false,
    error: null,
    price: null,
    loadingCoupon: false,
    errorCoupon: null,
    smsPlan: null,
    cardToken: null,
    cardTokenToRemove: null,
    coupon: null,
    cardId: null,
    plan: null
};

const reducer = handleActions(
    {
        [getBillingInfo](state) {
            return {
                ...state,
                loading: true,
                error: null
            };
        },
        [updateBillingInfo](state, { payload: { newBillingInfo } }) {
            return {
                ...state,
                newBillingInfo,
                loading: true,
                error: null,
            };
        },
        [updateBillingInfoSucceed](state, { payload: { newBillingInfo } }) {
            return {
                ...state,
                newBillingInfo: null,
                billingInfo: { ...state.billingInfo, ...newBillingInfo },
                loading: false,
                error: null
            };
        },
        [updateBillingInfoFailed](state, { payload: { error } }) {
            return {
                ...state,
                newBillingInfo: null,
                loading: false,
                error
            };
        },
        [updatePrimaryCard](state, { payload: {pageCardUid}}) {
            return {
                ...state,
                pageCardUid,
                loading: true,
                error: null
            }
        },
        [updatePrimaryCardSucceed](state, { payload: {pageCardUid}}) {
            return {
                ...state,
                billingInfo: { ...state.billingInfo, cards: state.billingInfo.cards.map(c => ({ ...c, status: c.uid == pageCardUid ? 'active' : 'inactive'})) },
                loading: false,
                error: null
            }
        },
        [updatePrimaryCardFailed](state, { payload: {error}}) {
            return {
                ...state,
                loading: false,
                error: error
            }
        },
        [postAppSumoLicense](state) {
            return {
                ...state,
                appSumoLoading: true,
                error: null
            };
        },
        [postLicense](state) {
            return {
                ...state,
                loading: true,
                error: null
            };
        },
        [postAppSumoLicenseSucceed](state) {
            return {
                ...state,
                appSumoLoading: false,
                error: null
            };
        },
        [getBillingInfoSucceed](state, { payload: { billingInfo } }) {
            return {
                ...state,
                billingInfo,
                loading: false,
                error: null
            };
        },
        [postAppSumoLicenseFailed](state, { payload: { error } }) {
            return {
                ...state,
                appSumoLoading: false,
                appSumoError: error
            };
        },
        [getBillingInfoFailed](state, { payload: { error } }) {
            return {
                ...state,
                loading: false,
                error
            };
        },
        [postCoupon](state, {payload: {pageId, plan, cardId, coupon}}) {
            return {
                ...state,
                pageId,
                plan,
                cardId,
                coupon:null,
                loadingCoupon: true,
                errorCoupon: null
            };
        },
        [postCouponSucceed](state, { payload: { coupon } }) {
            return {
                ...state,
                loadingCoupon: false,
                coupon,
                errorCoupon: null
            };
        },
        [postCouponFailed](state, { payload: { error } }) {
            console.log(error);
            return {
                ...state,
                loadingCoupon: false,
                coupon: null,
                errorCoupon: error
            };
        },
        [cancelSubscription](state) {
            return {
                ...state,
                loading: true,
                error: null
            };
        },
        [cancelSubscriptionSucceed](state) {
            return {
                ...state,
                billingInfo: {},
                loading: false,
                error: null
            };
        },
        [cancelSubscriptionFailed](state, { payload: { error } }) {
            return {
                ...state,
                loading: false,
                error
            };
        },
        [updatePaymentInfo](state) {
            return {
                ...state,
                loading: true,
                error: null
            };
        },
        [updatePaymentInfoSucceed](state, { payload: { billingInfo } }) {
            return {
                ...state,
                billingInfo,
                loading: false,
                error: null
            };
        },
        [updatePaymentInfoFailed](state, { payload: { error } }) {
            return {
                ...state,
                loading: false,
                error
            };
        },
        [postSmsPlan](state) {
            return {
                ...state,
                loading: true,
                error: null
            };
        },
        [postSmsPlanSucceed](state, { payload: { billingInfo } }) {
            return {
                ...state,
                // billingInfo,
                loading: false,
                error: null
            };
        },
        [postSmsPlanFailed](state, { payload: { error } }) {
            return {
                ...state,
                loading: false,
                error
            };
        },
        [getSmsPlan](state) {
            return {
                ...state,
                loading: true,
                error: null
            };
        },
        [getSmsPlanSucceed](state, { payload: { smsPlan } }) {
            return {
                ...state,
                smsPlan,
                loading: false,
                error: null
            };
        },
        [getSmsPlanFailed](state, { payload: { error } }) {
            return {
                ...state,
                loading: false,
                error
            };
        },
        [addBillingCard](state, { payload: {pageId, cardToken, cardTokenToRemove}}) {
            return {
                ...state,
                loading: true,
                error: null,
                pageId,
                cardToken,
                cardTokenToRemove
            }
        },
        [deleteBillingCard](state, { payload: {pageId, cardTokenToRemove}}) {
            return {
                ...state,
                loading: true,
                error: null,
                pageId,
                cardTokenToRemove
            }
        },
        [clearCouponInput](state) {
            return {
                ...state,
                error: null,
                errorCoupon: null,
                coupon: null
            }
        },
        [subscribeStripe](state, { payload: {pageId, plan, cardId, coupon, update}}) {
            return {
                ...state,
                error: null,
                loading: true,
                pageId,
                plan,
                cardId,
                coupon
            }
        },
        [subscribeStripeSucceed](state, { payload: {subscription}}) {
            return {
                ...state,
                subscription
            }
        },
        [subscribeStripeFailed](state, { payload: {error}}) {
            return {
                ...state,
                loading: false,
                error
            }
        },
        [cancelPlan](state, { payload: {pageId}}) {
            return {
                ...state,
                loading: true
            }
        }
    },
    defaultState
);

export default reducer;
