import { put, takeLatest, call, select } from "redux-saga/effects";
import { toastr } from "react-redux-toastr";

import * as pagesApi from "./pagesApi";
import {
    getPagesSucceed,
    getPagesFailed,
    getAllPagesFailed,
    getAllPagesSucceed,
    toggleConnectSucceed,
    toggleConnectFailed,
    connectAllSucceed,
    connectAllFailed,
    getPagePostsSucceed,
    getPagePostsFailed,
    updatePostSucceed,
    updatePostFailed,
    createTriggerFailed,
    createTriggerSucceed,
    updateTriggerFailed,
    updateTriggerSucceed,
    toggleMenusSucceed,
    toggleMenusFailed,
    getPageSucceed,
    getPageFailed,
    getRecentSubscribersSucceed,
    getRecentSubscribersFailed
} from "./pagesActions";
import { convertObjectKeyToCamelCase, errorMsg } from "../utils";

export function* pagesSubscriber() {
    yield takeLatest("GET_PAGES", getPages);

    yield takeLatest("TOGGLE_CONNECT", toggleConnect);

    yield takeLatest("CONNECT_ALL", connectAll);

    yield takeLatest("GET_PAGE_POSTS", getPagePosts);

    yield takeLatest("UPDATE_POST", updatePost);

    yield takeLatest("CREATE_TRIGGER", createTrigger);

    yield takeLatest("UPDATE_TRIGGER", updateTrigger);

    yield takeLatest("TOGGLE_MENUS", togglePageMenuActive);

    yield takeLatest("GET_ALL_PAGES", getAllPages);

    yield takeLatest("GET_PAGE", getPage);

    yield takeLatest("GET_RECENT_SUBSCRIBERS", getRecentSubscribers)
}

export function* getPages({ payload: { refresh } }) {
    try {
        const response = yield call(pagesApi.getPages, refresh);
        const {
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
        } = convertObjectKeyToCamelCase(response.data);
        console.log(response.data);
        yield put(
            getPagesSucceed(
                availableLicenses,
                convertObjectKeyToCamelCase(pages),
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
            )
        );
    } catch (error) {
        yield put(getPagesFailed(errorMsg(error)));
    }
}

export function* getAllPages() {
    try {
        const response = yield call(pagesApi.getAllPages);
        const { pages } = convertObjectKeyToCamelCase(response.data);
        yield put(getAllPagesSucceed(convertObjectKeyToCamelCase(pages)));
    } catch (error) {
        yield put(getAllPagesFailed(errorMsg(error)));
    }
}

export function* toggleConnect({ payload: { pageId } }) {
    try {
        const pages = (yield select()).default.pages.allPages;
        const page = pages.find(page => page.uid === parseInt(pageId, 10));
        // Toggle isConnected property of page - value is between 1, 0 so used below not !
        const isConnected = 1 - page.isConnected;

        yield call(pagesApi.updateConnect, pageId, isConnected);

        yield put(toggleConnectSucceed(pageId, isConnected));
    } catch (error) {
        yield put(toggleConnectFailed(errorMsg(error)));
    }
}

export function* connectAll() {
    try {
        yield call(pagesApi.connectAll);

        yield put(connectAllSucceed());
    } catch (error) {
        yield put(connectAllFailed(errorMsg(error)));
    }
}

export function* getPagePosts({ payload: { pageId } }) {
    try {
        const response = yield call(pagesApi.getPagePosts, pageId);

        const responseData = convertObjectKeyToCamelCase(response.data);

        yield put(
            getPagePostsSucceed(
                pageId,
                convertObjectKeyToCamelCase(responseData.posts),
                convertObjectKeyToCamelCase(responseData.triggers)
            )
        );
    } catch (error) {
        yield put(getPagePostsFailed(pageId, errorMsg(error)));
    }
}

export function* updatePost({ payload: { pageId, postId } }) {
    try {
        const pages = (yield select()).default.pages.pages;
        const currentPage = pages.find(page => page.uid === pageId);

        if (!currentPage) {
            toastr.error("Invalid Page Id");
        } else {
            const currentPost = currentPage.posts.find(
                post => post.uid === postId
            );
            yield call(
                pagesApi.updatePost,
                pageId,
                postId,
                !currentPost.trigger
            );

            yield put(updatePostSucceed(pageId, postId));
        }
    } catch (error) {
        yield put(updatePostFailed(errorMsg(error)));
    }
}

export function* createTrigger({ payload: { pageId, trigger } }) {
    try {
        const response = yield call(pagesApi.createTrigger, pageId, trigger);

        yield put(
            createTriggerSucceed(pageId, {
                uid: convertObjectKeyToCamelCase(response.data).triggerUid,
                ...trigger
            })
        );
    } catch (error) {
        yield put(createTriggerFailed(errorMsg(error)));
    }
}

export function* updateTrigger({ payload: { pageId, trigger } }) {
    try {
        yield call(pagesApi.updateTrigger, pageId, trigger);

        yield put(updateTriggerSucceed(pageId, trigger));
    } catch (error) {
        yield put(updateTriggerFailed(errorMsg(error)));
    }
}

export function* togglePageMenuActive({ payload: { pageId, active } }) {
    try {
        yield call(pagesApi.togglePageMenuActive, pageId, active);

        yield put(toggleMenusSucceed(pageId, active));
    } catch (error) {
        yield put(toggleMenusFailed(errorMsg(error)));
    }
}

export function* getPage({ payload: { pageId } }) {
    try {
        const response = yield call(pagesApi.getPage, pageId);
        const {
            subscribers,
            workflows,
            automations
        } = convertObjectKeyToCamelCase(response.data);

        yield put(getPageSucceed(subscribers, workflows, automations));
    } catch (error) {
        yield put(getPageFailed(errorMsg(error)));
    }
}

export function* getRecentSubscribers({ payload: {days} }) {
    try {
        const response = yield call(pagesApi.getRecentSubscribers, days);

        const responseData = convertObjectKeyToCamelCase(response.data);
        const {
            totalRecentSubscribers
        } = convertObjectKeyToCamelCase(response.data);
        yield put(
            getRecentSubscribersSucceed(
                totalRecentSubscribers
            )
        );
    } catch (error) {
        yield put(getRecentSubscribersFailed(errorMsg(error)));
    }
}