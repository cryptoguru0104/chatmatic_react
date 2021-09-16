import { handleActions } from 'redux-actions';

import {
    getTemplates,
    getTemplatesSucceed,
    getTemplatesFailed,
    addTemplate,
    addTemplateSucceed,
    addTemplateFailed,
    deleteTemplate,
    deleteTemplateSucceed,
    deleteTemplateFailed,
    createTemplate,
    createTemplateSucceed,
    createTemplateFailed,
    updateTemplate,
    updateTemplateSucceed,
    updateTemplateFailed
} from './actions';

const defaultState = {
    templates: [],
    loading: false,
    error: null
};

const reducer = handleActions(
    {
        [getTemplates](state) {
            return {
                templates: [],
                loading: true,
                error: null
            };
        },
        [getTemplatesSucceed](state, { payload: { templates } }) {
            return {
                ...state,
                templates,
                loading: false,
                error: null
            };
        },
        [getTemplatesFailed](state, { payload: { error } }) {
            return {
                ...state,
                loading: false,
                error
            };
        },
        [deleteTemplate](state) {
            return {
                ...state,
                loading: true,
                error: null
            };
        },
        [deleteTemplateSucceed](state, { payload: { templateId } }) {
            const templates = state.templates.filter(
                template => template.uid !== parseInt(templateId, 10)
            );

            return {
                templates,
                loading: false,
                error: null
            };
        },
        [deleteTemplateFailed](state, { payload: { error } }) {
            return {
                ...state,
                loading: false,
                error
            };
        },
        [addTemplate](state) {
            return {
                ...state,
                loading: true,
                error: null
            };
        },
        [addTemplateSucceed](state) {
            return {
                ...state,
                loading: false,
                error: null
            };
        },
        [addTemplateFailed](state, { payload: { error } }) {
            return {
                ...state,
                loading: false,
                error
            };
        },
        [createTemplate](state) {
            return {
                ...state,
                loading: true,
                error: null
            };
        },
        [createTemplateSucceed](state) {
            return {
                ...state,
                loading: false,
                error: null
            };
        },
        [createTemplateFailed](state, { payload: { error } }) {
            return {
                ...state,
                loading: false,
                error
            };
        },
        [updateTemplate](state) {
            return {
                ...state,
                loading: true,
                error: null
            };
        },
        [updateTemplateSucceed](state) {
            return {
                ...state,
                loading: false,
                error: null
            };
        },
        [updateTemplateFailed](state, { payload: { error } }) {
            return {
                ...state,
                loading: false,
                error
            };
        }
    },
    defaultState
);

export default reducer;
