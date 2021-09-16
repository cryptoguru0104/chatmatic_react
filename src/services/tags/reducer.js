import { handleActions } from 'redux-actions';

import {
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
} from './actions';

const defaultState = {
  error: null,
  loading: false,
  tags: [],
  subscribers: []
};

const reducer = handleActions(
  {
    [getTags](state) {
      return {
        error: null,
        loading: true,
        tags: []
      };
    },
    [getTagsSucceed](
      state,
      {
        payload: { tags }
      }
    ) {
      return {
        tags,
        loading: false,
        error: null
      };
    },
    [getTagsFailed](
      state,
      {
        payload: { error }
      }
    ) {
      return {
        ...state,
        tags: [],
        loading: false,
        error
      };
    },
    [getTagSubscribers](state) {
      return {
        ...state,
        error: null,
        loading: true,
        subscribers: []
      };
    },
    [getTagSubscribersSucceed](
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
    [getTagSubscribersFailed](
      state,
      {
        payload: { error }
      }
    ) {
      return {
        subscribers: [],
        loading: false,
        error
      };
    },
    [addTag](state) {
      return {
        ...state,
        loading: true,
        error: null
      };
    },
    [addTagSucceed](
      state,
      {
        payload: { uid, value }
      }
    ) {
      const tags = state.tags.concat([{ uid, value }]);

      return {
        tags,
        loading: false,
        error: null
      };
    },
    [addTagFailed](
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
    [deleteTag](state) {
      return {
        ...state,
        loading: true,
        error: null
      };
    },
    [deleteTagSucceed](
      state,
      {
        payload: { tagId }
      }
    ) {
      const tags = state.tags.filter(tag => tag.uid !== tagId);

      return {
        tags,
        loading: false,
        error: null
      };
    },
    [deleteTagFailed](
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
