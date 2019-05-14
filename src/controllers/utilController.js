import mongoose from "mongoose";
import roleSchema from "../models/roleModel";
import { findByAccessTokenApi, save as SessionSave } from "./sessionController";
const Role = mongoose.model("Roles", roleSchema);

export function decodeAccess_token(access_token_api, next) {
  try {
    if (access_token_api !== "$__guest") {
      findByAccessTokenApi(access_token_api, session => {
        if (session === null || session.status) {
          return next(false);
        } else {
          let user = {};
          user._id = session.user_id;
          user.email = session.user_email;
          user.name = session.user_name;
          return next(user);
        }
      });
    } else return next(false);
  } catch (Exception) {
    return next({ invalid: true });
  }
}

export function generateRandomCode(key) {
  let md5 = require("md5");
  return `${new Date().getTime()}${Math.random()}${md5(key)}`.replace(".", "");
}
export function getAllPermissionsCurrentUser(user, next) {
  Role.find({ name: { $in: user.roles } }, (error, roles) => {
    if (error) return next({ success: false });
    let permissions = [];
    roles.map(rol => {
      permissions = permissions.concat(rol.permissions);
    });
    next(permissions);
  });
}
