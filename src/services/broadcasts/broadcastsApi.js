import { wrapRequest, xapi, snakeCaseKeys } from '../utils';

const getPageBroadcasts = wrapRequest(async pageId =>
    xapi(false).get(`pages/${pageId}/broadcasts`)
);

const addBroadcast = wrapRequest(async (pageId, broadcast) =>
    xapi(false).post(`pages/${pageId}/broadcasts`, {
        ...snakeCaseKeys(broadcast)
    })
);

const updateBroadcast = wrapRequest(async (pageId, broadcastId) =>
    xapi(false).patch(`pages/${pageId}/broadcasts/${broadcastId}`)
);

const deleteBroadcast = wrapRequest(async (pageId, broadcastId) =>
    xapi(false).delete(`pages/${pageId}/broadcasts/${broadcastId}`)
);

const getEligibleSubscribers = wrapRequest(async (pageId, broadcastType, conditions) =>
    xapi(false).post(`pages/${pageId}/broadcasts/subscriber-count`, { 
        params: {
            broadcast_type: broadcastType, 
            filters: conditions 
        }
    })
);


export { getPageBroadcasts, addBroadcast, updateBroadcast, deleteBroadcast, getEligibleSubscribers };
