import { put, call, takeLatest } from 'redux-saga/effects';

import {
  getCustomFieldsSucceed,
  getCustomFieldsFailed,
  getCustomFieldSubscribersSucceed,
  getCustomFieldSubscribersFailed,
  addCustomFieldSucceed,
  addCustomFieldFailed,
  deleteCustomFieldSucceed,
  deleteCustomFieldFailed,
  updateCustomFieldSucceed,
  updateCustomFieldFailed
} from './actions';
import * as settingsApi from './api';
import { convertObjectKeyToCamelCase, errorMsg } from '../utils';

export function* customFieldsSubscriber() {
  yield takeLatest('GET_CUSTOM_FIELDS', getCustomFields);

  yield takeLatest('GET_CUSTOM_FIELD_SUBSCRIBERS', getCustomFieldSubscribers);

  yield takeLatest('ADD_CUSTOM_FIELD', addCustomField);

  yield takeLatest('DELETE_CUSTOM_FIELD', deleteCustomField);

  yield takeLatest('UPDATE_CUSTOM_FIELD', updateCustomField);
}

export function* getCustomFields({ payload: { pageId } }) {
  try {
    const response = yield call(settingsApi.getCustomFields, pageId);
    yield put(
      getCustomFieldsSucceed(
        convertObjectKeyToCamelCase(response.data.custom_fields)
      )
    );
  } catch (error) {
    yield put(getCustomFieldsFailed(errorMsg(error)));
  }
}

export function* getCustomFieldSubscribers({ payload: { pageId, uId } }) {
  try {
    const response = yield call(settingsApi.getCustomFieldSubscribers, pageId, uId);
    yield put(
      getCustomFieldSubscribersSucceed(
        convertObjectKeyToCamelCase(response.data.subscribers || [])
      )
    );
  } catch (error) {
    yield put(getCustomFieldSubscribersFailed(errorMsg(error)));
  }
}

export function* addCustomField({ payload: { pageId, value } }) {
  try {
    const response = yield call(settingsApi.addCustomField, pageId, value);
    yield put(
      addCustomFieldSucceed(
        convertObjectKeyToCamelCase(response.data.custom_field)
      )
    );
  } catch (error) {
    yield put(addCustomFieldFailed(errorMsg(error)));
  }
}

export function* deleteCustomField({ payload: { pageId, uId } }) {
  try {
    yield call(settingsApi.deleteCustomField, pageId, uId);

    yield put(deleteCustomFieldSucceed(uId));
  } catch (error) {
    yield put(deleteCustomFieldFailed(errorMsg(error)));
  }
}

export function* updateCustomField({ payload: { pageId, uId, data } }) {
  try {
    const response = yield call(
      settingsApi.updateCustomField,
      pageId,
      uId,
      data
    );

    yield put(
      updateCustomFieldSucceed(
        uId,
        convertObjectKeyToCamelCase(response.data.custom_field)
      )
    );
  } catch (error) {
    yield put(updateCustomFieldFailed(errorMsg(error)));
  }
}
