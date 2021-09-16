import { createActions } from "redux-actions";

const {
    getPageWorkflows,
    getPageWorkflowsSucceed,
    getPageWorkflowsFailed,
    getPageWorkflow,
    getPageWorkflowSucceed,
    getPageWorkflowFailed,
    getPageTemplates,
    getPageTemplatesSucceed,
    getPageTemplatesFailed,
    getPageTemplate,
    getPageTemplatePreview,
    getPageTemplateSucceed,
    getPageTemplateFailed,
    buyPageTemplate,
    buyPageTemplateSucceed,
    buyPageTemplateFailed,
    clonePageTemplateSumo,
    clonePageTemplateSumoSucceed,
    clonePageTemplateSumoFailed,
    updateWorkflowImage,
    updateWorkflowImageSucceed,
    updateWorkflowImageFailed,
    getPageWorkflowTriggers,
    getPageWorkflowTriggersSucceed,
    getPageWorkflowTriggersFailed,
    getPageWorkflowStats,
    getPageWorkflowStatsSucceed,
    getPageWorkflowStatsFailed,
    deletePageWorkflow,
    deletePageWorkflowSucceed,
    deletePageWorkflowFailed
} = createActions({
    GET_PAGE_WORKFLOWS: pageId => ({ pageId }),
    GET_PAGE_WORKFLOWS_SUCCEED: (workflows, broadcasts) => ({
        workflows,
        broadcasts
    }),
    GET_PAGE_WORKFLOWS_FAILED: error => ({ error }),
    GET_PAGE_WORKFLOW: (pageId, workflowId) => ({ pageId, workflowId }),
    GET_PAGE_WORKFLOW_SUCCEED: workflow => ({
        workflow
    }),
    GET_PAGE_WORKFLOW_FAILED: error => ({ error }),
    GET_PAGE_TEMPLATES: pageSource => ({pageSource}),
    GET_PAGE_TEMPLATES_SUCCEED: templates => ({
        templates
    }),
    GET_PAGE_TEMPLATES_FAILED: error => ({ error }),
    GET_PAGE_TEMPLATE: (pageId, templateId) => ({ pageId, templateId }),
    GET_PAGE_TEMPLATE_PREVIEW: templateId => ({ templateId }),
    GET_PAGE_TEMPLATE_SUCCEED: template => ({
        template
    }),
    GET_PAGE_TEMPLATE_FAILED: error => ({ error }),
    BUY_PAGE_TEMPLATE: (pageId, templateId, data) => ({
        pageId,
        templateId,
        data
    }),
    BUY_PAGE_TEMPLATE_SUCCEED: templateCode => ({ templateCode }),
    BUY_PAGE_TEMPLATE_FAILED: error => ({ error }),

    CLONE_PAGE_TEMPLATE_SUMO: (pageId, templateId, data) => ({
        pageId,
        templateId,
        data
    }),
    CLONE_PAGE_TEMPLATE_SUMO_SUCCEED: templateCode => ({ templateCode }),
    CLONE_PAGE_TEMPLATE_SUMO_FAILED: error => ({ error }),

    UPDATE_WORKFLOW_IMAGE: (pageId, workflowId, data) => ({
        pageId,
        workflowId,
        data
    }),
    UPDATE_WORKFLOW_IMAGE_SUCCEED: (workflowId, data) => ({
        workflowId,
        data
    }),
    UPDATE_WORKFLOW_IMAGE_FAILED: error => ({ error }),
    GET_PAGE_WORKFLOW_TRIGGERS: pageId => ({ pageId }),
    GET_PAGE_WORKFLOW_TRIGGERS_SUCCEED: response => response,
    GET_PAGE_WORKFLOW_TRIGGERS_FAILED: error => ({ error }),
    GET_PAGE_WORKFLOW_STATS: (pageId, workflowId) => {
        return { pageId, workflowId };
    },
    GET_PAGE_WORKFLOW_STATS_SUCCEED: stats => ({
        stats
    }),
    GET_PAGE_WORKFLOW_STATS_FAILED: error => ({ error }),
    DELETE_PAGE_WORKFLOW: (pageId, workflowId) => ({ pageId, workflowId }),
    DELETE_PAGE_WORKFLOW_SUCCEED: workflowId => ({ workflowId }),
    DELETE_PAGE_WORKFLOW_FAILED: error => ({ error })
});

export {
    getPageWorkflows,
    getPageWorkflowsSucceed,
    getPageWorkflowsFailed,
    getPageWorkflow,
    getPageWorkflowSucceed,
    getPageWorkflowFailed,
    getPageTemplates,
    getPageTemplatesSucceed,
    getPageTemplatesFailed,
    getPageTemplate,
    getPageTemplatePreview,
    getPageTemplateSucceed,
    getPageTemplateFailed,
    buyPageTemplate,
    buyPageTemplateSucceed,
    buyPageTemplateFailed,
    clonePageTemplateSumo,
    clonePageTemplateSumoSucceed,
    clonePageTemplateSumoFailed,
    updateWorkflowImage,
    updateWorkflowImageSucceed,
    updateWorkflowImageFailed,
    getPageWorkflowTriggers,
    getPageWorkflowTriggersSucceed,
    getPageWorkflowTriggersFailed,
    getPageWorkflowStats,
    getPageWorkflowStatsSucceed,
    getPageWorkflowStatsFailed,
    deletePageWorkflow,
    deletePageWorkflowSucceed,
    deletePageWorkflowFailed
};
