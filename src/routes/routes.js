import {
  addNewUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  authUser,
  userFindByRole,
  invite,
  confirm
} from "../controllers/userController";

import {
  addNewPermission,
  getPermissions,
  getPermission,
  updatePermission,
  deletePermission
} from "../controllers/permissionController";

import {
  addNewRole,
  getRoles,
  getRole,
  updateRole,
  deleteRole
} from "../controllers/roleController";

const routes = app => {
  app
    .route("/api/user")
    .get(getUsers)
    .post(addNewUser);
  app
    .route("/api/user/:_id")
    .put(updateUser)
    .get(getUser)
    .delete(deleteUser);
  app.route("/api/user/invite").post(invite);
  app.route("/api/user/confirm/:code").get(confirm);
  app.route("/api/user/auth").post(authUser);
  app.route("/api/user/userFindByRole").post(userFindByRole);

  app
    .route("/api/permission")
    .get(getPermissions)
    .post(addNewPermission);
  app
    .route("/api/permission/:_id")
    .put(updatePermission)
    .get(getPermission)
    .delete(deletePermission);

  app
    .route("/api/role")
    .get(getRoles)
    .post(addNewRole);
  app
    .route("/api/role/:_id")
    .put(updateRole)
    .get(getRole)
    .delete(deleteRole);
};

export default routes;
