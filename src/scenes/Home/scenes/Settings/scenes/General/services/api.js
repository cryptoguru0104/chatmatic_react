import { wrapRequest, xapi } from 'services/utils';

const getAdmins = wrapRequest(async pageId =>
  xapi(false).get(`pages/${pageId}/admins`)
);

const addAdmin = wrapRequest(async (pageId, email) =>
  xapi(false).post(`pages/${pageId}/admins`, {
    email
  })
);

const deleteAdmin = wrapRequest(async (pageId, adminId) =>
  xapi(false).delete(`pages/${pageId}/admins/${adminId}`)
);

export { getAdmins, addAdmin, deleteAdmin };
