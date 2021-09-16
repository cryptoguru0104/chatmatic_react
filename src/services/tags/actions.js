import { createActions } from 'redux-actions';

const {
  getTags,
  getTagsSucceed,
  getTagsFailed,

  getTagSubscribers,
  getTagSubscribersSucceed,
  getTagSubscribersFailed,

  addTag,
  addTagSucceed,
  addTagFailed,

  deleteTag,
  deleteTagSucceed,
  deleteTagFailed
} = createActions({
  GET_TAGS: pageId => ({ pageId }),
  GET_TAGS_SUCCEED: tags => ({ tags }),
  GET_TAGS_FAILED: error => ({ error }),

  GET_TAG_SUBSCRIBERS: (pageId, tagId) => ({ pageId, tagId }),
  GET_TAG_SUBSCRIBERS_SUCCEED: subscribers => ({ subscribers }),
  GET_TAG_SUBSCRIBERS_FAILED: error => ({ error }),

  GET_TAGS: pageId => ({ pageId }),
  GET_TAGS_SUCCEED: tags => ({ tags }),
  GET_TAGS_FAILED: error => ({ error }),

  ADD_TAG: (pageId, value) => ({ pageId, value }),
  ADD_TAG_SUCCEED: (uid, value) => ({ uid, value }),
  ADD_TAG_FAILED: error => ({ error }),

  DELETE_TAG: (pageId, tagId) => ({ pageId, tagId }),
  DELETE_TAG_SUCCEED: tagId => ({ tagId }),
  DELETE_TAG_FAILED: error => ({ error })
});

export {
  getTags,
  getTagsSucceed,
  getTagsFailed,
  getTagSubscribers,
  getTagSubscribersSucceed,
  getTagSubscribersFailed,
  addTag,
  addTagSucceed,
  addTagFailed,
  deleteTag,
  deleteTagSucceed,
  deleteTagFailed
};
