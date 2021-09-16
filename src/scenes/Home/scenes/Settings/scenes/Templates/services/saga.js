import { put, takeLatest, call } from 'redux-saga/effects';

import * as apis from './api';
import {
    getTemplatesSucceed,
    getTemplatesFailed,
    addTemplateSucceed,
    addTemplateFailed,
    deleteTemplateSucceed,
    deleteTemplateFailed,
    createTemplateSucceed,
    createTemplateFailed,
    updateTemplateSucceed,
    updateTemplateFailed
} from './actions';
import { convertObjectKeyToCamelCase, errorMsg } from 'services/utils';

export function* templatesSubscriber() {
    yield takeLatest('GET_TEMPLATES', getPageTemplates);

    yield takeLatest('DELETE_TEMPLATE', deletePageTemplate);

    yield takeLatest('ADD_TEMPLATE', addPageTemplate);

    yield takeLatest('CREATE_TEMPLATE', createPageTemplate);

    yield takeLatest('UPDATE_TEMPLATE', updatePageTemplate);
}

export function* getPageTemplates({ payload: { pageId } }) {
    try {
        const response = yield call(apis.getTemplates, pageId);

        yield put(
            getTemplatesSucceed(
                convertObjectKeyToCamelCase(response.data.templates)
            )
        );
    } catch (error) {
        yield put(getTemplatesFailed(errorMsg(error)));
    }
}

export function* deletePageTemplate({ payload: { pageId, templateId } }) {
    try {
        yield call(apis.deleteTemplate, pageId, templateId);

        yield put(deleteTemplateSucceed(templateId));
    } catch (error) {
        yield put(deleteTemplateFailed(errorMsg(error)));
    }
}

export function* addPageTemplate({ payload: { pageId, shareCode } }) {
    try {
        const response = yield call(apis.addTemplate, pageId, shareCode);

        yield put(addTemplateSucceed());
    } catch (error) {
        yield put(addTemplateFailed(errorMsg(error)));
    }
}

export function* createPageTemplate({ payload: { pageId, data } }) {
    try {
        yield call(apis.createTemplate, pageId, data);

        yield put(createTemplateSucceed());
    } catch (error) {
        yield put(createTemplateFailed(errorMsg(error)));
    }
}

export function* updatePageTemplate({ payload: { pageId, templateId, data } }) {
    try {
        yield call(apis.updateTemplate, pageId, templateId, data);

        yield put(updateTemplateSucceed());
    } catch (error) {
        yield put(updateTemplateFailed(errorMsg(error)));
    }
}
