import {
  put,
  takeLatest,
  call,
  select
} from 'redux-saga/effects';

import {
  getAuthInfoSucceed,
  getAuthInfoFailed,
  getUserCardsSucceed,
  getUserCardsFailed,
} from './authActions';
import * as apis from './authApi';
import {
  convertObjectKeyToCamelCase,
  errorMsg
} from '../utils';

export function* authSubscriber() {
  yield takeLatest('GET_AUTH_INFO', getAuthInfo);
  yield takeLatest('GET_USER_CARDS', getUserCards);
}

export function* getAuthInfo({ payload: { redirectUrl } }) {
  try {
    const authState = (yield select()).default.auth;
    const response = yield call(
      apis.getAuthInfo,
      authState.userId,
      authState.longToken,
      authState.sumoUserId
    );

    yield put(getAuthInfoSucceed(convertObjectKeyToCamelCase(response.data), redirectUrl));
  } catch (error) {
    yield put(getAuthInfoFailed(errorMsg(error)));
  }
}

export function* getUserCards() {
  try {
    const response = yield call(
      apis.getUserCards
    );

    yield put(getUserCardsSucceed(convertObjectKeyToCamelCase(response.data.stripe_sources)));
  } catch (error) {
    yield put(getUserCardsFailed(errorMsg(error)));
  }
}
