import { put, call, takeLatest } from 'redux-saga/effects';

import {
    getTagsSucceed,
    getTagsFailed,
    getTagSubscribersSucceed,
    getTagSubscribersFailed,
    addTagSucceed,
    addTagFailed,
    deleteTagSucceed,
    deleteTagFailed
} from './actions';
import * as settingsApi from './api';
import { convertObjectKeyToCamelCase, errorMsg } from '../utils';

export function* tagsSubscriber() {
    yield takeLatest('GET_TAGS', getPageTags);
    
    yield takeLatest('GET_TAG_SUBSCRIBERS', getTagSubscribers);

    yield takeLatest('ADD_TAG', addPageTag);

    yield takeLatest('DELETE_TAG', deletePageTag);
}

export function* getPageTags({ payload: { pageId } }) {
    try {
        const response = yield call(settingsApi.getTags, pageId);
        yield put(getTagsSucceed(convertObjectKeyToCamelCase(response.data)));
    } catch (error) {
        yield put(getTagsFailed(errorMsg(error)));
    }
}

export function* getTagSubscribers({ payload: { pageId, tagId } }) {
    try {
        const response = yield call(settingsApi.getTagSubscribers, pageId, tagId);
        yield put(getTagSubscribersSucceed(convertObjectKeyToCamelCase(response.data.subscribers || [])));
    } catch (error) {
        yield put(getTagSubscribersFailed(errorMsg(error)));
    }
}

export function* addPageTag({ payload: { pageId, value } }) {
    try {
        const response = yield call(settingsApi.addTag, pageId, value);

        yield put(addTagSucceed(response.data.uid, value));
    } catch (error) {
        yield put(addTagFailed(errorMsg(error)));
    }
}

export function* deletePageTag({ payload: { pageId, tagId } }) {
    try {
        yield call(settingsApi.deleteTag, pageId, tagId);

        yield put(deleteTagSucceed(tagId));
    } catch (error) {
        yield put(deleteTagFailed(errorMsg(error)));
    }
}
