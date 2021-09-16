import { createActions } from 'redux-actions';

const {
  getUserProfile,
  getUserProfileSucceed,
  getUserProfileFailed,
  saveUserInfo,
  getUserFollowInfo,
  getUserFollowInfoSucceed,
  getUserFollowInfoFailed,
  followUser,
  followUserFailed,
  getUserTemplateInfo,
  getUserTemplateInfoSucceed,
  getUserTemplateInfoFailed,
  getUserSalesInfo,
  getUserSalesInfoSucceed,
  getUserSalesInfoFailed
} = createActions({
  GET_USER_PROFILE: (userId) => ({
    userId
  }),
  GET_USER_PROFILE_SUCCEED: (data) => ({
    data
  }),
  GET_USER_PROFILE_FAILED: (error) => ({
    error
  }),
  SAVE_USER_INFO: (userId, userInfo) => ({
    userId, userInfo
  }),
  GET_USER_FOLLOW_INFO: (userId) => ({
    userId    
  }),
  GET_USER_FOLLOW_INFO_SUCCEED: (followInfo) => ({
    followInfo
  }),
  GET_USER_FOLLOW_INFO_FAILED: (error) => ({
    error
  }),
  FOLLOW_USER: (userId) => ({
    userId
  }),
  FOLLOW_USER_FAILED: (error) => ({
    error
  }),
  GET_USER_TEMPLATE_INFO: (userId) => ({
    userId
  }),
  GET_USER_TEMPLATE_INFO_SUCCEED: (templateInfo) => ({
    templateInfo
  }),
  GET_USER_TEMPLATE_INFO_FAILED: (error) => ({
    error
  }),
  GET_USER_SALES_INFO: (userId) => ({
    userId
  }),
  GET_USER_SALES_INFO_SUCCEED: (salesInfo) => ({
    salesInfo
  }),
  GET_USER_SALES_INFO_FAILED: (error) => ({
    error
  })
});

export {
  getUserProfile,
  getUserProfileSucceed,
  getUserProfileFailed,
  saveUserInfo,
  getUserFollowInfo,
  getUserFollowInfoSucceed,
  getUserFollowInfoFailed,
  followUser,
  followUserFailed,
  getUserTemplateInfo,
  getUserTemplateInfoSucceed,
  getUserTemplateInfoFailed,
  getUserSalesInfo,
  getUserSalesInfoSucceed,
  getUserSalesInfoFailed
}