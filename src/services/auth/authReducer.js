import { handleActions } from 'redux-actions';
import LogRocket from 'logrocket';

import {
  loginSucceed,
  logout,
  getAuthInfo,
  getAuthInfoSucceed,
  getAuthInfoFailed,
  getUserCards,
  getUserCardsSucceed,
  getUserCardsFailed,
  getUser,
  getApiToken
} from './authActions';

import {
  storeCurrentUser,
  storeApiToken,
  getStoredApiToken,
  getStoredUser,
  removeStoredUser,
  removeStoredApiToken
} from './services';

const defaultState = {
  currentUser: null,
  error: null,
  loading: false,
  apiToken: null,
  userId: null,
  longToken: null,
  stripeSources: []
};

const reducer = handleActions(
  {
    [loginSucceed](
      state,
      {
        payload: { response }
      }
    ) {
      return {
        ...state,
        userId: response.userID,
        longToken: response.accessToken,
        sumoUserId: response.sumoUserId
      };
    },
    [logout](state) {
      removeStoredUser();
      removeStoredApiToken();

      return {
        ...state,
        currentUser: null,
        apiToken: null
      };
    },
    [getAuthInfo](state) {
      return {
        ...state,
        loading: true,
        error: false
      };
    },
    [getAuthInfoSucceed](
      state,
      {
        payload: { authInfo, redirectUrl }
      }
    ) {
      const currentUserInfo = {
        facebookName: authInfo.facebookName,
        facebookEmail: authInfo.facebookEmail,
        facebookProfileImage: authInfo.facebookProfileImage,
        userId: authInfo.userId
      };
      storeCurrentUser(currentUserInfo);
      storeApiToken(authInfo.accessToken);

      window.location.href = redirectUrl;

      return {
        ...state,
        loading: false,
        currentUser: currentUserInfo,
        apiToken: authInfo.accessToken
      };
    },
    [getAuthInfoFailed](
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
    [getUserCards](state) {
      return {
        ...state,
        loading: true,
        error: false,
        stripeSources: null
      };
    },
    [getUserCardsSucceed](
      state,
      {
        payload: { stripeSources }
      }
    ) {

      return {
        ...state,
        loading: false,
        stripeSources
      };
    },
    [getUserCardsFailed](
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
    [getUser](state) {
      let user = getStoredUser();
      const email = (user && user.facebookEmail) || '';
      LogRocket.identify(email, {
        name: (user && user.facebookName) || '',
        email: email
      });

      return {
        ...state,
        currentUser: user
      };
    },
    [getApiToken](state) {
      return {
        ...state,
        apiToken: getStoredApiToken()
      };
    }
  },
  defaultState
);

export default reducer;
