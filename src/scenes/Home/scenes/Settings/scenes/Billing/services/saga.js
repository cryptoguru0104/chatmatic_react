import { put, takeLatest, call } from "redux-saga/effects";

import * as apis from "./api";
import {

    getBillingInfoSucceed,
    getBillingInfoFailed,
    updateBillingInfoSucceed,
    updateBillingInfoFailed,
    updatePrimaryCardSucceed,
    updatePrimaryCardFailed,
    postAppSumoLicenseSucceed,
    postAppSumoLicenseFailed,
    postCouponSucceed,
    postCouponFailed,
    cancelSubscriptionSucceed,
    cancelSubscriptionFailed,
    updatePaymentInfoSucceed,
    updatePaymentInfoFailed,
    postSmsPlanSucceed,
    postSmsPlanFailed,
    getSmsPlanSucceed,
    getSmsPlanFailed,
    subscribeStripeSucceed,
    subscribeStripeFailed,
    cancelPlanFailed
} from "./actions";
import { convertObjectKeyToCamelCase, errorMsg } from "services/utils";

export function* billingSubscriber() {
    yield takeLatest("POST_APP_SUMO_LICENSE", postPageAppSumoLicense);
    yield takeLatest("GET_BILLING_INFO", getPageBillingInfo);
    yield takeLatest("UPDATE_BILLING_INFO", updatePageBillingInfo);
    yield takeLatest("POST_LICENSE", postLicense);
    yield takeLatest("POST_COUPON", postCoupon);
    yield takeLatest("CANCEL_SUBSCRIPTION", cancelSubscription);
    yield takeLatest("UPDATE_PAYMENT_INFO", updatePaymentInfo);
    yield takeLatest("POST_SMS_PLAN", postSmsPlan);
    yield takeLatest("GET_SMS_PLAN", getSmsPlan);
    yield takeLatest("ADD_BILLING_CARD", addBillingCard);
    yield takeLatest("DELETE_BILLING_CARD", deleteBillingCard);
    yield takeLatest("SUBSCRIBE_STRIPE", subscribeStripe);
    yield takeLatest("CANCEL_PLAN", cancelPlan);
    yield takeLatest("UPDATE_PRIMARY_CARD", updatePrimaryCard);
}
export function* addBillingCard({ payload: { pageId, cardToken, cardTokenToRemove }}) {
    try {
        yield call(apis.addBillingCard, pageId, cardToken, cardTokenToRemove);
        

        const response = yield call(apis.getBillingInfo, pageId);

        yield put(
            getBillingInfoSucceed(
                convertObjectKeyToCamelCase(response.data).billingInfo
            )
        );
    } catch (error) {
        yield put(getBillingInfoFailed(errorMsg(error)));
    }
}
export function* deleteBillingCard({ payload: { pageId, cardTokenToRemove }}) {
    try {
        yield call(apis.deleteBillingCard, pageId, cardTokenToRemove);

        const response = yield call(apis.getBillingInfo, pageId);

        yield put(
            getBillingInfoSucceed(
                convertObjectKeyToCamelCase(response.data).billingInfo
            )
        );
    } catch (error) {
        yield put(getBillingInfoFailed(errorMsg(error)));
    }
}
export function* postPageAppSumoLicense({ payload: { pageId } }) {
    try {
        const response = yield call(apis.postAppSumoLicense, pageId);
        yield put(postAppSumoLicenseSucceed(pageId));
        try {
            const billingResponse = yield call(apis.getBillingInfo, pageId);
            yield put(
                getBillingInfoSucceed(
                    convertObjectKeyToCamelCase(billingResponse.data)
                        .billingInfo
                )
            );
        } catch (billingError) {
            yield put(getBillingInfoFailed(errorMsg(billingError)));
        }
    } catch (error) {
        yield put(postAppSumoLicenseFailed(errorMsg(error)));
    }
}
export function* getPageBillingInfo({ payload: { pageId } }) {
    try {
        const response = yield call(apis.getBillingInfo, pageId);

        yield put(
            getBillingInfoSucceed(
                convertObjectKeyToCamelCase(response.data).billingInfo
            )
        );
    } catch (error) {
        yield put(getBillingInfoFailed(errorMsg(error)));
    }
}

export function* updatePageBillingInfo({ payload: {pageId, newBillingInfo}}) {
    try {
        const response = yield call(apis.updateBillingInfo, pageId, newBillingInfo);

        yield put(
            updateBillingInfoSucceed(
                convertObjectKeyToCamelCase(newBillingInfo)
            )
        );
    } catch (error) {
        yield put(updateBillingInfoFailed(errorMsg(error)));
    }
}

export function* updatePrimaryCard({ payload: {pageId, pageCardUid}}) {
    try {
        const response = yield call(apis.updatePrimaryCard, pageId, pageCardUid);

        yield put(
            updatePrimaryCardSucceed(
                pageCardUid
            )
        );
    } catch (error) {
        yield put(updatePrimaryCardFailed(errorMsg(error)));
    }
}

export function* postLicense({ payload: { pageId, data } }) {
    try {
        const response = yield call(apis.postLicense, pageId, data);

        yield put(
            getBillingInfoSucceed(
                convertObjectKeyToCamelCase(response.data).billingInfo
            )
        );
    } catch (error) {
        yield put(getBillingInfoFailed(errorMsg(error)));
    }
}

export function* postCoupon({ payload: { pageId, plan, cardId, coupon } }) {
    try {
        const response = yield call(apis.postCoupon, pageId, plan, cardId, coupon);

        yield put(postCouponSucceed(convertObjectKeyToCamelCase(response.data).coupon));
    } catch (error) {
        yield put(postCouponFailed(errorMsg(error)));
    }
}

export function* cancelSubscription({ payload: { pageId } }) {
    try {
        yield call(apis.cancelSubscription, pageId);

        yield put(cancelSubscriptionSucceed());
    } catch (error) {
        yield put(cancelSubscriptionFailed(errorMsg(error)));
    }
}

export function* updatePaymentInfo({ payload: { pageId, source } }) {
    try {
        const response = yield call(apis.updatePaymentInfo, pageId, source);

        yield put(
            updatePaymentInfoSucceed(
                convertObjectKeyToCamelCase(response.data).billingInfo
            )
        );
    } catch (error) {
        yield put(updatePaymentInfoFailed(errorMsg(error)));
    }
}

export function* postSmsPlan({ payload: { pageId, data } }) {
    try {
        const response = yield call(apis.postSmsPlan, pageId, data);

        const { phoneNumber } = convertObjectKeyToCamelCase(response.data);

        yield put(
            postSmsPlanSucceed({
                phoneNumber
            })
        );
    } catch (error) {
        yield put(postSmsPlanFailed(errorMsg(error)));
    }
}

export function* getSmsPlan({ payload: { pageId } }) {
    try {
        const response = yield call(apis.getSmsPlan, pageId);
        const {
            phoneNumber,
            smsHistory,
            autorenew,
            smsResume
        } = convertObjectKeyToCamelCase(response.data);
        yield put(
            getSmsPlanSucceed({
                phoneNumber,
                smsHistory,
                autorenew,
                smsResume
            })
        );
    } catch (error) {
        yield put(getSmsPlanFailed(errorMsg(error)));
    }
}

export function* subscribeStripe({ payload: {pageId, plan, cardId, coupon, update}}) {
    try {
        console.log('update', update);
        yield call(apis.subscribeStripe, pageId, plan, cardId, coupon, update);

        const response = yield call(apis.getBillingInfo, pageId);

        yield put(
            getBillingInfoSucceed(
                convertObjectKeyToCamelCase(response.data).billingInfo
            )
        );
    } catch (error) {
        yield put(subscribeStripeFailed(errorMsg(error)));
    }
}


export function* cancelPlan({ payload: {pageId}}) {
    try {
        yield call(apis.cancelPlan, pageId);

        const response = yield call(apis.getBillingInfo, pageId);

        yield put(
            getBillingInfoSucceed(
                convertObjectKeyToCamelCase(response.data).billingInfo
            )
        );
    } catch (error) {
        yield put(cancelPlanFailed(errorMsg(error)));
    }
}