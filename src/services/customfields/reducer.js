import { handleActions } from 'redux-actions';

import {
  getCustomFields,
  getCustomFieldsSucceed,
  getCustomFieldsFailed,
  getCustomFieldSubscribers,
  getCustomFieldSubscribersSucceed,
  getCustomFieldSubscribersFailed,
  addCustomField,
  addCustomFieldSucceed,
  addCustomFieldFailed,
  deleteCustomField,
  deleteCustomFieldSucceed,
  deleteCustomFieldFailed,
  updateCustomField,
  updateCustomFieldSucceed,
  updateCustomFieldFailed
} from './actions';

const defaultState = {
  error: null,
  loading: false,
  customFields: [],
  subscribers: []
};

const reducer = handleActions(
  {
    [getCustomFields](state) {
      return {
        error: null,
        loading: true,
        customFields: []
      };
    },
    [getCustomFieldsSucceed](
      state,
      {
        payload: { customFields }
      }
    ) {
      return {
        customFields,
        loading: false,
        error: null
      };
    },
    [getCustomFieldsFailed](
      state,
      {
        payload: { error }
      }
    ) {
      return {
        customFields: [],
        loading: false,
        error
      };
    },
    [getCustomFieldSubscribers](state) {
      return {
        ...state,
        error: null,
        loading: true,
        subscribers: []
      };
    },
    [getCustomFieldSubscribersSucceed](
      state,
      {
        payload: { subscribers }
      }
    ) {
      return {
        ...state,
        subscribers,
        loading: false,
        error: null
      };
    },
    [getCustomFieldSubscribersFailed](
      state,
      {
        payload: { error }
      }
    ) {
      return {
        ...state,
        subscribers: [],
        loading: false,
        error
      };
    },
    [addCustomField](state) {
      return {
        ...state,
        loading: true,
        error: null
      };
    },
    [addCustomFieldSucceed](
      state,
      {
        payload: { customField }
      }
    ) {
      const customFields = state.customFields.concat([customField]);

      return {
        customFields,
        loading: false,
        error: null
      };
    },
    [addCustomFieldFailed](
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
    [deleteCustomField](state) {
      return {
        ...state,
        loading: true,
        error: null
      };
    },
    [deleteCustomFieldSucceed](
      state,
      {
        payload: { uId }
      }
    ) {
      return {
        customFields: state.customFields.filter(x => x.uid !== uId),
        loading: false,
        error: null
      };
    },
    [deleteCustomFieldFailed](
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
    [updateCustomField](state) {
      return {
        ...state,
        loading: true,
        error: null
      };
    },
    [updateCustomFieldSucceed](
      state,
      {
        payload: { uId, data }
      }
    ) {
      return {
        customFields: state.customFields.map(
          x => (x.uid == uId ? { ...data } : x)
        ),
        loading: false,
        error: null
      };
    },
    [updateCustomFieldFailed](
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
