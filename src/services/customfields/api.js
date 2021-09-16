import { wrapRequest, xapi, snakeCaseKeys } from '../utils';

const getCustomFields = wrapRequest(async pageId =>
  xapi(false).get(`pages/${pageId}/custom-fields`)
);

const getCustomFieldSubscribers = wrapRequest(async (pageId, uId) =>
  xapi(false).get(`pages/${pageId}/custom-fields/${uId}/subscribers`)
);

const addCustomField = wrapRequest(async (pageId, value) =>
  xapi(false).post(`pages/${pageId}/custom-fields`, {
    ...value
  })
);
const deleteCustomField = wrapRequest(async (pageId, uId) =>
  xapi(false).delete(`pages/${pageId}/custom-fields/${uId}`)
);
const updateCustomField = wrapRequest(async (pageId, uId, data) =>
  xapi(false).put(`pages/${pageId}/custom-fields/${uId}`, {
    ...snakeCaseKeys(data)
  })
);
export {
  getCustomFields,
  getCustomFieldSubscribers,
  addCustomField,
  deleteCustomField,
  updateCustomField
};
