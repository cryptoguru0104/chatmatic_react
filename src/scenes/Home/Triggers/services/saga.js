import { put, call, throttle, select } from 'redux-saga/effects';

import * as apis from './api';
import {
    addCampaign,
    addCampaignSucceed,
    addCampaignFailed
    //   updateCampaign,
    //   updateCampaignSucceed,
    //   updateCampaignFailed
} from './actions';
import { getCampaignAdd } from './selector';
import { convertObjectKeyToCamelCase, errorMsg } from 'services/utils';

export function* campaignAddSubscriber() {
    yield throttle(500, 'UPDATE_NEW_CAMPAIGN_INFO', updateNewCampaignInfo);
    //   yield throttle(500, 'UPDATE_CAMPAIGN', updateCampaign);
}

export function* updateNewCampaignInfo({
    payload: { pageId, data, isPostUpdate }
}) {
    console.log('saga updateNewCampaignInfo');
    try {
        if (isPostUpdate) {
            // const campaignAdd = yield select(getCampaignAdd);
            const campaignAdd = data;

            yield put(addCampaign());

            const response = campaignAdd.uid
                ? yield call(apis.updateCampaign, pageId, campaignAdd)
                : yield call(apis.addCampaign, pageId, campaignAdd);

                console.log('response.data', response.data)
            yield put(
                addCampaignSucceed(convertObjectKeyToCamelCase(response.data))
            );
        }
    } catch (error) {
        yield put(addCampaignFailed(errorMsg(error)));
    }
}

// export function* updateCampaign({
//   payload: {
//     pageId,
//     triggerId,
//     data
//   }
// }) {
//   console.log('saga updateNewCampaignInfo');
//   try {
//     if (isPostUpdate) {
//       const campaignAdd = yield select(getCampaignAdd);

//       yield put(updateCampaign());

//       const response = campaignAdd.uid ?
//         yield call(apis.updateCampaign, pageId, campaignAdd): yield call(apis.addCampaign, pageId, campaignAdd);

//       yield put(
//         updateCampaignSucceed(convertObjectKeyToCamelCase(response.data))
//       );
//     }
//   } catch (error) {
//     yield put(updateCampaignFailed(errorMsg(error)));
//   }
// }
