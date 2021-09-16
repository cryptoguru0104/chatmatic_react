import { put, takeLatest, call, select } from 'redux-saga/effects';

import * as apis from './api';
import {
  getPersistentMenusSucceed,
  getPersistentMenusFailed,
  deletePersistentMenuSucceed,
  deletePersistentMenuFailed,
  savePersistentMenuSucceed,
  savePersistentMenuFailed
} from './actions';
import { convertObjectKeyToCamelCase, errorMsg } from 'services/utils';

export function* persistentMenuSubscriber() {
  yield takeLatest('GET_PERSISTENT_MENUS', getPageMenus);

  yield takeLatest('DELETE_PERSISTENT_MENU', deletePageMenu);

  yield takeLatest('SAVE_PERSISTENT_MENU', savePageMenu);
}

export function* getPageMenus({ payload: { pageId } }) {
  try {
    const response = yield call(apis.getPageMenus, pageId);

    yield put(
      getPersistentMenusSucceed(convertObjectKeyToCamelCase(response.data))
    );
  } catch (error) {
    yield put(getPersistentMenusFailed(errorMsg(error)));
  }
}

export function* deletePageMenu({ payload: { pageId, menuId } }) {
  try {
    if (menuId && menuId > 0) {
      yield call(apis.deletePageMenu, pageId, menuId);
    }

    yield put(deletePersistentMenuSucceed(menuId));
  } catch (error) {
    yield put(deletePersistentMenuFailed(errorMsg(error)));
  }
}

export function* savePageMenu({ payload: { pageId } }) {
  try {
    const persistentMenusState = (yield select()).default.settings
      .persistentMenus;

    if (!persistentMenusState.activeMenuId) {
      const response = yield call(
        apis.addPageMenu,
        pageId,
        persistentMenusState.currentMenu
      );

      yield put(
        savePersistentMenuSucceed({
          uid: response.data.uid
        })
      );
    } else {
      const activePersistentMenu =
        persistentMenusState.persistentMenus.menus.find(menu => {
          return menu.uid === persistentMenusState.activeMenuId;
        }) || {};

      yield call(apis.updatePageMenu, pageId, activePersistentMenu);

      yield put(savePersistentMenuSucceed({}));
    }
  } catch (error) {
    yield put(savePersistentMenuFailed(errorMsg(error)));
  }
}
