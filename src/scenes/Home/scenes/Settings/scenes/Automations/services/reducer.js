import { handleActions } from 'redux-actions';

import {
  getAutomations,
  getAutomationsSucceed,
  getAutomationsFailed,
  updateAutomation,
  updateAutomationSucceed,
  updateAutomationFailed,
  addAutomation,
  addAutomationSucceed,
  addAutomationFailed,
  deleteAutomation,
  deleteAutomationSucceed,
  deleteAutomationFailed
} from './actions';
import { convertObjectKeyToCamelCase } from 'services/utils';

const defaultState = {
  automations: [],
  loading: false,
  error: null
};

const reducer = handleActions(
  {
    [getAutomations](state) {
      return {
        automations: [],
        loading: true,
        error: null
      };
    },
    [getAutomationsSucceed](
      state,
      {
        payload: { automations }
      }
    ) {
      return {
        automations: convertObjectKeyToCamelCase(automations),
        loading: false,
        error: null
      };
    },
    [getAutomationsFailed](
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
    [updateAutomation](state) {
      return {
        ...state,
        loading: true,
        error: null
      };
    },
    [updateAutomationSucceed](
      state,
      {
        payload: { automationUid, data }
      }
    ) {
      const automations = state.automations.map(automation => {
        if (automation.uid !== parseInt(automationUid, 10)) return automation;

        return {
          ...automation,
          ...data
        };
      });

      return {
        automations,
        loading: false,
        error: null
      };
    },
    [updateAutomationFailed](
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
    [addAutomation](state) {
      return {
        ...state,
        loading: true,
        error: null
      };
    },
    [addAutomationSucceed](
      state,
      {
        payload: { automationUid, data }
      }
    ) {
      const automations = state.automations.concat([
        {
          uid: automationUid,
          ...data
        }
      ]);

      return {
        ...state,
        automations,
        loading: false,
        error: null
      };
    },
    [addAutomationFailed](
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
    [deleteAutomation](state) {
      return {
        ...state,
        loading: true,
        error: null
      };
    },
    [deleteAutomationSucceed](
      state,
      {
        payload: { automationUid }
      }
    ) {
      const automations = state.automations.filter(
        automation => automation.uid !== parseInt(automationUid, 10)
      );

      return {
        ...state,
        automations,
        loading: false,
        error: null
      };
    },
    [deleteAutomationFailed](
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
