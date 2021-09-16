import { createActions } from 'redux-actions';

const {
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
} = createActions({
    GET_TEMPLATES: pageId => ({ pageId }),
    GET_TEMPLATES_SUCCEED: templates => ({ templates }),
    GET_TEMPLATES_FAILED: error => ({ error }),
    ADD_TEMPLATE: (pageId, shareCode) => ({ pageId, shareCode }),
    ADD_TEMPLATE_SUCCEED: () => ({}),
    ADD_TEMPLATE_FAILED: error => ({ error }),
    DELETE_TEMPLATE: (pageId, templateId) => ({ pageId, templateId }),
    DELETE_TEMPLATE_SUCCEED: templateId => ({ templateId }),
    DELETE_TEMPLATE_FAILED: error => ({ error }),
    CREATE_TEMPLATE: (pageId, data) => ({ pageId, data }),
    CREATE_TEMPLATE_SUCCEED: () => ({}),
    CREATE_TEMPLATE_FAILED: error => ({ error }),
    UPDATE_TEMPLATE: (pageId, templateId, data) => ({
        pageId,
        templateId,
        data
    }),
    UPDATE_TEMPLATE_SUCCEED: () => ({}),
    UPDATE_TEMPLATE_FAILED: error => ({ error })
});

export {
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
};
