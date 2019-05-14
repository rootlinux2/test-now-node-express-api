import mongoose from "mongoose";
import permissionSchema from "../models/permissionModel";
import roleSchema from "../models/roleModel";
import { decodeAccess_token } from "./utilController";
import { promises } from "fs";
const Permission = mongoose.model("Permissions", permissionSchema);
const Role = mongoose.model("Roles", roleSchema);

export function getPermissions(req, res) {
  decodeAccess_token(req.headers.authorization, user => {
    if (user === false) {
      return res.json({ status: "401", data: "Usted no esta autenticado" });
    } else {
      Permission.find({}, (error, permissions) => {
        if (error) return res.json({ status: "500", data: error });
        return res.json({ status: "200", data: permissions });
      });
    }
  });
}
export function getPermissionsApi(criterio, next) {
  Permission.find(criterio, (error, permissions) => {
    if (error) return next({ status: "500" });
    return next(permissions);
  });
}
export function addNewPermission(req, res) {
  decodeAccess_token(req.headers.authorization, user => {
    if (user === false) {
      return res.json({ status: "401", data: "Usted no esta autenticado" });
    } else {
      const { name, details, url, method } = req.body;
      let permission = new Permission();
      permission.name = name;
      permission.details = details;
      permission.url = url;
      permission.method = method;
      permission.created_by = user._id;
      permission.updated_by = user._id;
      permission.created_at = new Date();
      permission.updated_at = new Date();
      permission.save((error, permission) => {
        if (error) return res.json({ status: "500", data: error });
        return res.json({ status: "200", data: permission._id });
      });
    }
  });
}

export function getPermission(req, res) {
  decodeAccess_token(req.headers.authorization, user => {
    if (user === false) {
      return res.json({ status: "401", data: "Usted no esta autenticado" });
    } else {
      const { _id } = req.params;
      return Permission.findOne({ _id: _id }, (error, permission) => {
        if (error) return res.json({ status: "500", error: error });
        return res.json({ status: "200", data: permission });
      });
    }
  });
}

export function updatePermission(req, res) {
  const { _id } = req.params;
  decodeAccess_token(req.headers.authorization, user => {
    if (user === false) {
      return res.json({ status: "401", data: "Usted no esta autenticado" });
    } else {
      const { name, details, url, method, nameOld } = req.body;
      Permission.findOne({ _id: _id }, (error, permission) => {
        if (error) return res.json({ status: "500", error: error });
        permission._id = _id;
        permission.name = name;
        permission.details = details;
        permission.url = url;
        permission.method = method;
        permission.updated_by = user._id;
        permission.updated_at = new Date();
        permission.save((error, permission) => {
          if (error) return res.json({ status: "500", data: error });
          Role.find({ permissions: { $in: nameOld } }, (error, roles) => {
            if (error) res.json({ status: "500", data: error });
            let rolesToUpdate = roles.map(role => {
              let index = role.permissions.indexOf(nameOld);
              if (index !== -1) {
                role.permissions[index] = name;
              }
              return Role.updateOne({ _id: role._id }, role);
            });
            Promise.all(rolesToUpdate).then(response =>
              res.json({ status: "200", data: permission._id })
            );
          });
        });
      });
    }
  });
}
export function deletePermission(req, res) {
  decodeAccess_token(req.headers.authorization, user => {
    if (user === false) {
      return res.json({ status: "401", data: "Usted no esta autenticado" });
    } else {
      PermissiondeleteOne({ _id: req.params._id }, (error, permission) => {
        if (error) return res.json({ status: "500", data: error });
        return res.json({ status: "200", data: permission._id });
      });
    }
  });
}

export function getAllPermissionsCurrentUser(req, res) {
  let util = require("./util");
  util.decodeToken(req.headers.authorization, ({ user }) => {
    db.Role.find({ name: { $in: user.roles } }, (error, roles) => {
      if (error) return next({ success: false });
      let permissions = [];
      roles.map(rol => {
        permissions = permissions.concat(rol.permissions);
      });
      return res.json(permissions);
    });
  });
}
