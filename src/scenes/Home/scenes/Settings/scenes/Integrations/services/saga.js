import { put, takeLatest, call } from 'redux-saga/effects';

import * as apis from './api';
import {
  getIntegrationTypesSucceed,
  getIntegrationTypesFailed,
  getIntegrationsSucceed,
  getIntegrationsFailed,
  addIntegrationSucceed,
  addIntegrationFailed,
  updateIntegrationSucceed,
  updateIntegrationFailed,
  deleteIntegrationSucceed,
  deleteIntegrationFailed
} from './actions';
import { convertObjectKeyToCamelCase, errorMsg } from 'services/utils';

export function* integrationsSubscriber() {
  yield takeLatest('GET_INTEGRATION_TYPES', getIntegrationTypes);
  yield takeLatest('GET_INTEGRATIONS', getPageIntegrations);
  yield takeLatest('ADD_INTEGRATION', addPageIntegration);
  yield takeLatest('UPDATE_INTEGRATION', updatePageIntegration);
  yield takeLatest('DELETE_INTEGRATION', deletePageIntegration);
}

export function* getIntegrationTypes({ payload: { pageId } }) {
  try {
    const response = yield call(apis.getIntegrationTypes, pageId);

    yield put(
      getIntegrationTypesSucceed(
        convertObjectKeyToCamelCase(response.data.types)
      )
    );
  } catch (error) {
    yield put(getIntegrationTypesFailed(errorMsg(error)));
  }
}

export function* getPageIntegrations({ payload: { pageId } }) {
  try {
    const response = yield call(apis.getIntegrations, pageId);

    yield put(
      getIntegrationsSucceed(
        convertObjectKeyToCamelCase(response.data.integrations)
      )
    );
  } catch (error) {
    yield put(getIntegrationsFailed(errorMsg(error)));
  }
}

export function* addPageIntegration({ payload: { pageId, params } }) {
  try {
    const response = yield call(apis.addIntegration, pageId, params);

    yield put(
      addIntegrationSucceed(
        convertObjectKeyToCamelCase(response.data.integration)
      )
    );
  } catch (error) {
    yield put(addIntegrationFailed(errorMsg(error)));
  }
}

export function* updatePageIntegration({
  payload: { pageId, integrationId, params }
}) {
  try {
    const response = yield call(
      apis.updateIntegration,
      pageId,
      integrationId,
      params
    );

    yield put(
      updateIntegrationSucceed(
        convertObjectKeyToCamelCase(response.data.integration)
      )
    );
  } catch (error) {
    yield put(updateIntegrationFailed(errorMsg(error)));
  }
}

export function* deletePageIntegration({ payload: { pageId, integrationId } }) {
  try {
    yield call(apis.deleteIntegration, pageId, integrationId);

    yield put(deleteIntegrationSucceed(integrationId));
  } catch (error) {
    yield put(deleteIntegrationFailed(errorMsg(error)));
  }
}
