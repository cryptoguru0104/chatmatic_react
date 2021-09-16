import { createActions } from 'redux-actions';

const {
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
} = createActions({
  GET_AUTOMATIONS: pageId => ({ pageId }),
  GET_AUTOMATIONS_SUCCEED: automations => ({ automations }),
  GET_AUTOMATIONS_FAILED: error => ({ error }),

  UPDATE_AUTOMATION: (pageId, automationUid, data) => ({
    pageId,
    automationUid,
    data
  }),
  UPDATE_AUTOMATION_SUCCEED: (automationUid, data) => ({ automationUid, data }),
  UPDATE_AUTOMATION_FAILED: error => ({ error }),

  ADD_AUTOMATION: (pageId, data) => ({ pageId, data }),
  ADD_AUTOMATION_SUCCEED: (automationUid, data) => ({ automationUid, data }),
  ADD_AUTOMATION_FAILED: error => ({ error }),

  DELETE_AUTOMATION: (pageId, automationUid) => ({ pageId, automationUid }),
  DELETE_AUTOMATION_SUCCEED: automationUid => ({ automationUid }),
  DELETE_AUTOMATION_FAILED: error => ({ error })
});

export {
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
};
