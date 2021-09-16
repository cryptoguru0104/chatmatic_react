import { put, takeLatest, call } from "redux-saga/effects";

import * as broadcastsApi from "./broadcastsApi";
import {
    getPageBroadcastsSucceed,
    getPageBroadcastsFailed,
    deleteBroadcastSucceed,
    deleteBroadcastFailed,
    addBroadcast,
    addBroadcastSucceed,
    addBroadcastFailed,
    getEligibleSubscribersSucceed,
    getEligibleSubscribersFailed,
    // getBroadcastInfoSucceed,
    // getBroadcastInfoFailed
} from "./broadcastsActions";
import { convertObjectKeyToCamelCase, errorMsg } from "../utils";

export function* broadcastsSubscriber() {
    yield takeLatest("GET_PAGE_BROADCASTS", getPageBroadcasts);

    yield takeLatest("DELETE_BROADCAST", deletePageCampign);
    yield takeLatest("ADD_BROADCAST", addPageBroadcast);

    yield takeLatest("GET_ELIGIBLE_SUBSCRIBERS", getEligibleSubscribers);

    // yield takeLatest('GET_BROADCAST_INFO', getBroadcastInfo);
}

export function* addPageBroadcast({ payload: { pageId, broadcast } }) {
    try {
        const response = yield call(
            broadcastsApi.addBroadcast,
            pageId,
            broadcast
        );

        yield put(
            addBroadcastSucceed(convertObjectKeyToCamelCase(response.data))
        );
    } catch (error) {
        yield put(addBroadcastFailed(errorMsg(error)));
    }
}

export function* getPageBroadcasts({ payload: { pageId } }) {
    try {
        const response = yield call(broadcastsApi.getPageBroadcasts, pageId);
        // console.log('response', response);

        yield put(
            getPageBroadcastsSucceed(
                convertObjectKeyToCamelCase(response.data.broadcasts)
            )
        );
    } catch (error) {
        yield put(getPageBroadcastsFailed(errorMsg(error)));
    }
}

export function* deletePageCampign({ payload: { pageId, broadcastId } }) {
    try {
        yield call(broadcastsApi.deleteBroadcast, pageId, broadcastId);

        yield put(deleteBroadcastSucceed(broadcastId));
    } catch (error) {
        yield put(deleteBroadcastFailed(errorMsg(error)));
    }
}

export function* getEligibleSubscribers({ payload: { pageId, broadcastType, conditions }}) {
    try {
        const response = yield call(broadcastsApi.getEligibleSubscribers, pageId, broadcastType, conditions);

        yield put(getEligibleSubscribersSucceed(response.data.count));
    } catch (error) {
        yield put(getEligibleSubscribersFailed(errorMsg(error)));
    }
}
// export function* getBroadcastInfo({ payload: { publicId } }) {
//     try {
//         const response = yield call(broadcastsApi.getBroadcastInfo, publicId);

//         yield put(
//             getBroadcastInfoSucceed(
//                 convertObjectKeyToCamelCase(response.data.broadcast)
//             )
//         );
//     } catch (error) {
//         yield put(getBroadcastInfoFailed(errorMsg(error)));
//     }
// }
