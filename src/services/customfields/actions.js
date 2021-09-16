import { createActions } from 'redux-actions';

const {
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
} = createActions({
  GET_CUSTOM_FIELDS: pageId => ({ pageId }),
  GET_CUSTOM_FIELDS_SUCCEED: customFields => ({ customFields }),
  GET_CUSTOM_FIELDS_FAILED: error => ({ error }),

  GET_CUSTOM_FIELD_SUBSCRIBERS: (pageId, uId) => ({ pageId, uId }),
  GET_CUSTOM_FIELD_SUBSCRIBERS_SUCCEED: subscribers => ({ subscribers }),
  GET_CUSTOM_FIELD_SUBSCRIBERS_FAILED: error => ({ error }),

  ADD_CUSTOM_FIELD: (pageId, value) => ({ pageId, value }),
  ADD_CUSTOM_FIELD_SUCCEED: customField => ({ customField }),
  ADD_CUSTOM_FIELD_FAILED: error => ({ error }),

  DELETE_CUSTOM_FIELD: (pageId, uId) => ({ pageId, uId }),
  DELETE_CUSTOM_FIELD_SUCCEED: uId => ({ uId }),
  DELETE_CUSTOM_FIELD_FAILED: error => ({ error }),

  UPDATE_CUSTOM_FIELD: (pageId, uId, data) => ({ pageId, uId, data }),
  UPDATE_CUSTOM_FIELD_SUCCEED: (uId, data) => ({ uId, data }),
  UPDATE_CUSTOM_FIELD_FAILED: error => ({ error })
});

export {
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
};
