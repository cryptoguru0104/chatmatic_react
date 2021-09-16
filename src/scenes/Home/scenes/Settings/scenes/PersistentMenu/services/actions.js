import { createActions } from 'redux-actions';

const {
  getPersistentMenus,
  getPersistentMenusSucceed,
  getPersistentMenusFailed,
  addPersistentMenu,
  updatePersistentMenu,
  updateActiveMenuAndOption,
  savePersistentMenu,
  savePersistentMenuSucceed,
  savePersistentMenuFailed,
  deletePersistentMenu,
  deletePersistentMenuSucceed,
  deletePersistentMenuFailed
} = createActions({
  GET_PERSISTENT_MENUS: pageId => ({ pageId }),
  GET_PERSISTENT_MENUS_SUCCEED: menus => ({ menus }),
  GET_PERSISTENT_MENUS_FAILED: error => ({ error }),
  ADD_PERSISTENT_MENU: () => ({}),
  UPDATE_PERSISTENT_MENU: menu => ({ menu }),
  UPDATE_ACTIVE_MENU_AND_OPTION: data => ({ data }),
  SAVE_PERSISTENT_MENU: pageId => ({ pageId }),
  SAVE_PERSISTENT_MENU_SUCCEED: menu => ({ menu }),
  SAVE_PERSISTENT_MENU_FAILED: error => ({ error }),
  DELETE_PERSISTENT_MENU: (pageId, menuId) => ({ pageId, menuId }),
  DELETE_PERSISTENT_MENU_SUCCEED: menuId => ({ menuId }),
  DELETE_PERSISTENT_MENU_FAILED: error => ({ error })
});

export {
  getPersistentMenus,
  getPersistentMenusSucceed,
  getPersistentMenusFailed,
  addPersistentMenu,
  updatePersistentMenu,
  updateActiveMenuAndOption,
  savePersistentMenu,
  savePersistentMenuSucceed,
  savePersistentMenuFailed,
  deletePersistentMenu,
  deletePersistentMenuSucceed,
  deletePersistentMenuFailed
};
