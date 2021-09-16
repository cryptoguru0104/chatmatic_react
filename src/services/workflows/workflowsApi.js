import { wrapRequest, xapi, snakeCaseKeys } from "../utils";

const getPageWorkflows = wrapRequest(async pageId =>
    xapi(false).get(`pages/${pageId}/workflows`)
);
const getPageWorkflow = wrapRequest(async (pageId, workflowId) =>
    xapi(false).get(`pages/${pageId}/workflows/${workflowId}`)
);
const getPageTemplates = wrapRequest(async (pageSource) =>
    xapi(false).get(`/market_templates?source=${pageSource}`)
);
const getPageTemplate = wrapRequest(async (pageId, templateId) =>
    xapi(false).get(`pages/${pageId}/templates/${templateId}`)
);
const getPageTemplatePreview = wrapRequest(async templateId =>
    xapi(false).get(`/templates/${templateId}`)
);
const buyPageTemplate = wrapRequest(async (pageId, templateId, data) =>
    xapi(false).post(`pages/${pageId}/templates/${templateId}/buy`, {
        ...snakeCaseKeys(data)
    })
);
const cloneTemplateSumo = wrapRequest(async (pageId, templateId, data) =>
    xapi(false).post(`pages/${pageId}/templates/${templateId}/redem_sumo`, {
        ...snakeCaseKeys(data)
    })
);
const getPageWorkflowStats = wrapRequest(async (pageId, workflowId) =>
    xapi(false).get(`pages/${pageId}/workflows/${workflowId}/stats`)
);
const getPageWorkflowTriggers = wrapRequest(async pageId =>
    xapi(false).get(`pages/${pageId}/workflow-triggers`)
);
const deletePageWorkflow = wrapRequest(async (pageId, workflowId) =>
    xapi(false).delete(`pages/${pageId}/workflows/${workflowId}`)
);
const updateWorkflowImage = wrapRequest(async (pageId, workflowId, data) =>
    xapi(false).patch(`pages/${pageId}/workflows/${workflowId}/pict`, {
        ...snakeCaseKeys(data)
    })
);
const getPageWorkflowJson = wrapRequest(async (pageId, workflowRootStepUid) =>
    xapi(false).post(`pages/${pageId}/export_json`, {
        // workflow_step_uid: workflowRootStepUid
        flow_trigger_uid: workflowRootStepUid
    })
);

export {
    getPageWorkflows,
    getPageWorkflow,
    getPageTemplates,
    getPageTemplate,
    getPageTemplatePreview,
    buyPageTemplate,
    cloneTemplateSumo,
    getPageWorkflowJson,
    getPageWorkflowTriggers,
    getPageWorkflowStats,
    updateWorkflowImage,
    deletePageWorkflow
};
