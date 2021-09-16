import { createSelector } from 'reselect';
import _ from 'lodash';

const getWorkflows = state => state.default.workflows;

export const getActiveWorkflows = createSelector([getWorkflows], workflows => {
    return workflows.workflows.filter(workflow => !workflow.archived);
});

export const getGeneralWorkflows = createSelector(
    [getActiveWorkflows],
    workflows => {
        return workflows.filter(
            workflow => workflow.workflowType === 'general'
        );
    }
);

export const getWorkflowTriggers = createSelector([getWorkflows], workflows => {
    return workflows.workflowTriggers;
});
