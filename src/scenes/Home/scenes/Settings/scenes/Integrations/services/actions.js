import { createActions } from 'redux-actions';

const {
  getIntegrationTypes,
  getIntegrationTypesSucceed,
  getIntegrationTypesFailed,
  getIntegrations,
  getIntegrationsSucceed,
  getIntegrationsFailed,
  addIntegration,
  addIntegrationSucceed,
  addIntegrationFailed,
  updateIntegration,
  updateIntegrationSucceed,
  updateIntegrationFailed,
  deleteIntegration,
  deleteIntegrationSucceed,
  deleteIntegrationFailed
} = createActions({
  GET_INTEGRATION_TYPES: () => ({}),
  GET_INTEGRATION_TYPES_SUCCEED: integrationTypes => ({ integrationTypes }),
  GET_INTEGRATION_TYPES_FAILED: error => ({ error }),
  GET_INTEGRATIONS: pageId => ({ pageId }),
  GET_INTEGRATIONS_SUCCEED: integrations => ({ integrations }),
  GET_INTEGRATIONS_FAILED: error => ({ error }),
  ADD_INTEGRATION: (pageId, params) => ({
    pageId,
    params
  }),
  ADD_INTEGRATION_SUCCEED: integration => ({ integration }),
  ADD_INTEGRATION_FAILED: error => ({ error }),
  UPDATE_INTEGRATION: (pageId, integrationId, params) => ({
    pageId,
    integrationId,
    params
  }),
  UPDATE_INTEGRATION_SUCCEED: integration => ({ integration }),
  UPDATE_INTEGRATION_FAILED: error => ({ error }),
  DELETE_INTEGRATION: (pageId, integrationId) => ({ pageId, integrationId }),
  DELETE_INTEGRATION_SUCCEED: integrationId => ({ integrationId }),
  DELETE_INTEGRATION_FAILED: error => ({ error })
});

export {
  getIntegrationTypes,
  getIntegrationTypesSucceed,
  getIntegrationTypesFailed,
  getIntegrations,
  getIntegrationsSucceed,
  getIntegrationsFailed,
  addIntegration,
  addIntegrationSucceed,
  addIntegrationFailed,
  updateIntegration,
  updateIntegrationSucceed,
  updateIntegrationFailed,
  deleteIntegration,
  deleteIntegrationSucceed,
  deleteIntegrationFailed
};
