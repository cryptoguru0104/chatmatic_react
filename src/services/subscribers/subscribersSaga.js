import { put, takeLatest, call, throttle } from 'redux-saga/effects';

import * as subscribersApi from './subscribersApi';
import {
  getPageSubscribersFailed,
  getPageSubscribersSucceed,
  getPageSubscribersBroadcastCountSucceed,
  getSubscribersHistorySucceed,
  getSubscribersHistoryFailed,
  updateActiveSubscriberSucceed,
  updateActiveSubscriberFailed,
  getSubscriberInfoSucceed,
  getSubscriberInfoFailed,
  updateSubscriberInfoSucceed,
  updateSubscriberInfoFailed,
  getExportSubscribersSucceed,
  getExportSubscribersFailed,
  updateCustomFieldResponseSucceed,
  updateCustomFieldResponseFailed,
} from './subscribersActions';
import { convertObjectKeyToCamelCase, errorMsg } from '../utils';

export function* subscribersSubscriber() {
  yield takeLatest('CLEAR_PAGE_SUBSCRIBERS', clearPageSubscribers);

  yield takeLatest('GET_PAGE_SUBSCRIBERS', getPageSubscribers);

  yield takeLatest(
    'GET_PAGE_SUBSCRIBERS_BROADCAST_COUNT',
    getPageSubscribersBroadcastCount
  );

  yield takeLatest('GET_SUBSCRIBERS_HISTORY', getSubscribersHistory);

  yield takeLatest('UPDATE_ACTIVE_SUBSCRIBER', updateActiveSubscriber);

  yield takeLatest('GET_SUBSCRIBER_INFO', getSubscriberInfo);

  yield throttle(500, 'UPDATE_SUBSCRIBER_INFO', updateSubscriberInfo);

  yield takeLatest('GET_EXPORT_SUBSCRIBERS', getExportSubscribers);

  yield takeLatest('UPDATE_CUSTOM_FIELD_RESPONSE', updateCustomFieldResponse);
}

export function* clearPageSubscribers() {}
export function* getPageSubscribersBroadcastCount({
  payload: { pageId, broadcast_type, filters }
}) {
  try {
    const response = yield call(
      subscribersApi.getPageSubscribersBroadcastCount,
      pageId,
      broadcast_type,
      filters
    );
    yield put(
      getPageSubscribersBroadcastCountSucceed(
        convertObjectKeyToCamelCase(response.data)
      )
    );
  } catch (error) {
    yield put(getPageSubscribersFailed(errorMsg(error)));
  }
}
export function* getPageSubscribers({
  payload: { pageId, extended, search_params, page, per_page }
}) {
  try {
    const response = yield call(
      subscribersApi.getPageSubscribers,
      pageId,
      extended,
      search_params,
      page,
      per_page
    );
    yield put(
      getPageSubscribersSucceed(convertObjectKeyToCamelCase(response.data))
    );
  } catch (error) {
    yield put(getPageSubscribersFailed(errorMsg(error)));
  }
}

export function* getSubscribersHistory({ payload: { pageId, recentDays } }) {
  try {
    const response = yield call(
      subscribersApi.getSubscribersHistory,
      pageId,
      recentDays
    );
    yield put(
      getSubscribersHistorySucceed(convertObjectKeyToCamelCase(response.data))
    );
  } catch (error) {
    yield put(getSubscribersHistoryFailed(errorMsg(error)));
  }
}

export function* updateActiveSubscriber({
  payload: { pageId, subscriberId, activeStatus }
}) {
  try {
    yield call(
      subscribersApi.updateActiveSubscriber,
      pageId,
      subscriberId,
      activeStatus
    );
    yield put(updateActiveSubscriberSucceed(subscriberId, activeStatus));
  } catch (error) {
    yield put(updateActiveSubscriberFailed(errorMsg(error)));
  }
}

export function* getSubscriberInfo({ payload: { pageId, subscriberId } }) {
  try {
    const response = yield call(
      subscribersApi.getSubscriberInfo,
      pageId,
      subscriberId
    );
    yield put(
      getSubscriberInfoSucceed(
        subscriberId,
        convertObjectKeyToCamelCase(response.data)
      )
    );
  } catch (error) {
    yield put(getSubscriberInfoFailed(errorMsg(error)));
  }
}

export function* updateSubscriberInfo({
  payload: { pageId, subscriberId, data }
}) {
  try {
    yield call(subscribersApi.updateSubscriberInfo, pageId, subscriberId, data);
    yield put(updateSubscriberInfoSucceed(subscriberId, data));
  } catch (error) {
    yield put(updateSubscriberInfoFailed(errorMsg(error)));
  }
}

export function* getExportSubscribers({ payload: { pageId } }) {
  try {
    const response = yield call(subscribersApi.getExportSubscribers, pageId);

    yield put(
      getExportSubscribersSucceed(
        convertObjectKeyToCamelCase(response.data.subscribers)
      )
    );
  } catch (error) {
    yield put(getExportSubscribersFailed(errorMsg(error)));
  }
}

export function* updateCustomFieldResponse({ payload: { pageId, subscriberId, customFieldId, response}}) {
  try {
    const r = yield call(subscribersApi.updateSubscriberCustomFieldResponse, pageId, subscriberId, customFieldId, response);

    yield put(
      updateCustomFieldResponseSucceed(pageId, subscriberId, customFieldId, response)
    );
  } catch (error) {
    yield put(updateCustomFieldResponseFailed(errorMsg(error)));
  }
}