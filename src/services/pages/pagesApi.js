import { wrapRequest, xapi, snakeCaseKeys } from '../utils';

const getPages = wrapRequest(async refresh =>
  xapi(false).get('pages', {
    params: {
      refresh: refresh
    }
  })
);

const getAllPages = wrapRequest(async () => xapi(false).get('pages/all'));

const updateConnect = wrapRequest(async (pageId, isConnected) =>
  xapi(false).patch(`pages/${pageId}`, {
    is_connected: isConnected
  })
);

const connectAll = wrapRequest(async () => xapi(false).post('pages/all'));

const getPagePosts = wrapRequest(async pageId =>
  xapi(false).get(`pages/${pageId}/posts`)
);

const updatePost = wrapRequest(async (pageId, postId, postActive) =>
  xapi(false).patch(`pages/${pageId}/posts/${postId}`, {
    trigger: postActive
  })
);

const createTrigger = wrapRequest(async (pageId, trigger) =>
  xapi(false).post(`pages/${pageId}/triggers`, {
    ...snakeCaseKeys(trigger)
  })
);

const updateTrigger = wrapRequest(async (pageId, trigger) =>
  xapi(false).put(`pages/${pageId}/triggers/${trigger.uid}`, {
    ...snakeCaseKeys(trigger)
  })
);

const togglePageMenuActive = wrapRequest(async (pageId, active) =>
  xapi(false).put(`pages/${pageId}/menus`, {
    active
  })
);

const getPage = wrapRequest(async (pageId) =>
  xapi(false).get(`pages/${pageId}/home`)
);

const getRecentSubscribers = wrapRequest(async (days) =>
    xapi(false).post(`pages/getsubscribers`, {
        days
    })
);

export {
  getPages,
  updateConnect,
  connectAll,
  getPagePosts,
  updatePost,
  updateTrigger,
  createTrigger,
  togglePageMenuActive,
  getAllPages,
  getPage,
  getRecentSubscribers
};
