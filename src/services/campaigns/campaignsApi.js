import { wrapRequest, xapi } from '../utils';

const getPageCampaigns = wrapRequest(async pageId =>
    xapi(false).get(`pages/${pageId}/workflow-triggers`)
);

const deleteCampaign = wrapRequest(async (pageId, campaignId) =>
    xapi(false).delete(`pages/${pageId}/workflow-triggers/${campaignId}`)
);

const getCampaignInfo = wrapRequest(async publicId =>
    xapi(false).get(`triggers/${publicId}`)
);

const toggleTriggerActive = wrapRequest(async (pageId, triggerId) =>
    xapi(false).patch(`pages/${pageId}/workflow-triggers/${triggerId}/toggle`, {})
)

export { getPageCampaigns, deleteCampaign, getCampaignInfo, toggleTriggerActive };
