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
import {
  addNewAccommodation,
  getAccommodation,
  getAccommodations,
  updateAccommodation,
  deleteAccommodation
} from "../controllers/accommodationController";
import {
  addNewActivity,
  getActivity,
  getActivities,
  updateActivity,
  deleteActivity
} from "../controllers/activityController";
import {
  addNewExcursion,
  getExcursion,
  getExcursiones,
  updateExcursion,
  deleteExcursion
} from "../controllers/excusionController";
import {
  getImages,
  addNewImage,
  getImage,
  deleteImage,
  active,
  highlight,
  portada,
  getImagesByElementAndElementId
} from "../controllers/imageController";

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
  app
    .route("/api/accommodation")
    .get(getAccommodations)
    .post(addNewAccommodation);
  app
    .route("/api/accommodation/:_id")
    .put(updateAccommodation)
    .get(getAccommodation)
    .delete(deleteAccommodation);
  app
    .route("/api/activity")
    .get(getActivities)
    .post(addNewActivity);
  app
    .route("/api/activity/:_id")
    .put(updateActivity)
    .get(getActivity)
    .delete(deleteActivity);
  app
    .route("/api/excursion")
    .get(getExcursiones)
    .post(addNewExcursion);
  app
    .route("/api/excursion/:_id")
    .put(updateExcursion)
    .get(getExcursion)
    .delete(deleteExcursion);
  app
    .route("/api/image")
    .get(getImages)
    .post(addNewImage);
  
  app
    .route("/api/image/:_id")
    .get(getImage)
    .delete(deleteImage);
    app.route("/api/image/getImagesByElementAndElementId").post(getImagesByElementAndElementId);
    app.route("/api/image/active").post(active);
    app.route("/api/image/highlight").post(highlight);
    app.route("/api/image/portada").post(portada);
};

export default routes;
