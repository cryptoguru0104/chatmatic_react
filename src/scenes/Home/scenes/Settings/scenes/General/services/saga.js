import { put, takeLatest, call } from 'redux-saga/effects';

import * as apis from './api';
import {
  getAdmins,
  getAdminsSucceed,
  getAdminsFailed,
  deleteAdminSucceed,
  deleteAdminFailed,
  addAdminSucceed,
  addAdminFailed
} from './actions';
import { convertObjectKeyToCamelCase, errorMsg } from 'services/utils';

export function* adminsSubscriber() {
  yield takeLatest('GET_ADMINS', getPageAdmins);

  yield takeLatest('DELETE_ADMIN', deletePageAdmin);

  yield takeLatest('ADD_ADMIN', addPageAdmin);
}

export function* getPageAdmins({ payload: { pageId } }) {
  try {
    const response = yield call(apis.getAdmins, pageId);

    yield put(
      getAdminsSucceed(convertObjectKeyToCamelCase(response.data.admins))
    );
  } catch (error) {
    yield put(getAdminsFailed(errorMsg(error)));
  }
}

export function* deletePageAdmin({ payload: { pageId, adminId } }) {
  try {
    yield call(apis.deleteAdmin, pageId, adminId);

    yield put(deleteAdminSucceed(adminId));
  } catch (error) {
    yield put(deleteAdminFailed(errorMsg(error)));
  }
}

export function* addPageAdmin({ payload: { pageId, email } }) {
  try {
    yield call(apis.addAdmin, pageId, email);

    yield put(getAdmins(pageId));
    yield put(addAdminSucceed(email));
  } catch (error) {
    yield put(addAdminFailed(errorMsg(error)));
  }
}
