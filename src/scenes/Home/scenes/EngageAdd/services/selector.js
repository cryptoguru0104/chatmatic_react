import {
  createSelector
} from 'reselect';

export const getEngageAddState = state => state.default.scenes.engageAdd;

export const getCurrentStep = createSelector([getEngageAddState], engage => {
  if (engage.activeStep) {
    return engage.steps.find(step => step.stepUid == engage.activeStep);
  }
});

export const getAllSteps = createSelector([getEngageAddState], engage => {
  return engage.steps;
});

export const getActiveItem = createSelector(
  [getCurrentStep, (state, props) => props.itemIndex],
  (currentStep, itemIndex) => {
    return (
      currentStep.items.find((item, index) => index === itemIndex) || {}
    );
  }
);
