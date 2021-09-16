import { wrapRequest, xapi } from '../utils';

const getTags = wrapRequest(async pageId =>
  xapi(false).get(`pages/${pageId}/tags`)
);

const getTagSubscribers = wrapRequest(async (pageId, tagId) =>
  xapi(false).get(`pages/${pageId}/tags/${tagId}/subscribers`)
);

const addTag = wrapRequest(async (pageId, value) =>
  xapi(false).post(`pages/${pageId}/tags`, {
    value
  })
);

const deleteTag = wrapRequest(async (pageId, tagId) =>
  xapi(false).delete(`pages/${pageId}/tags/${tagId}`)
);

export { getTags, getTagSubscribers, addTag, deleteTag };
