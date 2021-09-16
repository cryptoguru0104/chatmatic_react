import { handleActions } from 'redux-actions';

import {
    getPageCampaigns,
    getPageCampaignsSucceed,
    getPageCampaignsFailed,
    deleteCampaign,
    deleteCampaignSucceed,
    deleteCampaignFailed,
    getCampaignInfo,
    getCampaignInfoSucceed,
    getCampaignInfoFailed,
    toggleTriggerActive,
    toggleTriggerActiveSucceed,
    toggleTriggerActiveFailed
} from './campaignsActions';

const defaultState = {
    loading: false,
    error: null,
    campaigns: [],
    campaignFromPublicId: {}
};

const reducer = handleActions(
    {
        [getPageCampaigns](state) {
            return {
                ...state,
                error: null,
                loading: true
            };
        },
        [getPageCampaignsSucceed](state, { payload: { campaigns } }) {
            return {
                ...state,
                error: null,
                loading: false,
                campaigns
            };
        },
        [getPageCampaignsFailed](state, { payload: { error } }) {
            return {
                ...state,
                error,
                loading: false
            };
        },
        [deleteCampaign](state) {
            return {
                ...state,
                loading: true,
                error: null
            };
        },
        [deleteCampaignSucceed](state, { payload: { campaignId } }) {
            const campaigns = state.campaigns.filter(
                campaign => campaign.uid !== campaignId
            );

            return {
                ...state,
                campaigns,
                loading: false,
                error: null
            };
        },
        [deleteCampaignFailed](state, { payload: { error } }) {
            return {
                ...state,
                loading: false,
                error
            };
        },
        [getCampaignInfo](state) {
            return {
                ...state,
                campaignFromPublicId: {},
                error: null,
                loading: true
            };
        },
        [getCampaignInfoSucceed](state, { payload: { campaign } }) {
            return {
                ...state,
                error: null,
                loading: false,
                campaignFromPublicId: campaign
            };
        },
        [getCampaignInfoFailed](state, { payload: { error } }) {
            return {
                ...state,
                error,
                loading: false
            };
        },
        [toggleTriggerActive](state, { payload: { pageId, triggerId } }) {
            return {
                ...state,
            };
        },
        [toggleTriggerActiveSucceed](state, { payload: { data } }) {
            const targetIndex = state.campaigns.findIndex(
                campaign => campaign.uid == data.triggerId
            );

            const campaigns = [...state.campaigns];
            campaigns[targetIndex].active = !campaigns[targetIndex].active;

            return {
                ...state,
                campaigns,
                loading: false,
                error: null
            };
            return {
                ...state,
            };
        },
        [toggleTriggerActiveFailed](state, { payload: { error } }) {
            return {
                ...state,
                error,
                loading: false
            };
        }
    },
    defaultState
);

export default reducer;
