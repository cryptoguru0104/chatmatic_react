import { wrapRequest, xapi, snakeCaseKeys } from "services/utils";

export const getBillingInfo = wrapRequest(async pageId =>
    xapi(false).get(`pages/${pageId}/billing-info`)
);
export const updateBillingInfo = wrapRequest(async (pageId, newBillingInfo) =>
    xapi(false).patch(`pages/${pageId}/billing-info`, newBillingInfo)
);
export const postAppSumoLicense = wrapRequest(async pageId =>
    xapi(false).post(`pages/${pageId}/appsumo_license`, {})
);
export const getAppSumoInfo = wrapRequest(async () =>
    xapi(false).get(`appsumo_info`)
);
export const postLicense = wrapRequest(async (pageId, data) =>
    xapi(false).post(`pages/${pageId}/license`, snakeCaseKeys(data))
);

export const postCoupon = wrapRequest(async (pageId, plan, cardId, coupon) =>
    xapi(false).post(`pages/${pageId}/coupon-check`, {
        plan,
        cardId,
        coupon
    })
);

export const cancelSubscription = wrapRequest(async pageId =>
    xapi(false).delete(`pages/${pageId}/license`)
);

export const updatePaymentInfo = wrapRequest(async (pageId, src) =>
    xapi(false).patch(`pages/${pageId}/license`, {
        src
    })
);

export const postSmsPlan = wrapRequest(async (pageId, data) =>
    xapi(false).post(`pages/${pageId}/sms/purchase`, snakeCaseKeys(data))
);

export const getSmsPlan = wrapRequest(async pageId =>
    xapi(false).get(`pages/${pageId}/sms`)
);

export const addBillingCard = wrapRequest(async (pageId, cardToken, cardTokenToRemove) =>
    xapi(false).post(`pages/${pageId}/billing-info/card`, {
        source: cardToken,
        delete_source: cardTokenToRemove
    })
);

export const deleteBillingCard = wrapRequest(async (pageId, cardTokenToRemove) =>
    xapi(false).delete(`pages/${pageId}/billing-info/card/${cardTokenToRemove}`)
);

export const subscribeStripe = wrapRequest(async (pageId, plan, cardId, coupon, update) => {
    if(update) {
        return xapi(false).patch(`pages/${pageId}/page-subscription/update`, {
            pageId,
            plan,
            cardId,
            coupon
        });
    }
    else {
        return xapi(false).post(`pages/${pageId}/page-subscription`, {
            pageId,
            plan,
            cardId,
            coupon
        });
    }
});

export const cancelPlan = wrapRequest(async pageId =>
    xapi(false).delete(`pages/${pageId}/page-subscription/cancel`)
);
export const updatePrimaryCard = wrapRequest(async (pageId, pageCardId) =>
    xapi(false).patch(`pages/${pageId}/billing-info/card/${pageCardId}`)
);