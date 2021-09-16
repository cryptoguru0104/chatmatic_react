import { put, call, takeLatest } from 'redux-saga/effects';
import * as apis from './api';
import {
    getDomains,
    getDomainsSucceed,
    getDomainsFailed,
    updateDomains,
    updateDomainsSucceed,
    updateDomainsFailed
} from './actions';
import { convertObjectKeyToCamelCase, errorMsg } from 'services/utils';

export function* domainSubscriber() {
    yield takeLatest('GET_DOMAINS', getPageDomains);

    yield takeLatest('UPDATE_DOMAINS', updatePageDomains);
}

export function* getPageDomains({ payload: { pageId } }) {
    try {
        const response = yield call(apis.getDomains, pageId);
        yield put(
            getDomainsSucceed(convertObjectKeyToCamelCase(response.data.urls))
        );
    } catch (error) {
        yield put(getDomainsFailed(errorMsg(error)));
    }
}

export function* updatePageDomains({ payload: { pageId, urls } }) {
    try {
        yield call(apis.updateDomains, pageId, urls);
        yield put(updateDomainsSucceed(urls));
    } catch (error) {
        yield put(updateDomainsFailed(errorMsg(error)));
    }
}
