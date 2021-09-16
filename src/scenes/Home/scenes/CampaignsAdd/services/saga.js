import { put, call, throttle, select } from 'redux-saga/effects';

import * as apis from './api';
import { addCampaign, addCampaignSucceed, addCampaignFailed } from './actions';
import { getCampaignAdd } from './selector';
import { convertObjectKeyToCamelCase, errorMsg } from 'services/utils';

export function* campaignAddSubscriber() {
  yield throttle(500, 'UPDATE_NEW_CAMPAIGN_INFO', updateNewCampaignInfo);
}

export function* updateNewCampaignInfo({
  payload: { pageId, data, isPostUpdate }
}) {
  try {
    if (isPostUpdate) {
      const campaignAdd = yield select(getCampaignAdd);

      yield put(addCampaign());

      const response = campaignAdd.uid
        ? yield call(apis.updateCampaign, pageId, campaignAdd)
        : yield call(apis.addCampaign, pageId, campaignAdd);

      yield put(addCampaignSucceed(convertObjectKeyToCamelCase(response.data)));
    }
  } catch (error) {
    yield put(addCampaignFailed(errorMsg(error)));
  }
}
