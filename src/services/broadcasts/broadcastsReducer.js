import { handleActions } from 'redux-actions';

import {
    getPageBroadcasts,
    getPageBroadcastsSucceed,
    getPageBroadcastsFailed,
    deleteBroadcast,
    deleteBroadcastSucceed,
    deleteBroadcastFailed,
    addBroadcast,
    addBroadcastSucceed,
    addBroadcastFailed,
    clearNewBroadcastCondition,
    updateNewBroadcastConditionCustomFields,
    updateNewBroadcastConditionTags,
    updateNewBroadcastConditionTriggers,
    getEligibleSubscribers,
    getEligibleSubscribersSucceed,
    getEligibleSubscribersFailed,
} from './broadcastsActions';

const defaultState = {
    loading: false,
    error: null,
    broadcasts: [],
    uid: null,
    // broadcastFromPublicId: {},
    newBroadcastConditionCustomFields: [],
    newBroadcastConditionTags: [],
    newBroadcastConditionTriggers: [],
    eligibleSubscribersCount: 0,
};

const reducer = handleActions(
    {
        [getPageBroadcasts](state) {
            return {
                ...state,
                error: null,
                loading: true
            };
        },
        [getPageBroadcastsSucceed](state, { payload: { broadcasts } }) {
            return {
                ...state,
                error: null,
                loading: false,
                broadcasts
            };
        },
        [getPageBroadcastsFailed](state, { payload: { error } }) {
            return {
                ...state,
                error,
                loading: false
            };
        },
        [deleteBroadcast](state) {
            return {
                ...state,
                loading: true,
                error: null
            };
        },
        [deleteBroadcastSucceed](state, { payload: { broadcastId } }) {
            const broadcasts = state.broadcasts.filter(
                broadcast => broadcast.uid !== broadcastId
            );

            return {
                ...state,
                broadcasts,
                loading: false,
                error: null
            };
        },
        [deleteBroadcastFailed](state, { payload: { error } }) {
            return {
                ...state,
                loading: false,
                error
            };
        },
        [addBroadcast](state) {
            return {
                ...state,
                loading: true,
                error: null
            };
        },
        [addBroadcastSucceed](state, { payload: { broadcastId } }) {
            // const broadcasts = state.broadcasts.filter(
            //     broadcast => broadcast.uid !== broadcastId
            // );

            return {
                ...state,
                uid: broadcastId,
                loading: false,
                error: null
            };
        },
        [addBroadcastFailed](state, { payload: { error } }) {
            return {
                ...state,
                loading: false,
                error
            };
        },
        [clearNewBroadcastCondition](state) {
            return {
                ...state,
                newBroadcastConditionCustomFields: [],
                newBroadcastConditionTags: [],
                newBroadcastConditionTriggers: []
            }
        },
        [updateNewBroadcastConditionCustomFields](state, { payload: { customFields }}) {
            return {
                ...state,
                newBroadcastConditionCustomFields: customFields
            }
        },
        [updateNewBroadcastConditionTags](state, { payload: { tags }}) {
            return {
                ...state,
                newBroadcastConditionTags: tags
            }
        },
        [updateNewBroadcastConditionTriggers](state, { payload: { triggers }}) {
            return {
                ...state,
                newBroadcastConditionTriggers: triggers
            }
        },
        [getEligibleSubscribers](state, { payload: { pageId, broadcastType, conditions }}) {
            return {
                ...state,
                error: null
            };
        },
        [getEligibleSubscribersSucceed](state, { payload: { subscribersCount }}) {
            return {
                ...state,
                error: null,
                eligibleSubscribersCount: subscribersCount
            };
        },
        [getEligibleSubscribersFailed](state, { payload: { error }}) {
            return {
                ...state,
                error,
                eligibleSubscribersCount: 0
            };
        },
        // [getBroadcastInfo](state) {
        //     return {
        //         ...state,
        //         broadcastFromPublicId: {},
        //         error: null,
        //         loading: true
        //     };
        // },
        // [getBroadcastInfoSucceed](state, { payload: { broadcast } }) {
        //     return {
        //         ...state,
        //         error: null,
        //         loading: false,
        //         broadcastFromPublicId: broadcast
        //     };
        // },
        // [getBroadcastInfoFailed](state, { payload: { error } }) {
        //     return {
        //         ...state,
        //         error,
        //         loading: false
        //     };
        // }
    },
    defaultState
);

export default reducer;
