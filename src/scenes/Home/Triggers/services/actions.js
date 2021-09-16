import { createActions } from 'redux-actions';

const {
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
} = createActions({
    CREATE_CAMPAIGN: (type, pageId) => ({
        type,
        pageId
    }),
    UPDATE_CAMPAIGN_INFO: data => {
        return {
            data
        };
    },
    UPDATE_NEW_CAMPAIGN_INFO: (pageId, data, isPostUpdate) => {
        return {
            pageId,
            data,
            isPostUpdate
        };
    },
    ADD_CAMPAIGN: () => ({}),
    ADD_CAMPAIGN_SUCCEED: data => ({
        data
    }),
    ADD_CAMPAIGN_FAILED: error => ({
        error
    }),
    UPDATE_CAMPAIGN: (pageId, triggerId, data) => {
        return {
            pageId,
            triggerId,
            data
        };
    },
    UPDATE_CAMPAIGN_SUCCEED: data => ({
        data
    }),
    UPDATE_CAMPAIGN_FAILED: error => ({
        error
    }),
    CLEAR_CAMPAIGN_ADD_STATE: () => ({}),
    TOGGLE_TRIGGER_ACTIVE: (pageId, triggerId) =>({
        pageId,
        triggerId,
    })
});

export {
    createCampaign,
    updateCampaignInfo,
    updateNewCampaignInfo,
    addCampaign,
    addCampaignSucceed,
    addCampaignFailed,
    updateCampaign,
    updateCampaignSucceed,
    updateCampaignFailed,
    clearCampaignAddState,
};
