import { wrapRequest, xapi } from 'services/utils';

const getDomains = wrapRequest(async pageId =>
    xapi(false).get(`pages/${pageId}/domains`)
);

const updateDomains = wrapRequest(async (pageId, urls) =>
    xapi(false).post(`pages/${pageId}/domains`, {
        urls
    })
);

export { getDomains, updateDomains };
