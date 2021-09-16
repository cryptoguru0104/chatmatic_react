import { wrapRequest, xapi, snakeCaseKeys } from 'services/utils';

const getTemplates = wrapRequest(async pageId =>
    xapi(false).get(`pages/${pageId}/templates`)
);

const addTemplate = wrapRequest(async (pageId, shareCode) =>
    xapi(false).post(`pages/${pageId}/templates/import`, {
        share_code: shareCode
    })
);

const deleteTemplate = wrapRequest(async (pageId, templateId) =>
    xapi(false).delete(`pages/${pageId}/templates/${templateId}`)
);

const createTemplate = wrapRequest(async (pageId, data) =>
    xapi(false).post(`pages/${pageId}/template`, { ...snakeCaseKeys(data) })
);

const updateTemplate = wrapRequest(async (pageId, templateId, data) =>
    xapi(false).patch(`pages/${pageId}/templates/${templateId}`, {
        ...snakeCaseKeys(data)
    })
);

export {
    getTemplates,
    addTemplate,
    deleteTemplate,
    createTemplate,
    updateTemplate
};
