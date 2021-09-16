import { createActions } from "redux-actions";

const {
    getPages,
    getPagesFailed,
    getPagesSucceed,

    getAllPages,
    getAllPagesFailed,
    getAllPagesSucceed,

    getPage,
    getPageSucceed,
    getPageFailed,

    toggleMenus,
    toggleMenusSucceed,
    toggleMenusFailed,

    toggleConnect,
    toggleConnectFailed,
    toggleConnectSucceed,

    connectAll,
    connectAllFailed,
    connectAllSucceed,

    getPagePosts,
    getPagePostsFailed,
    getPagePostsSucceed,

    updatePost,
    updatePostFailed,
    updatePostSucceed,

    createTrigger,
    createTriggerSucceed,
    createTriggerFailed,

    updateTrigger,
    updateTriggerSucceed,
    updateTriggerFailed,

    getRecentSubscribers,
    getRecentSubscribersSucceed,
    getRecentSubscribersFailed
} = createActions({
    GET_PAGES: refresh => ({ refresh }),
    GET_PAGES_FAILED: error => ({ error }),
    GET_PAGES_SUCCEED: (
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
    ) => ({
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
    }),

    GET_ALL_PAGES: () => ({}),
    GET_ALL_PAGES_FAILED: error => ({ error }),
    GET_ALL_PAGES_SUCCEED: pages => ({
        pages
    }),

    GET_PAGE: pageId => ({ pageId }),
    GET_PAGE_SUCCEED: (subscribers, workflows, automations) => ({
        subscribers,
        workflows,
        automations
    }),
    GET_PAGE_FAILED: error => ({ error }),

    TOGGLE_MENUS: (pageId, active) => ({ pageId, active }),
    TOGGLE_MENUS_SUCCEED: (pageId, active) => ({ pageId, active }),
    TOGGLE_MENUS_FAILED: error => ({ error }),

    TOGGLE_CONNECT: pageId => ({ pageId }),
    TOGGLE_CONNECT_FAILED: error => ({ error }),
    TOGGLE_CONNECT_SUCCEED: (pageId, isConnected) => ({ pageId, isConnected }),

    CONNECT_ALL: () => ({}),
    CONNECT_ALL_FAILED: error => ({ error }),
    CONNECT_ALL_SUCCEED: () => ({}),

    GET_PAGE_POSTS: pageId => ({ pageId }),
    GET_PAGE_POSTS_FAILED: (pageId, error) => ({ pageId, error }),
    GET_PAGE_POSTS_SUCCEED: (pageId, posts, triggers) => ({
        pageId,
        posts,
        triggers
    }),

    UPDATE_POST: (pageId, postId) => ({ pageId, postId }),
    UPDATE_POST_FAILED: error => ({ error }),
    UPDATE_POST_SUCCEED: (pageId, postId) => ({ pageId, postId }),

    CREATE_TRIGGER: (pageId, trigger) => ({ pageId, trigger }),
    CREATE_TRIGGER_SUCCEED: (pageId, trigger) => ({ pageId, trigger }),
    CREATE_TRIGGER_FAILED: error => ({ error }),

    UPDATE_TRIGGER: (pageId, trigger) => ({ pageId, trigger }),
    UPDATE_TRIGGER_SUCCEED: (pageId, trigger) => ({ pageId, trigger }),
    UPDATE_TRIGGER_FAILED: error => ({ error }),

    GET_RECENT_SUBSCRIBERS:(days) => ({ days }),
    GET_RECENT_SUBSCRIBERS_SUCCEED:(subscribers) => ({ subscribers }),
    GET_RECENT_SUBSCRIBERS_FAILED:(error) => ({ error })
});

export {
    getPages,
    getPagesFailed,
    getPagesSucceed,
    getAllPages,
    getAllPagesFailed,
    getAllPagesSucceed,
    getPage,
    getPageSucceed,
    getPageFailed,
    toggleMenus,
    toggleMenusSucceed,
    toggleMenusFailed,
    toggleConnect,
    toggleConnectFailed,
    toggleConnectSucceed,
    connectAll,
    connectAllFailed,
    connectAllSucceed,
    getPagePosts,
    getPagePostsFailed,
    getPagePostsSucceed,
    updatePost,
    updatePostFailed,
    updatePostSucceed,
    createTrigger,
    createTriggerSucceed,
    createTriggerFailed,
    updateTrigger,
    updateTriggerSucceed,
    updateTriggerFailed,
    getRecentSubscribers,
    getRecentSubscribersSucceed,
    getRecentSubscribersFailed
};
