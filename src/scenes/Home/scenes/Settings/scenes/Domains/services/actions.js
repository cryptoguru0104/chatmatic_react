import { createActions } from 'redux-actions';
const {
    getDomains,
    getDomainsSucceed,
    getDomainsFailed,
    updateDomains,
    updateDomainsSucceed,
    updateDomainsFailed
} = createActions({
    GET_DOMAINS: pageId => ({ pageId }),
    GET_DOMAINS_SUCCEED: urls => ({ urls }),
    GET_DOMAINS_FAILED: error => ({ error }),
    UPDATE_DOMAINS: (pageId, urls) => ({ pageId, urls }),
    UPDATE_DOMAINS_SUCCEED: urls => ({ urls }),
    UPDATE_DOMAINS_FAILED: error => ({ error })
});

export {
    getDomains,
    getDomainsSucceed,
    getDomainsFailed,
    updateDomains,
    updateDomainsSucceed,
    updateDomainsFailed
};
