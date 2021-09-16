import { put, takeLatest, call, all } from 'redux-saga/effects';

import * as apis from './api';
import {
  getAutomationsSucceed,
  getAutomationsFailed,
  updateAutomationSucceed,
  updateAutomationFailed,
  addAutomationSucceed,
  addAutomationFailed,
  deleteAutomationSucceed,
  deleteAutomationFailed
} from './actions';
import { errorMsg } from 'services/utils';

export function* automationsSubscriber() {
  yield all([takeLatest('GET_AUTOMATIONS', getPageAutomations)]);

  yield all([takeLatest('UPDATE_AUTOMATION', updatePageAutomation)]);

  yield all([takeLatest('ADD_AUTOMATION', addPageAutomation)]);

  yield all([takeLatest('DELETE_AUTOMATION', deletePageAutomation)]);
}

export function* getPageAutomations({ payload: { pageId } }) {
  try {
    const response = yield call(apis.getAutomations, pageId);

    yield put(getAutomationsSucceed(response.data.automations));
  } catch (error) {
    yield put(getAutomationsFailed(errorMsg(error)));
  }
}

export function* updatePageAutomation({
  payload: { pageId, automationUid, data }
}) {
  try {
    yield call(apis.updateAutomation, pageId, automationUid, data);

    yield put(updateAutomationSucceed(automationUid, data));
  } catch (error) {
    yield put(updateAutomationFailed(errorMsg(error)));
  }
}

export function* addPageAutomation({ payload: { pageId, data } }) {
  try {
    const response = yield call(apis.addAutomation, pageId, data);

    yield put(addAutomationSucceed(response.data.uid, data));
  } catch (error) {
    yield put(addAutomationFailed(errorMsg(error)));
  }
}

export function* deletePageAutomation({ payload: { pageId, automationUid } }) {
  try {
    yield call(apis.deleteAutomation, pageId, automationUid);

    yield put(deleteAutomationSucceed(automationUid));
  } catch (error) {
    yield put(deleteAutomationFailed(errorMsg(error)));
  }
}
