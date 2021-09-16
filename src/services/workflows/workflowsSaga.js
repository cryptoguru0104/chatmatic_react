import { put, takeLatest, call } from "redux-saga/effects";

import * as workflowsApi from "./workflowsApi";
import {
    getPageWorkflowsSucceed,
    getPageWorkflowsFailed,
    getPageWorkflowSucceed,
    getPageWorkflowFailed,
    getPageTemplatesSucceed,
    getPageTemplatesFailed,
    getPageTemplateSucceed,
    getPageTemplateFailed,
    buyPageTemplateSucceed,
    buyPageTemplateFailed,
    clonePageTemplateSumoFailed,
    clonePageTemplateSumoSucceed,
    updateWorkflowImageSucceed,
    updateWorkflowImageFailed,
    getPageWorkflowTriggersSucceed,
    getPageWorkflowTriggersFailed,
    getPageWorkflowStatsSucceed,
    getPageWorkflowStatsFailed,
    deletePageWorkflowSucceed,
    deletePageWorkflowFailed
} from "./workflowsActions";
import {
    convertObjectKeyToCamelCase,
    errorMsg,
    parseBroadcasts
} from "../utils";
import { transformStepsToLocal } from "services/workflows/transformers";
import { updateEngageInfo } from "scenes/Home/scenes/EngageAdd/services/actions.js";

export function* workflowsSubscriber() {
    yield takeLatest("GET_PAGE_WORKFLOWS", getPageWorkflows);
    yield takeLatest("GET_PAGE_WORKFLOW", getPageWorkflow);
    yield takeLatest("GET_PAGE_TEMPLATES", getPageTemplates);
    yield takeLatest("GET_PAGE_TEMPLATE", getPageTemplate);
    yield takeLatest("GET_PAGE_TEMPLATE_PREVIEW", getPageTemplatePreview);
    yield takeLatest("BUY_PAGE_TEMPLATE", buyPageTemplate);
    yield takeLatest("CLONE_PAGE_TEMPLATE_SUMO", clonePageTemplateSumo);
    yield takeLatest("GET_PAGE_WORKFLOW_STATS", getPageWorkflowStats);
    yield takeLatest("GET_PAGE_WORKFLOW_TRIGGERS", getPageWorkflowTriggers);
    yield takeLatest("DELETE_PAGE_WORKFLOW", deletePageWorkflow);
    yield takeLatest("UPDATE_WORKFLOW_IMAGE", updateWorkflowImage);
}

export function* getPageWorkflows({ payload: { pageId } }) {
    try {
        const response = yield call(workflowsApi.getPageWorkflows, pageId);

        const responseData = convertObjectKeyToCamelCase(response.data);

        yield put(
            getPageWorkflowsSucceed(
                responseData.workflows || [],
                parseBroadcasts(responseData.broadcasts) || []
            )
        );
    } catch (error) {
        yield put(getPageWorkflowsFailed(errorMsg(error)));
    }
}

export function* getPageWorkflow({ payload: { pageId, workflowId } }) {
    try {
        const response = yield call(
            workflowsApi.getPageWorkflow,
            pageId,
            workflowId
        );

        const responseData = convertObjectKeyToCamelCase(response.data);

        yield put(getPageWorkflowSucceed(responseData.workflow));

        const steps = transformStepsToLocal(responseData.workflow.steps);
        yield put(
            updateEngageInfo({
                name: responseData.workflow.name,
                activeStep: responseData.workflow.steps[0].stepUid,
                showBuilderAsideMenu: false,
                steps: steps,
                uid: responseData.workflow.uid
            })
        );
    } catch (error) {
        yield put(getPageWorkflowFailed(errorMsg(error)));
    }
}

export function* getPageTemplates({ payload: {pageSource} }) {
    try {
        const response = yield call(workflowsApi.getPageTemplates, pageSource);
        const responseData = convertObjectKeyToCamelCase(response.data);

        yield put(getPageTemplatesSucceed(responseData.templates || []));
    } catch (error) {
        yield put(getPageTemplatesFailed(errorMsg(error)));
    }
}

export function* getPageTemplate({ payload: { pageId, templateId } }) {
    try {
        const response = yield call(
            workflowsApi.getPageTemplate,
            pageId,
            templateId
        );
        const responseData = convertObjectKeyToCamelCase(response.data);
        // console.log('responseData', responseData);

        yield put(
            getPageTemplateSucceed({
                ...responseData.template,
                name: responseData.name,
                description: responseData.description
            })
        );
    } catch (error) {
        yield put(getPageTemplateFailed(errorMsg(error)));
    }
}

export function* buyPageTemplate({ payload: { pageId, templateId, data } }) {
    try {
        const response = yield call(
            workflowsApi.buyPageTemplate,
            pageId,
            templateId,
            data
        );
        const responseData = convertObjectKeyToCamelCase(response.data);
        // console.log('responseData', responseData);

        yield put(buyPageTemplateSucceed(responseData.templateCode));
    } catch (error) {
        yield put(buyPageTemplateFailed(errorMsg(error)));
    }
}
export function* clonePageTemplateSumo({
    payload: { pageId, templateId, data }
}) {
    try {
        const response = yield call(
            workflowsApi.cloneTemplateSumo,
            pageId,
            templateId,
            data
        );
        const responseData = convertObjectKeyToCamelCase(response.data);

        yield put(clonePageTemplateSumoSucceed(responseData.templateCode));
    } catch (error) {
        yield put(clonePageTemplateSumoFailed(errorMsg(error)));
    }
}
export function* getPageWorkflowTriggers({ payload: { pageId } }) {
    try {
        const response = yield call(
            workflowsApi.getPageWorkflowTriggers,
            pageId
        );
        const responseData = convertObjectKeyToCamelCase(response.data);

        yield put(getPageWorkflowTriggersSucceed(responseData));
    } catch (error) {
        yield put(getPageWorkflowTriggersFailed(errorMsg(error)));
    }
}
export function* getPageWorkflowStats({ payload: { pageId, workflowId } }) {
    try {
        const response = yield call(
            workflowsApi.getPageWorkflowStats,
            pageId,
            workflowId
        );
        const responseData = convertObjectKeyToCamelCase(response.data);

        yield put(getPageWorkflowStatsSucceed(responseData.data));
    } catch (error) {
        yield put(getPageWorkflowStatsFailed(errorMsg(error)));
    }
}

export function* deletePageWorkflow({ payload: { pageId, workflowId } }) {
    try {
        yield call(workflowsApi.deletePageWorkflow, pageId, workflowId);

        yield put(deletePageWorkflowSucceed(workflowId));
    } catch (error) {
        yield put(deletePageWorkflowFailed(error));
    }
}

export function* updateWorkflowImage({
    payload: { pageId, workflowId, data }
}) {
    try {
        const response = yield call(
            workflowsApi.updateWorkflowImage,
            pageId,
            workflowId,
            data
        );

        yield put(updateWorkflowImageSucceed(workflowId, data));
    } catch (error) {
        yield put(updateWorkflowImageFailed(error));
    }
}

export function* getPageTemplatePreview({ payload: { templateId } }) {
    try {
        const response = yield call(
            workflowsApi.getPageTemplatePreview,
            templateId
        );
        const responseData = convertObjectKeyToCamelCase(response.data);
        // console.log('responseData', responseData);

        yield put(
            getPageTemplateSucceed({
                ...responseData.template,
                name: responseData.name,
                description: responseData.description,
                price: responseData.price,
                category: responseData.category
            })
        );
    } catch (error) {
        yield put(getPageTemplateFailed(errorMsg(error)));
    }
}
