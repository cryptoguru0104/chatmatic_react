import {
  put,
  takeLatest,
  call,
  select
} from 'redux-saga/effects';

import {
  getUserProfileSucceed,
  getUserProfileFailed,
  getUserFollowInfoSucceed,
  getUserFollowInfoFailed,
  getUserFollowInfo as getUserFollowInfoAction,
  followUserFailed,
  getUserTemplateInfoSucceed,
  getUserTemplateInfoFailed,
  getUserSalesInfoSucceed,
  getUserSalesInfoFailed
} from './actions';

import * as apis from './api';
import {
  convertObjectKeyToCamelCase,
  errorMsg
} from 'services/utils';

export function* userSubscriber() {
  yield takeLatest('GET_USER_PROFILE', getAuthInfo);
  yield takeLatest('SAVE_USER_INFO', saveUserInfo);
  yield takeLatest('GET_USER_FOLLOW_INFO', getUserFollowInfo);
  yield takeLatest('FOLLOW_USER', followUser);
  yield takeLatest('GET_USER_TEMPLATE_INFO', getUserTemplateInfo);
  yield takeLatest('GET_USER_SALES_INFO', getUserSalesInfo);
}

export function* getAuthInfo({ payload: { userId } }) {
  try {
    const authState = (yield select()).default.auth;
    const response = yield call(
      apis.getUserProfile,
      userId
    );
    yield put(getUserProfileSucceed(convertObjectKeyToCamelCase(response.data.user)));
  } catch (error) {
    yield put(getUserProfileFailed(errorMsg(error)));
  }
}

export function* saveUserInfo({ payload: { userId, userInfo } }) {
  try {
    const response = yield call(
      apis.saveUserInfo,
      userId,
      userInfo
    );
    yield put(getUserProfileSucceed(convertObjectKeyToCamelCase(response.data.user)));
  } catch (error) {
    yield put(getUserProfileFailed(errorMsg(error)));
  }
}

export function* getUserFollowInfo({ payload: { userId } }) {
  try {
    const response = yield call(
      apis.getUserFollowInfo,
      userId
    );
    yield put(getUserFollowInfoSucceed(convertObjectKeyToCamelCase(response.data).userFollowInfo));
  } catch (error) {
    yield put(getUserFollowInfoFailed(error));
  }
}

export function* followUser({ payload: { userId } }) {
  try {
    yield call(apis.followUser, userId);
    yield put(getUserFollowInfoAction(userId));
  } catch (error) {
    yield put(followUserFailed(error));
  } 
}

export function* getUserTemplateInfo({ payload: { userId } }) {
  try {
    const response = yield call(
      apis.getUserTemplateInfo,
      userId
    );
    yield put(getUserTemplateInfoSucceed(convertObjectKeyToCamelCase(response.data.data)));
  } catch (error) {
    yield put(getUserTemplateInfoFailed(error));
  }
}

export function* getUserSalesInfo({ payload: { userId } }) {
  try {
    const response = yield call(
      apis.getUserSalesInfo,
      userId
    );
    yield put(getUserSalesInfoSucceed(convertObjectKeyToCamelCase(response.data.data)));
  } catch (error) {
    yield put(getUserSalesInfoFailed(error));
  }
}