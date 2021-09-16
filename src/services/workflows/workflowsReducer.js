import { handleActions } from "redux-actions";
import _ from "lodash";

import {
    getPageWorkflows,
    getPageWorkflowsSucceed,
    getPageWorkflowsFailed,
    getPageWorkflow,
    getPageWorkflowSucceed,
    getPageWorkflowFailed,
    getPageTemplates,
    getPageTemplatesSucceed,
    getPageTemplatesFailed,
    getPageTemplate,
    getPageTemplateSucceed,
    getPageTemplateFailed,
    buyPageTemplate,
    buyPageTemplateSucceed,
    buyPageTemplateFailed,
    clonePageTemplateSumo,
    clonePageTemplateSumoFailed,
    clonePageTemplateSumoSucceed,
    updateWorkflowImage,
    updateWorkflowImageSucceed,
    updateWorkflowImageFailed,
    getPageWorkflowTriggers,
    getPageWorkflowTriggersSucceed,
    getPageWorkflowTriggersFailed,
    deletePageWorkflow,
    deletePageWorkflowSucceed,
    deletePageWorkflowFailed,
    getPageWorkflowStats,
    getPageWorkflowStatsSucceed,
    getPageWorkflowStatsFailed
} from "./workflowsActions";

const defaultState = {
    loading: false,
    error: null,
    workflows: [],
    workflowTriggers: [],
    broadcasts: [],
    workflowStats: [],
    templates: [],
    workflow: null,
    template: null,
    templateCode: null
};

const reducer = handleActions(
    {
        [getPageWorkflows](state) {
            return {
                ...state,
                error: null,
                loading: true
            };
        },
        [getPageWorkflowsSucceed](
            state,
            { payload: { workflows, broadcasts } }
        ) {
            // sort workflows by createdAtUtc
            const filteredWorkflows = _.orderBy(
                workflows,
                ["createdAtUtc"],
                ["desc"]
            );

            return {
                ...state,
                error: null,
                loading: false,
                workflows: filteredWorkflows,
                broadcasts
            };
        },
        [getPageWorkflowsFailed](state, { payload: { error } }) {
            return {
                ...state,
                error,
                loading: false
            };
        },
        [getPageWorkflow](state) {
            return {
                ...state,
                error: null,
                loading: true,
                workflow: null
            };
        },
        [getPageWorkflowSucceed](state, { payload: { workflow } }) {
            return {
                ...state,
                error: null,
                loading: false,
                workflow
            };
        },
        [getPageWorkflowFailed](state, { payload: { error } }) {
            return {
                ...state,
                error,
                loading: false
            };
        },
        [getPageTemplates](state) {
            return {
                ...state,
                error: null,
                loading: true
            };
        },
        [getPageTemplatesSucceed](state, { payload: { templates } }) {
            return {
                ...state,
                error: null,
                loading: false,
                templates
            };
        },
        [getPageTemplatesFailed](state, { payload: { error } }) {
            return {
                ...state,
                error,
                loading: false
            };
        },
        [getPageTemplate](state) {
            return {
                ...state,
                error: null,
                loading: true,
                template: null
            };
        },
        [getPageTemplateSucceed](state, { payload: { template } }) {
            return {
                ...state,
                error: null,
                loading: false,
                template
            };
        },
        [getPageTemplateFailed](state, { payload: { error } }) {
            return {
                ...state,
                error,
                loading: false
            };
        },
        [buyPageTemplate](state) {
            return {
                ...state,
                error: null,
                loading: true,
                templateCode: null
            };
        },
        [buyPageTemplateSucceed](state, { payload: { templateCode } }) {
            return {
                ...state,
                error: null,
                loading: false,
                templateCode
            };
        },
        [buyPageTemplateFailed](state, { payload: { error } }) {
            return {
                ...state,
                error,
                loading: false
            };
        },
        [clonePageTemplateSumo](state) {
            return {
                ...state,
                error: null,
                loading: true,
                templateCode: null
            };
        },
        [clonePageTemplateSumoSucceed](state, { payload: { templateCode } }) {
            return {
                ...state,
                error: null,
                loading: false,
                templateCode
            };
        },
        [clonePageTemplateSumoFailed](state, { payload: { error } }) {
            return {
                ...state,
                error,
                loading: false
            };
        },
        [updateWorkflowImage](state) {
            return {
                ...state,
                error: null,
                loading: true
            };
        },
        [updateWorkflowImageSucceed](
            state,
            {
                payload: {
                    workflowId,
                    data: { pictureUrl }
                }
            }
        ) {
            const workflows = state.workflows;
            const index = workflows.findIndex(
                workflow => workflow.uid !== parseInt(workflowId, 10)
            );
            if (index !== -1) {
                workflows[index].pictureUrl = pictureUrl;
            }
            return {
                ...state,
                workflows,
                error: null,
                loading: false
            };
        },
        [updateWorkflowImageFailed](state, { payload: { error } }) {
            return {
                ...state,
                error,
                loading: false
            };
        },
        [getPageWorkflowStats](state) {
            return {
                ...state,
                error: null,
                loading: true
            };
        },
        [getPageWorkflowStatsSucceed](state, { payload: { stats } }) {
            // // sort workflows by createdAtUtc
            // const filteredWorkflows = _.orderBy(
            //     workflows,
            //     ['createdAtUtc'],
            //     ['desc']
            // );

            return {
                ...state,
                error: null,
                loading: false,
                workflowStats: stats
            };
        },
        [getPageWorkflowStatsFailed](state, { payload: { error } }) {
            return {
                ...state,
                error,
                loading: false
            };
        },
        [getPageWorkflowTriggers](state) {
            return { ...state, error: null, loading: true };
        },
        [getPageWorkflowTriggersSucceed](
            state,
            { payload: { workflowTriggers } }
        ) {
            return {
                ...state,
                workflowTriggers: [...workflowTriggers],
                error: null,
                loading: false
            };
        },
        [getPageWorkflowTriggersFailed](state, { payload: { error } }) {
            return {
                ...state,
                error,
                loading: false
            };
        },
        [deletePageWorkflow](state) {
            return {
                ...state,
                error: null,
                loading: true
            };
        },
        [deletePageWorkflowSucceed](state, { payload: { workflowId } }) {
            const workflows = state.workflows.filter(
                workflow => workflow.uid !== parseInt(workflowId, 10)
            );

            return {
                ...state,
                loading: false,
                workflows
            };
        },
        [deletePageWorkflowFailed](state, { payload: { error } }) {
            return { ...state, error, loading: false };
        }
    },
    defaultState
);

export default reducer;
