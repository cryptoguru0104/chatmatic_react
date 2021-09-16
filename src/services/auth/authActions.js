import { createActions } from 'redux-actions';

const {
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
} = createActions({
  LOGIN_SUCCEED: response => ({ response }),
  LOGOUT: () => ({}),
  GET_AUTH_INFO: (redirectUrl) => ({ redirectUrl }),
  GET_AUTH_INFO_SUCCEED: (authInfo, redirectUrl) => ({ authInfo, redirectUrl }),
  GET_AUTH_INFO_FAILED: error => ({ error }),
  GET_USER_CARDS: () => ({}),
  GET_USER_CARDS_SUCCEED: stripeSources   => ({ stripeSources }),
  GET_USER_CARDS_FAILED: error => ({ error }),
  GET_USER: () => ({}),
  GET_API_TOKEN: () => ({})
});

export {
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
};
