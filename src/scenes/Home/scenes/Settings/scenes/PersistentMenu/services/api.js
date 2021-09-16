import { wrapRequest, xapi, snakeCaseKeys } from 'services/utils';

const getPageMenus = wrapRequest(async pageId =>
  xapi(false).get(`pages/${pageId}/menus`)
);

const addPageMenu = wrapRequest(async (pageId, menu) =>
  xapi(false).post(`pages/${pageId}/menus`, {
    ...snakeCaseKeys(menu)
  })
);

const updatePageMenu = wrapRequest(async (pageId, menu) =>
  xapi(false).put(`pages/${pageId}/menus/${menu.uid}`, {
    ...snakeCaseKeys(menu)
  })
);

const deletePageMenu = wrapRequest(async (pageId, menuId) =>
  xapi(false).delete(`pages/${pageId}/menus/${menuId}`)
);

export { getPageMenus, addPageMenu, updatePageMenu, deletePageMenu };
