import { handleActions } from 'redux-actions';

import {
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
} from './actions';

const defaultState = {
  integrations: [],
  integrationTypes: [],
  newIntegrationId: null,
  loading: false,
  error: null
};

const reducer = handleActions(
  {
    [getIntegrationTypes](state) {
      return {
        ...state,
        newIntegrationId: null,
        integrationTypes: [],
        loading: true,
        error: null
      };
    },
    [getIntegrationTypesSucceed](
      state,
      {
        payload: { integrationTypes }
      }
    ) {
      return {
        ...state,
        integrationTypes,
        loading: false,
        error: null
      };
    },
    [getIntegrationTypesFailed](
      state,
      {
        payload: { error }
      }
    ) {
      return {
        ...state,
        loading: false,
        error
      };
    },

    [getIntegrations](state) {
      return {
        ...state,
        newIntegrationId: null,
        integrations: [],
        loading: true,
        error: null
      };
    },
    [getIntegrationsSucceed](
      state,
      {
        payload: { integrations }
      }
    ) {
      return {
        ...state,
        integrations,
        loading: false,
        error: null
      };
    },
    [getIntegrationsFailed](
      state,
      {
        payload: { error }
      }
    ) {
      return {
        ...state,
        loading: false,
        error
      };
    },

    [addIntegration](state) {
      return {
        ...state,
        newIntegrationId: null,
        loading: true,
        error: null
      };
    },
    [addIntegrationSucceed](
      state,
      {
        payload: { integration }
      }
    ) {
      return {
        ...state,
        newIntegrationId: integration.uid,
        integrations: state.integrations.concat([integration]),
        loading: false,
        error: null
      };
    },
    [addIntegrationFailed](
      state,
      {
        payload: { error }
      }
    ) {
      return {
        ...state,
        loading: false,
        error
      };
    },

    [updateIntegration](state) {
      return {
        ...state,
        newIntegrationId: null,
        loading: true,
        error: null
      };
    },
    [updateIntegrationSucceed](
      state,
      {
        payload: { integration }
      }
    ) {
      const integrations = state.integrations.map(item => {
        return item.uid === integration.uid ? integration : item;
      });

      return {
        ...state,
        integrations,
        loading: false,
        error: null
      };
    },
    [updateIntegrationFailed](
      state,
      {
        payload: { error }
      }
    ) {
      return {
        ...state,
        loading: false,
        error
      };
    },

    [deleteIntegration](state) {
      return {
        ...state,
        newIntegrationId: null,
        loading: true,
        error: null
      };
    },
    [deleteIntegrationSucceed](
      state,
      {
        payload: { integrationId }
      }
    ) {
      const integrations = state.integrations.filter(
        integration => integration.uid !== parseInt(integrationId, 10)
      );

      return {
        ...state,
        integrations,
        loading: false,
        error: null
      };
    },
    [deleteIntegrationFailed](
      state,
      {
        payload: { error }
      }
    ) {
      return {
        ...state,
        loading: false,
        error
      };
    }
  },
  defaultState
);

export default reducer;
