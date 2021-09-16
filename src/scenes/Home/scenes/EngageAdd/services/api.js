import { wrapRequest, xapi, snakeCaseKeys } from 'services/utils';

export const addEngage = wrapRequest(async (pageId, engage) =>
  xapi(false).post(`pages/${pageId}/workflows`, {
    ...snakeCaseKeys(engage)
  })
);

export const updateEngage = wrapRequest(async (pageId, engage) =>
  xapi(false).patch(`pages/${pageId}/workflows/${engage.uid}`, {
    ...snakeCaseKeys(engage)
  })
);

export const fileUpload = wrapRequest(
  async (pageId, fileType, src, stepUid, itemIndex, url) =>
    xapi(false, { stepUid, itemIndex }).post(`pages/${pageId}/fileupload`, {
      type: fileType,
      src,
      url
    })
);

export const pageFileUpload = wrapRequest(
  async (pageId, fileType, src, url) =>
    xapi(false).post(`pages/${pageId}/fileupload`, {
      type: fileType,
      src,
      url
    })
);

export const updateBroadcast = wrapRequest(async (pageId, broadcast) =>
  xapi(false).patch(`pages/${pageId}/broadcasts/${broadcast.uid}`, {
    ...snakeCaseKeys(broadcast)
  })
);

export const getWidgetTypes = wrapRequest(async (pageId) =>
  xapi(false).get(`pages/${pageId}/widget-types`)
);

export const getProducts = wrapRequest(async (pageId, integration_uid) => 
  xapi(false).get(`pages/${pageId}/integrations/${integration_uid}/products`)
);

export const getCollects = wrapRequest(async (pageId, integration_uid) => 
  xapi(false).get(`pages/${pageId}/integrations/${integration_uid}/collects`)
);
