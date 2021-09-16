import { handleActions } from 'redux-actions';

import {
    createCampaign,
    updateNewCampaignInfo,
    updateCampaignInfo,
    addCampaign,
    addCampaignSucceed,
    addCampaignFailed,
    updateCampaign,
    updateCampaignSucceed,
    updateCampaignFailed,
    clearCampaignAddState,
} from './actions';

const defaultState = {
    campaignAdd: {},
    loading: false,
    error: null
};

const reducer = handleActions(
    {
        [createCampaign](state, { payload: { type, pageId } }) {
            return {
                campaignAdd: {
                    type,
                    pageId
                },
                loading: false,
                error: null
            };
        },
        [updateCampaignInfo](state, { payload: { data } }) {
            return {
                ...state,
                campaignAdd: data
            };
        },
        [updateNewCampaignInfo](
            state,
            { payload: { pageId, data, isPostUpdate } }
        ) {
            return {
                ...state,
                campaignAdd: {
                    // ...state.campaignAdd,
                    ...data
                }
            };
        },
        [addCampaign](state) {
            return {
                ...state,
                loading: true,
                error: null
            };
        },
        [addCampaignSucceed](state, { payload: { data } }) {
            console.log('data', data);
            return {
                ...state,
                loading: false,
                campaignAdd: {
                    ...state.campaignAdd,
                    ...data
                }
            };
        },
        [addCampaignFailed](state, { payload: { error } }) {
            return {
                ...state,
                loading: false,
                error
            };
        },
        [updateCampaign](state) {
            return {
                ...state,
                loading: true,
                error: null
            };
        },
        [updateCampaignSucceed](state, { payload: { data } }) {
            return {
                ...state,
                loading: false,
                campaignAdd: {
                    ...state.campaignAdd,
                    ...data
                }
            };
        },
        [updateCampaignFailed](state, { payload: { error } }) {
            return {
                ...state,
                loading: false,
                error
            };
        },
        [clearCampaignAddState](state) {
            return {
                ...state,
                campaignAdd: {}
            };
        }
    },
    defaultState
);

export default reducer;
