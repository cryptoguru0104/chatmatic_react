import { createSelector } from 'reselect';

export const getSubscribersState = state => state.default.subscribers;

export const getActiveSubscriberId = state =>
  getSubscribersState(state).activeSubscriberId;

export const getSubscribers = state => getSubscribersState(state).subscribers;

export const getSubscriberById = createSelector(
  [getSubscribers, (state, props) => props.subscriberId],
  (subscribers, subscriberId) => {
    return (
      subscribers.find(subscriber => subscriber.uid === subscriberId) || {}
    );
  }
);

export const getActiveSubscriber = createSelector(
  [getSubscribers, getActiveSubscriberId],
  (subscribers, activeSubscriberId) => {
    return (
      subscribers.find(subscriber => subscriber.uid === activeSubscriberId) ||
      {}
    );
  }
);
