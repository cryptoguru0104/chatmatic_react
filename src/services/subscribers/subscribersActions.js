import { createActions } from 'redux-actions';

const {
  clearPageSubscribers,
  getPageSubscribers,
  getPageSubscribersBroadcastCount,
  getPageSubscribersBroadcastCountSucceed,
  getPageSubscribersSucceed,
  getPageSubscribersFailed,
  getSubscribersHistory,
  getSubscribersHistorySucceed,
  getSubscribersHistoryFailed,
  updateActiveSubscriber,
  updateActiveSubscriberSucceed,
  updateActiveSubscriberFailed,
  getSubscriberInfo,
  getSubscriberInfoSucceed,
  getSubscriberInfoFailed,
  updateSubscriberInfo,
  updateSubscriberInfoSucceed,
  updateSubscriberInfoFailed,
  getExportSubscribers,
  getExportSubscribersSucceed,
  getExportSubscribersFailed,
  updateCustomFieldResponse,
  updateCustomFieldResponseSucceed,
  updateCustomFieldResponseFailed,
} = createActions({
  CLEAR_PAGE_SUBSCRIBERS: () => ({}),
  GET_PAGE_SUBSCRIBERS: (
    pageId,
    extended = false,
    search_params = null,
    page = 1,
    per_page = 100
  ) => ({ pageId, extended, search_params, page, per_page }),
  GET_PAGE_SUBSCRIBERS_BROADCAST_COUNT: (pageId, broadcast_type, filters) => ({
    pageId,
    broadcast_type,
    filters
  }),
  GET_PAGE_SUBSCRIBERS_BROADCAST_COUNT_SUCCEED: ({ count }) => ({
    broadCastSubscribersCount: count
  }),
  GET_PAGE_SUBSCRIBERS_SUCCEED: subscribersPaging => ({
    subscribers: subscribersPaging.data,
    paging: subscribersPaging.meta
  }),
  GET_PAGE_SUBSCRIBERS_FAILED: error => ({ error }),
  GET_SUBSCRIBERS_HISTORY: (pageId, recentDays) => ({ pageId, recentDays }),
  GET_SUBSCRIBERS_HISTORY_SUCCEED: subscribersHistory => ({
    subscribersHistory
  }),
  GET_SUBSCRIBERS_HISTORY_FAILED: error => ({ error }),
  UPDATE_ACTIVE_SUBSCRIBER: (pageId, subscriberId, activeStatus) => ({
    pageId,
    subscriberId,
    activeStatus
  }),
  UPDATE_ACTIVE_SUBSCRIBER_SUCCEED: (subscriberId, activeStatus) => ({
    subscriberId,
    activeStatus
  }),
  UPDATE_ACTIVE_SUBSCRIBER_FAILED: error => ({ error }),
  GET_SUBSCRIBER_INFO: (pageId, subscriberId) => ({ pageId, subscriberId }),
  GET_SUBSCRIBER_INFO_SUCCEED: (subscriberId, data) => ({ subscriberId, data }),
  GET_SUBSCRIBER_INFO_FAILED: error => ({ error }),
  UPDATE_SUBSCRIBER_INFO: (pageId, subscriberId, data) => ({
    pageId,
    subscriberId,
    data
  }),
  UPDATE_SUBSCRIBER_INFO_SUCCEED: (subscriberId, data) => ({
    subscriberId,
    data
  }),
  UPDATE_SUBSCRIBER_INFO_FAILED: error => ({ error }),
  GET_EXPORT_SUBSCRIBERS: pageId => ({ pageId }),
  GET_EXPORT_SUBSCRIBERS_SUCCEED: subscribers => ({ subscribers }),
  GET_EXPORT_SUBSCRIBERS_FAILED: error => ({ error }),
  UPDATE_CUSTOM_FIELD_RESPONSE: (pageId, subscriberId, customFieldId, response) => ({pageId, subscriberId, customFieldId, response}),
  UPDATE_CUSTOM_FIELD_RESPONSE_SUCCEED: (pageId, subscriberId, customFieldId, response) => ({pageId, subscriberId, customFieldId, response}),
  UPDATE_CUSTOM_FIELD_RESPONSE_FAILED: error => ({ error })
});

export {
  clearPageSubscribers,
  getPageSubscribers,
  getPageSubscribersBroadcastCount,
  getPageSubscribersBroadcastCountSucceed,
  getPageSubscribersSucceed,
  getPageSubscribersFailed,
  getSubscribersHistory,
  getSubscribersHistorySucceed,
  getSubscribersHistoryFailed,
  updateActiveSubscriber,
  updateActiveSubscriberSucceed,
  updateActiveSubscriberFailed,
  getSubscriberInfo,
  getSubscriberInfoSucceed,
  getSubscriberInfoFailed,
  updateSubscriberInfo,
  updateSubscriberInfoSucceed,
  updateSubscriberInfoFailed,
  getExportSubscribers,
  getExportSubscribersSucceed,
  getExportSubscribersFailed,
  updateCustomFieldResponse,
  updateCustomFieldResponseSucceed,
  updateCustomFieldResponseFailed,
};
