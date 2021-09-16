import { wrapRequest, xapi, getCookie } from "../utils";

export const getAuthInfo = wrapRequest(
    async (userId, longToken, sumoUserId) => {
        const data = {
            facebook_user_id: userId,
            facebook_long_token: longToken,
            sumo_user_id: sumoUserId
        };
        const referral = getCookie("referral");
        if (referral) {
            data.referral = referral;
        }
        return xapi(false).post(`login`, data);
    }
);

export const getUserCards = wrapRequest(async () =>
    xapi(false).get(`user/sources`)
);
