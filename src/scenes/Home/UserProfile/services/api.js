import {
  wrapRequest,
  xapi,
} from 'services/utils';
import { snakeCaseKeys } from 'services/utils';

export const getUserProfile = wrapRequest((userId) => 
  xapi(false).get(`/get-profile/${userId}`)
);

export const saveUserInfo = wrapRequest((userId, userInfo) => {
  const data = {
    userInfo
  };
  return xapi(false).post(`set-user-info/${userId}`, snakeCaseKeys(data));
});

export const getUserFollowInfo = wrapRequest((userId) => 
  xapi(false).get(`/get-follow-info/${userId}`)
);

export const followUser = wrapRequest((userId) => {
  const data = {
    userId
  } 
  return xapi(false).post(`/follow-user`, snakeCaseKeys(data));
})

export const getUserTemplateInfo = wrapRequest((userId) => 
  xapi(false).get(`/get-template-info/${userId}`)
);

export const getUserSalesInfo = wrapRequest((userId) => 
  xapi(false).get(`/get-sales-info/${userId}`)
);