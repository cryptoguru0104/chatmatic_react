import { handleActions } from "redux-actions";

import {
    getUserProfile,
    getUserProfileSucceed,
    getUserProfileFailed,
    saveUserInfo,
    getUserFollowInfo,
    getUserFollowInfoSucceed,
    getUserFollowInfoFailed,
    followUserFailed,
    getUserTemplateInfo,
    getUserTemplateInfoSucceed,
    getUserTemplateInfoFailed,
    getUserSalesInfo,
    getUserSalesInfoSucceed,
    getUserSalesInfoFailed
} from "./actions";

const defaultState = {
    userProfile: null,
    followInfo: {},
    templateInfo: null,
    salesInfo: null,
    loading: false,
    error: null
};

const reducer = handleActions(
    {
        [getUserProfile](state) {
            return { ...state, loading: true, error: null };
        },
        [getUserProfileSucceed](state, { payload: { data } }) {
            return { ...state, userProfile: { ...state.userProfile, ...data } };
        },
        [getUserProfileFailed](state, { payload: { error } }) {
            return { ...state, loading: false, error };
        },
        [saveUserInfo](state) {
            return { ...state, loading: true, error: null };
        },
        [getUserFollowInfo](state) {
            return { ...state, loading: true, error: null };
        },
        [getUserFollowInfoSucceed](state, { payload: { followInfo } }) {
            return { ...state, followInfo: { ...followInfo } };
        },
        [getUserFollowInfoFailed](state, { payload: { error } }) {
            return { ...state, error };
        },
        [followUserFailed](state, { payload: { error } }) {
            return { ...state, error };
        },
        [getUserTemplateInfo](state) {
            return { ...state, loading: true, error: null };
        },
        [getUserTemplateInfoSucceed](state, { payload: { templateInfo } }) {
            return { ...state, templateInfo };
        },
        [getUserTemplateInfoFailed](state, { payload: { error } }) {
            return { ...state, error };
        },
        [getUserSalesInfo](state) {
            return { ...state, loading: true, error: null };
        },
        [getUserSalesInfoSucceed](state, { payload: { salesInfo } }) {
            return { ...state, salesInfo };
        },
        [getUserSalesInfoFailed](state, { payload: { error } }) {
            return { ...state, error };
        }
    },
    defaultState
);

export default reducer;
