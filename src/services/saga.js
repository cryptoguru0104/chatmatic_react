import { authSubscriber } from './auth/authSaga';
import { pagesSubscriber } from './pages/pagesSaga';
import { subscribersSubscriber } from './subscribers/subscribersSaga';
import { campaignsSubscriber } from './campaigns/campaignsSaga';
import { workflowsSubscriber } from './workflows/workflowsSaga';
import { engageAddSubscriber } from '../scenes/Home/scenes/EngageAdd/services/saga';
import { persistentMenuSubscriber } from '../scenes/Home/scenes/Settings/scenes/PersistentMenu/services/saga';
import { automationsSubscriber } from '../scenes/Home/scenes/Settings/scenes/Automations/services/saga';
import { adminsSubscriber } from '../scenes/Home/scenes/Settings/scenes/General/services/saga';
import { billingSubscriber } from '../scenes/Home/scenes/Settings/scenes/Billing/services/saga';
import { domainSubscriber } from '../scenes/Home/scenes/Settings/scenes/Domains/services/saga';
import { integrationsSubscriber } from '../scenes/Home/scenes/Settings/scenes/Integrations/services/saga';
import { templatesSubscriber } from '../scenes/Home/scenes/Settings/scenes/Templates/services/saga';
import { customFieldsSubscriber } from './customfields/saga';
import { tagsSubscriber } from './tags/saga';
import { campaignAddSubscriber } from '../scenes/Home/Triggers/services/saga';
import { broadcastsSubscriber } from './broadcasts/broadcastsSaga';
// import { campaignAddSubscriber } from '../scenes/Home/scenes/CampaignsAdd/services/saga';

import { userSubscriber } from '../scenes/Home/UserProfile/services/saga';

export {
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
};
