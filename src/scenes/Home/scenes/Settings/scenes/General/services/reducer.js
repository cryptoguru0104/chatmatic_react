import { handleActions } from 'redux-actions';

import {
  getAdmins,
  getAdminsSucceed,
  getAdminsFailed,
  deleteAdmin,
  deleteAdminSucceed,
  deleteAdminFailed,
  addAdmin,
  addAdminSucceed,
  addAdminFailed
} from './actions';

const defaultState = {
  admins: [],
  loading: false,
  error: null
};

const reducer = handleActions(
  {
    [getAdmins](state) {
      return {
        admins: [],
        loading: true,
        error: null
      };
    },
    [getAdminsSucceed](
      state,
      {
        payload: { admins }
      }
    ) {
      return {
        ...state,
        admins,
        loading: false,
        error: null
      };
    },
    [getAdminsFailed](
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
    [deleteAdmin](state) {
      return {
        ...state,
        loading: true,
        error: null
      };
    },
    [deleteAdminSucceed](
      state,
      {
        payload: { adminId }
      }
    ) {
      const admins = state.admins.filter(
        admin => admin.uid !== parseInt(adminId, 10)
      );

      return {
        admins,
        loading: false,
        error: null
      };
    },
    [deleteAdminFailed](
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
    [addAdmin](state) {
      return {
        ...state,
        loading: true,
        error: null
      };
    },
    [addAdminSucceed](
      state,
      {
        payload: { email }
      }
    ) {
      return {
        ...state,
        loading: false,
        error: null
      };
    },
    [addAdminFailed](
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
    }
  },
  defaultState
);

export default reducer;
