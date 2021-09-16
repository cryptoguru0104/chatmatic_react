import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import LogRocket from "logrocket";
import { routerMiddleware } from "react-router-redux";
import createSagaMiddleware from "redux-saga";
import { createBrowserHistory } from "history";
import { reducer as formReducer } from "redux-form";
import { reducer as toastrReducer } from "react-redux-toastr";
// Import reducers
import * as reducers from "./services/reducer";

/**
 * Import Saga subscribers
 */

import {
    authSubscriber,
    pagesSubscriber,
    subscribersSubscriber,
    campaignsSubscriber,
    workflowsSubscriber,
    engageAddSubscriber,
    persistentMenuSubscriber,
    customFieldsSubscriber,
    tagsSubscriber,
    automationsSubscriber,
    adminsSubscriber,
    billingSubscriber,
    domainSubscriber,
    integrationsSubscriber,
    templatesSubscriber,
    campaignAddSubscriber,
    broadcastsSubscriber,
    userSubscriber
} from "./services/saga";

export const history = createBrowserHistory();

const initialState = {};
const enhancers = [];
const sagaMiddleware = createSagaMiddleware();
const middleware = [
    sagaMiddleware,
    routerMiddleware(history),
    LogRocket.reduxMiddleware()
];

if (process.env.NODE_ENV === "development") {
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

    if (typeof devToolsExtension === "function") {
        enhancers.push(devToolsExtension());
    }
}

const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);

const reducer = combineReducers({
    ...reducers,
    form: formReducer,
    toastr: toastrReducer
});

const store = createStore(reducer, initialState, composedEnhancers);

/**
 *
 * Run saga subscribers
 *
 */
sagaMiddleware.run(authSubscriber);
sagaMiddleware.run(pagesSubscriber);
sagaMiddleware.run(subscribersSubscriber);
sagaMiddleware.run(campaignsSubscriber);
sagaMiddleware.run(workflowsSubscriber);
sagaMiddleware.run(engageAddSubscriber);
sagaMiddleware.run(persistentMenuSubscriber);
sagaMiddleware.run(customFieldsSubscriber);
sagaMiddleware.run(tagsSubscriber);
sagaMiddleware.run(automationsSubscriber);
sagaMiddleware.run(adminsSubscriber);
sagaMiddleware.run(billingSubscriber);
sagaMiddleware.run(domainSubscriber);
sagaMiddleware.run(integrationsSubscriber);
sagaMiddleware.run(templatesSubscriber);
sagaMiddleware.run(campaignAddSubscriber);
sagaMiddleware.run(broadcastsSubscriber);
sagaMiddleware.run(userSubscriber);

export default store;
