import { createActions } from 'redux-actions';

const {
  createCampaign,
  updateNewCampaignInfo,
  addCampaign,
  addCampaignSucceed,
  addCampaignFailed,
  clearCampaignAddState
} = createActions({
  CREATE_CAMPAIGN: (type, pageId) => ({ type, pageId }),
  UPDATE_NEW_CAMPAIGN_INFO: (pageId, data, isPostUpdate) => ({
    pageId,
    data,
    isPostUpdate
  }),
  ADD_CAMPAIGN: () => ({}),
  ADD_CAMPAIGN_SUCCEED: data => ({ data }),
  ADD_CAMPAIGN_FAILED: error => ({ error }),
  CLEAR_CAMPAIGN_ADD_STATE: () => ({})
});

export {
  createCampaign,
  updateNewCampaignInfo,
  addCampaign,
  addCampaignSucceed,
  addCampaignFailed,
  clearCampaignAddState
};
