import { wrapRequest, xapi, snakeCaseKeys } from 'services/utils';

const getAutomations = wrapRequest(async pageId =>
  xapi(false).get(`pages/${pageId}/automations`)
);

const updateAutomation = wrapRequest(async (pageId, automationUid, data) =>
  xapi(false).put(`pages/${pageId}/automations/${automationUid}`, {
    ...snakeCaseKeys(data)
  })
);

const addAutomation = wrapRequest(async (pageId, data) =>
  xapi(false).post(`pages/${pageId}/automations`, {
    ...snakeCaseKeys(data)
  })
);

const deleteAutomation = wrapRequest(async (pageId, automationUid) =>
  xapi(false).delete(`pages/${pageId}/automations/${automationUid}`)
);

export { getAutomations, updateAutomation, addAutomation, deleteAutomation };
