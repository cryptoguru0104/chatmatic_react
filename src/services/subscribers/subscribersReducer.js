import { handleActions } from 'redux-actions';
import { convertObjectKeyToCamelCase } from '../utils';
import {
  clearPageSubscribers,
  getPageSubscribers,
  getPageSubscribersBroadcastCount,
  getPageSubscribersBroadcastCountSucceed,
  getPageSubscribersFailed,
  getPageSubscribersSucceed,
  getSubscribersHistory,
  getSubscribersHistorySucceed,
  getSubscribersHistoryFailed,
  updateActiveSubscriberSucceed,
  updateActiveSubscriberFailed,
  getSubscriberInfo,
  getSubscriberInfoSucceed,
  getSubscriberInfoFailed,
  updateSubscriberInfoSucceed,
  updateSubscriberInfoFailed,
  getExportSubscribers,
  getExportSubscribersSucceed,
  getExportSubscribersFailed,
  updateCustomFieldResponse,
  updateCustomFieldResponseSucceed,
  updateCustomFieldResponseFailed,
} from './subscribersActions';

const defaultState = {
  broadCastSubscribersCount: 0,
  subscribers: [],
  loading: false,
  error: null,
  paging: null,
  subscribersHistory: [],
  activeSubscriberId: null,
  loadingExportSubscribers: false,
  exportSubscribers: []
};

const reducer = handleActions(
  {
    [clearPageSubscribers](state) {
      return {
        ...state,
        paging: null,
        activeSubscriberId: null,
        subscribers: []
      };
    },
    [getPageSubscribers](state) {
      return {
        ...state,
        loading: true,
        error: null
      };
    },
    [getPageSubscribersBroadcastCount](state) {
      return {
        ...state,
        broadCastSubscribersCount: 0,
        loading: true,
        error: null
      };
    },
    [getPageSubscribersBroadcastCountSucceed](
      state,
      {
        payload: { broadCastSubscribersCount }
      }
    ) {
      return {
        ...state,
        broadCastSubscribersCount,
        loading: false,
        error: null
      };
    },
    [getPageSubscribersFailed](
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
    [getPageSubscribersSucceed](
      state,
      {
        payload: { subscribers, paging }
      }
    ) {
      return {
        ...state,
        paging,
        subscribers: paging.currentPage == 1 ? subscribers : [...state.subscribers, ...subscribers],
        loading: false,
        error: null
      };
    },
    [getSubscribersHistory](state) {
      return {
        ...state,
        loading: true,
        error: null
      };
    },
    [getSubscribersHistorySucceed](
      state,
      {
        payload: { subscribersHistory }
      }
    ) {
      return {
        ...state,
        subscribersHistory,
        loading: false,
        error: null
      };
    },
    [getSubscribersHistoryFailed](
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
    [updateActiveSubscriberSucceed](
      state,
      {
        payload: { subscriberId, activeStatus }
      }
    ) {
      return {
        ...state,
        activeSubscriberId: activeStatus ? subscriberId : null
      };
    },
    [updateActiveSubscriberFailed](
      state,
      {
        payload: { error }
      }
    ) {
      return {
        ...state,
        error
      };
    },
    [getSubscriberInfo](state) {
      return {
        ...state,
        loading: true,
        error: null
      };
    },
    [getSubscriberInfoSucceed](
      state,
      {
        payload: { subscriberId, data }
      }
    ) {
      const subscribers = state.subscribers.map(subscriber => {
        if (subscriber.uid !== subscriberId) return subscriber;

        return {
          ...subscriber,
          ...data
        };
      });

      return {
        ...state,
        subscribers,
        loading: false,
        error: null
      };
    },
    [getSubscriberInfoFailed](
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
    [updateSubscriberInfoSucceed](
      state,
      {
        payload: { subscriberId, data }
      }
    ) {
      const subscribers = state.subscribers.map(subscriber => {
        if (subscriber.uid !== subscriberId) return subscriber;

        return {
          ...subscriber,
          ...convertObjectKeyToCamelCase(data)
        };
      });

      return {
        ...state,
        subscribers
      };
    },
    [updateSubscriberInfoFailed](
      state,
      {
        payload: { error }
      }
    ) {
      return {
        ...state,
        error
      };
    },
    [getExportSubscribers](state) {
      return {
        ...state,
        loadingExportSubscribers: true,
        error: null
      };
    },
    [getExportSubscribersFailed](
      state,
      {
        payload: { error }
      }
    ) {
      return {
        ...state,
        loadingExportSubscribers: false,
        error
      };
    },
    [getExportSubscribersSucceed](
      state,
      {
        payload: { subscribers }
      }
    ) {
      return {
        ...state,
        exportSubscribers: subscribers,
        loadingExportSubscribers: false,
        error: null
      };
    },
    [updateCustomFieldResponse](
      state,
      {
        payload: { pageId, subscriberId, customFieldId, response}
      }
    ) {
      return {
        ...state,
        loading: true,
        error: null
      };
    },
    [updateCustomFieldResponseSucceed](
      state,
      {
        payload: { pageId, subscriberId, customFieldId, response}
      }
    ) {
      return {
        ...state,
        error: null,
        loading: false,
        subscribers: state.subscribers.map(subscriber => 
          subscriber.uid == subscriberId ?  
          {...subscriber, 
            customFields: subscriber.customFields.map(custom_field =>
              custom_field.customFieldUid == customFieldId ? 
              { ...custom_field, response: response}
              : custom_field)} 
          : subscriber)
      };
    },
    [updateCustomFieldResponseFailed](
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
  },
  defaultState
);

export default reducer;
