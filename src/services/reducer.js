import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
/** Import service reducers */
import authReducer from "./auth/authReducer";
import customFieldsReducer from "./customfields/reducer";
import pagesReducer from "./pages/pagesReducer";
import subscribersReducer from "./subscribers/subscribersReducer";
import campaignsReducer from "./campaigns/campaignsReducer";
import workflowsReducer from "./workflows/workflowsReducer";
import broadcastsReducer from "./broadcasts/broadcastsReducer";
import tagsReducer from "./tags/reducer";
import persistentMenusReducer from "../scenes/Home/scenes/Settings/scenes/PersistentMenu/services/reducer";
import automationsReducer from "../scenes/Home/scenes/Settings/scenes/Automations/services/reducer";
import adminsReducer from "../scenes/Home/scenes/Settings/scenes/General/services/reducer";
import billingReducer from "../scenes/Home/scenes/Settings/scenes/Billing/services/reducer";
import integrationsReducer from "../scenes/Home/scenes/Settings/scenes/Integrations/services/reducer";
import templatesReducer from "../scenes/Home/scenes/Settings/scenes/Templates/services/reducer";
import domainsReducer from "../scenes/Home/scenes/Settings/scenes/Domains/services/reducer";
/** Import Page Ui Reducers */
import dashboardPageReducer from "../scenes/Home/scenes/Dashboard/services/dashboardSceneReducer";
// import campaignAddReducer from '../scenes/Home/scenes/CampaignsAdd/services/reducer';
import campaignAddReducer from "../scenes/Home/Triggers/services/reducer";
import engageAddReducer from "../scenes/Home/scenes/EngageAdd/services/reducer";
import UserProfileReducer from "../scenes/Home/UserProfile/services/reducer";

// import workflow from './modules/workflow';

const settingsReducer = combineReducers({
    customFields: customFieldsReducer,
    domains: domainsReducer,
    persistentMenus: persistentMenusReducer,
    tags: tagsReducer,
    automations: automationsReducer,
    admins: adminsReducer,
    billing: billingReducer,
    integrations: integrationsReducer,
    templates: templatesReducer
});

const scenesReducer = combineReducers({
    dashboardPage: dashboardPageReducer,
    campaignAdd: campaignAddReducer,
    engageAdd: engageAddReducer,
    userProfile: UserProfileReducer
});

export default combineReducers({
    routing: routerReducer,
    auth: authReducer,
    broadcasts: broadcastsReducer,
    pages: pagesReducer,
    subscribers: subscribersReducer,
    campaigns: campaignsReducer,
    workflows: workflowsReducer,
    scenes: scenesReducer,
    settings: settingsReducer
    // workflow
});
