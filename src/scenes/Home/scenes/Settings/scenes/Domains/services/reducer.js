import { handleActions } from 'redux-actions';

import {
    getDomains,
    getDomainsSucceed,
    getDomainsFailed,
    updateDomains,
    updateDomainsSucceed,
    updateDomainsFailed
} from './actions';

const defaultState = {
    error: null,
    loading: false,
    urls: []
};

const reducer = handleActions(
    {
        [getDomains](state) {
            return {
                error: null,
                loading: true,
                urls: []
            };
        },
        [getDomainsSucceed](state, { payload: { urls } }) {
            return {
                ...state,
                urls,
                loading: false,
                error: null
            };
        },
        [getDomainsFailed](state, { payload: { error } }) {
            return {
                ...state,
                loading: false,
                error
            };
        },
        [updateDomains](state) {
            return { ...state, loading: true, error: null };
        },
        [updateDomainsSucceed](state, { payload: { urls } }) {
            return {
                ...state,
                urls,
                loading: false,
                error: null
            };
        },
        [updateDomainsFailed](state, { payload: { error } }) {
            return {
                ...state,
                loading: false,
                error
            };
        }
    },
    defaultState
);

export default reducer;
