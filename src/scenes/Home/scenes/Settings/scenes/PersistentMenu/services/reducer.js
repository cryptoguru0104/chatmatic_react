import { handleActions } from 'redux-actions';

import {
  getPersistentMenus,
  getPersistentMenusSucceed,
  getPersistentMenusFailed,
  addPersistentMenu,
  updatePersistentMenu,
  updateActiveMenuAndOption,
  deletePersistentMenu,
  deletePersistentMenuSucceed,
  deletePersistentMenuFailed,
  savePersistentMenu,
  savePersistentMenuSucceed,
  savePersistentMenuFailed
} from './actions';

const defaultState = {
  persistentMenus: {
    menus: [],
    isProcessing: false,
    error: null
  },
  currentMenu: null,
  activeMenuId: null,
  activeOptionIndex: null,
  loading: false,
  error: null
};

const reducer = handleActions(
  {
    [getPersistentMenus](state) {
      return {
        ...state,
        loading: true,
        error: null
      };
    },
    [getPersistentMenusSucceed](
      state,
      {
        payload: { menus }
      }
    ) {
      return {
        ...state,
        persistentMenus: {
          ...state.persistentMenus,
          ...menus
        },
        // currentMenu: null,
        loading: false,
        error: null
      };
    },
    [getPersistentMenusFailed](
      state,
      {
        payload: { error }
      }
    ) {
      return {
        ...state,
        loading: false,
        error
      };
    },
    [addPersistentMenu](state) {
      return {
        ...state,
        currentMenu: {
          uid: null,
          type: '',
          value: null,
          name: ''
        }
      };
    },
    [updatePersistentMenu](
      state,
      {
        payload: { menu }
      }
    ) {
      if (!state.activeMenuId) {
        return {
          ...state,
          currentMenu: {
            ...state.currentMenu,
            ...menu
          }
        };
      } else {
        const menus = state.persistentMenus.menus.map(item => {
          if (item.uid !== state.activeMenuId) return item;

          return {
            ...item,
            ...menu
          };
        });

        return {
          ...state,
          persistentMenus: {
            ...state.persistentMenus,
            menus
          }
        };
      }
    },
    [updateActiveMenuAndOption](
      state,
      {
        payload: { data }
      }
    ) {
      return {
        ...state,
        ...data
      };
    },
    [deletePersistentMenu](
      state,
      {
        payload: { menuId }
      }
    ) {
      if (!!menuId) {
        return {
          ...state,
          persistentMenus: {
            ...state.persistentMenus,
            isProcessing: true
          }
        };
      } else {
        return state;
      }
    },
    [deletePersistentMenuSucceed](
      state,
      {
        payload: { menuId }
      }
    ) {
      if (!!menuId) {
        const menus = state.persistentMenus.menus.filter(
          menu => menu.uid !== menuId
        );

        return {
          ...state,
          persistentMenus: {
            ...state.persistentMenus,
            menus,
            isProcessing: false
          }
        };
      } else if (state.currentMenu) {
        return {
          ...state,
          currentMenu: null
        };
      }
    },
    [deletePersistentMenuFailed](
      state,
      {
        payload: { error }
      }
    ) {
      return {
        ...state,
        persistentMenus: {
          ...state.persistentMenus,
          isProcessing: false,
          error
        }
      };
    },
    [savePersistentMenu](state) {
      return {
        ...state,
        persistentMenus: {
          ...state.persistentMenus,
          isProcessing: true
        }
      };
    },
    [savePersistentMenuSucceed](
      state,
      {
        payload: { menu }
      }
    ) {
      let menus = state.persistentMenus.menus;

      if (menu.uid) {
        menus = menus.concat([
          {
            ...state.currentMenu,
            uid: menu.uid
          }
        ]);
      }

      return {
        ...defaultState,
        persistentMenus: {
          ...state.persistentMenus,
          isProcessing: false,
          menus
        }
      };
    },
    [savePersistentMenuFailed](
      state,
      {
        payload: { error }
      }
    ) {
      return {
        ...state,
        persistentMenus: {
          ...state.persistentMenus,
          isProcessing: false,
          error
        }
      };
    }
  },
  defaultState
);

export default reducer;
