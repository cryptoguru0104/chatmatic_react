import { createActions } from 'redux-actions';

const {
  getAdmins,
  getAdminsSucceed,
  getAdminsFailed,
  addAdmin,
  addAdminSucceed,
  addAdminFailed,
  deleteAdmin,
  deleteAdminSucceed,
  deleteAdminFailed
} = createActions({
  GET_ADMINS: pageId => ({ pageId }),
  GET_ADMINS_SUCCEED: admins => ({ admins }),
  GET_ADMINS_FAILED: error => ({ error }),
  ADD_ADMIN: (pageId, email) => ({ pageId, email }),
  ADD_ADMIN_SUCCEED: email => ({ email }),
  ADD_ADMIN_FAILED: error => ({ error }),
  DELETE_ADMIN: (pageId, adminId) => ({ pageId, adminId }),
  DELETE_ADMIN_SUCCEED: adminId => ({ adminId }),
  DELETE_ADMIN_FAILED: error => ({ error })
});

export {
  getAdmins,
  getAdminsSucceed,
  getAdminsFailed,
  addAdmin,
  addAdminSucceed,
  addAdminFailed,
  deleteAdmin,
  deleteAdminSucceed,
  deleteAdminFailed
};
