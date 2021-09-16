import { wrapRequest, xapi, snakeCaseKeys } from 'services/utils';

const addCampaign = wrapRequest(async (pageId, campaign) =>
    xapi(false).post(`pages/${pageId}/workflow-triggers`, {
        ...snakeCaseKeys(campaign)
    })
);

const updateCampaign = wrapRequest(async (pageId, campaign) =>
    xapi(false).patch(`pages/${pageId}/workflow-triggers/${campaign.uid}`, {
        ...snakeCaseKeys(campaign)
    })
);
export { addCampaign, updateCampaign };
