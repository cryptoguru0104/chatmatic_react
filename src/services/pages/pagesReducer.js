import { handleActions } from "redux-actions";

import {
    getPages,
    getPagesSucceed,
    getPagesFailed,
    getAllPages,
    getAllPagesFailed,
    getAllPagesSucceed,
    getPage,
    getPageSucceed,
    getPageFailed,
    toggleConnect,
    toggleConnectSucceed,
    toggleConnectFailed,
    connectAll,
    connectAllSucceed,
    connectAllFailed,
    getPagePosts,
    getPagePostsSucceed,
    getPagePostsFailed,
    updatePostFailed,
    updatePostSucceed,
    createTrigger,
    createTriggerSucceed,
    createTriggerFailed,
    updateTrigger,
    updateTriggerFailed,
    updateTriggerSucceed,
    toggleMenus,
    toggleMenusSucceed,
    toggleMenusFailed,
    getRecentSubscribers,
    getRecentSubscribersSucceed,
    getRecentSubscribersFailed
} from "./pagesActions";
import { postAppSumoLicenseSucceed } from "scenes/Home/scenes/Settings/scenes/Billing/services/actions";

const defaultState = {
    error: null,
    extApiToken: "",
    isSumoUser: false,
    loading: false,
    pages: [],
    allPages: [],
    loadingMsgTitle: "", // Sweet alert title
    loadingMsgBody: "", // Sweet alert body
    successText: "", // Toastr text
    toggleConnectSucceed: false,
    totalPages: null,
    totalSequences: null,
    totalSubscribers: null,
    totalRecentSubscribers: null,
    updates: [],
    tips: [],
    subscribers: [],
    workflows: [],
    automations: [],
    allPlans: [],
    templates: []
};

const reducer = handleActions(
    {
        [getPages](state) {
            return {
                ...state,
                error: null,
                loading: true,
                loadingMsgTitle: "Please wait...",
                loadingMsgBody: "We are generating a listing of your pages..."
            };
        },

        [getPagesFailed](state, { payload: { error } }) {
            return {
                ...state,
                pages: [],
                error,
                loading: false
            };
        },

        [getPagesSucceed](
            state,
            {
                payload: {
                    availableLicenses,
                    pages,
                    extApiToken,
                    isSumoUser,
                    totalPages,
                    totalSequences,
                    totalSubscribers,
                    totalRecentSubscribers,
                    updates,
                    tips,
                    templates,
                    usedLicenses,
                    plans
                }
            }
        ) {
            return {
                ...state,
                availableLicenses,
                isSumoUser,
                extApiToken,
                pages,
                error: null,
                loading: false,
                totalPages,
                totalSequences,
                totalSubscribers,
                totalRecentSubscribers,
                updates,
                tips,
                templates,
                usedLicenses,
                allPlans: plans
            };
        },

        [getAllPages](state) {
            return {
                ...state,
                error: null,
                loading: true
            };
        },

        [getAllPagesFailed](state, { payload: { error } }) {
            return {
                ...state,
                allPages: [],
                error,
                loading: false
            };
        },

        [getAllPagesSucceed](state, { payload: { pages } }) {
            return {
                ...state,
                allPages: pages,
                error: null,
                loading: false
            };
        },

        [getPage](state) {
            return {
                ...state,
                homeLoading: true,
                homeError: null
            };
        },

        [getPageFailed](state, { payload: { error } }) {
            return {
                ...state,
                homeError: false,
                homeLoading: false
            };
        },

        [getPageSucceed](
            state,
            { payload: { subscribers, workflows, automations } }
        ) {
            return {
                ...state,
                subscribers,
                workflows,
                automations,
                homeLoading: false,
                homeError: null
            };
        },
        [postAppSumoLicenseSucceed](state, { payload: { pageId } }) {
            pageId = parseInt(pageId, 10);
            return {
                ...state,
                pages: state.pages.map(page =>
                    page.uid === pageId ? { ...page, licensed: true } : page
                )
            };
        },
        [toggleConnect](state, { payload: { pageId } }) {
            // console.log('pageId', pageId, state.pages);
            const loadingMsgTitle = "One moment...";
            let loadingMsgBody = "";

            const isConnected = state.allPages.find(
                page => page.uid === parseInt(pageId, 10)
            ).isConnected;

            // Disconnected so connecting to the app
            if (!isConnected) {
                loadingMsgBody = "We are connecting your page to Chatmatic...";
            }
            // Connected so disconnecting
            else {
                loadingMsgBody =
                    "We are disconnecting your page from Chatmatic...";
            }

            return {
                ...state,
                error: null,
                loading: true,
                loadingMsgTitle,
                loadingMsgBody,
                toggleConnectSucceed: false
            };
        },

        [toggleConnectFailed](state, { payload: { error } }) {
            return {
                ...state,
                error,
                loading: false,
                toggleConnectSucceed: false
            };
        },

        [toggleConnectSucceed](state, { payload: { pageId, isConnected } }) {
            const pages = state.pages.map(page => {
                if (page.uid === parseInt(pageId, 10)) {
                    page.isConnected = isConnected;
                }

                return page;
            });

            let successText = "";
            if (isConnected) {
                successText =
                    "The fan page was successfully connected to Chatmatic!";
            } else {
                successText =
                    "The fan page was successfully disconnected from Chatmatic!";
            }
            return {
                ...state,
                pages,
                error: null,
                successText,
                loading: false,
                toggleConnectSucceed: true
            };
        },

        [connectAll](state) {
            const loadingMsgTitle = "One moment...";
            let loadingMsgBody =
                "We are connecting all the pages to Chatmatic...";

            return {
                ...state,
                error: null,
                loading: true,
                loadingMsgTitle,
                loadingMsgBody,
                toggleConnectSucceed: false
            };
        },

        [connectAllFailed](state, { payload: { error } }) {
            return {
                ...state,
                error,
                loading: false,
                toggleConnectSucceed: false
            };
        },

        [connectAllSucceed](state) {
            const pages = state.pages.map(page => {
                page.isConnected = 1;

                return page;
            });

            let successText =
                "All the pages was successfully connected to Chatmatic!";

            return {
                ...state,
                pages,
                error: null,
                successText,
                loading: false,
                toggleConnectSucceed: true
            };
        },

        [getPagePosts](state, { payload: { pageId } }) {
            const pages = state.pages.map(page => {
                if (page.uid !== pageId) return page;

                return {
                    ...page,
                    error: null,
                    loading: true
                };
            });

            return {
                ...state,
                pages
            };
        },

        [getPagePostsFailed](state, { payload: { pageId, error } }) {
            const pages = state.pages.map(page => {
                if (page.uid !== pageId) return page;

                return {
                    ...page,
                    error,
                    loading: false
                };
            });

            return {
                ...state,
                pages
            };
        },

        [getPagePostsSucceed](state, { payload: { pageId, posts, triggers } }) {
            const pages = state.pages.map(page => {
                if (page.uid !== Number(pageId)) return page;
                return {
                    ...page,
                    error: null,
                    loading: false,
                    posts,
                    triggers
                };
            });

            return {
                ...state,
                pages
            };
        },

        [updatePostSucceed](state, { payload: { pageId, postId } }) {
            const pages = state.pages.map(page => {
                if (page.uid !== pageId) return page;

                const posts = page.posts.map(post => {
                    if (post.uid !== postId) return post;

                    return {
                        ...post,
                        trigger: !post.trigger
                    };
                });

                return {
                    ...page,
                    posts
                };
            });

            return {
                ...state,
                pages
            };
        },

        [updatePostFailed](state, { payload: { error } }) {
            return {
                ...state,
                error
            };
        },

        [createTrigger](state, { payload: { pageId, trigger } }) {
            const pages = state.pages.map(page => {
                if (page.uid !== pageId) return page;

                return {
                    ...page,
                    loading: true
                };
            });

            return {
                ...state,
                pages
            };
        },
        [updateTrigger](state, { payload: { pageId, trigger } }) {
            const pages = state.pages.map(page => {
                if (page.uid !== pageId) return page;

                return {
                    ...page,
                    loading: true
                };
            });

            return {
                ...state,
                pages
            };
        },
        [createTriggerSucceed](state, { payload: { pageId, trigger } }) {
            const pages = state.pages.map(page => {
                if (page.uid !== pageId) return page;

                const posts = page.posts.map(post => {
                    if (post.uid !== trigger.postUid) return post;

                    return {
                        ...post,
                        trigger: true
                    };
                });

                return {
                    ...page,
                    loading: false,
                    triggers: page.triggers.concat([trigger]),
                    posts
                };
            });

            return {
                ...state,
                pages
            };
        },

        [createTriggerFailed](state, { payload: { error } }) {
            const pages = state.pages.map(page => {
                return {
                    ...page,
                    loading: false
                };
            });
            return {
                ...state,
                pages,
                error
            };
        },

        [updateTriggerSucceed](state, { payload: { pageId, trigger } }) {
            const pages = state.pages.map(page => {
                if (page.uid !== pageId) return page;

                const triggers = page.triggers.map(item => {
                    if (item.uid !== trigger.uid) return item;

                    return trigger;
                });

                return {
                    ...page,
                    loading: false,
                    triggers
                };
            });

            return {
                ...state,
                pages
            };
        },

        [updateTriggerFailed](state, { payload: { error } }) {
            return {
                ...state,
                loading: false,
                error: error
            };
        },

        [toggleMenus](state) {
            return {
                ...state,
                error: null
            };
        },

        [toggleMenusFailed](state, { payload: { error } }) {
            return {
                ...state,
                error
            };
        },

        [toggleMenusSucceed](state, { payload: { pageId, active } }) {
            const pages = state.pages.map(page => {
                if (page.uid === parseInt(pageId, 10)) {
                    page.menusActive = active;
                }

                return page;
            });

            return {
                ...state,
                pages,
                error: null
            };
        },

        [getRecentSubscribers](state) {
            return {
                ...state,
                error: null,
                loading: true,
                loadingMsgTitle: "Please wait...",
                loadingMsgBody: "We are generating a listing of Graph..."
            }
        },

        [getRecentSubscribersSucceed](state, {payload: {totalSubscribers}}) {
            return {
                ...state,
                totalSubscribers,
                error: null,
                loading: false,
            }
        },

        [getRecentSubscribersFailed](state, { payload: { error } }) {
            return {
                ...state,
                error,
                loading: false
            }
        }
        
    },
    defaultState
);

export default reducer;
