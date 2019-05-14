import mongoose from "mongoose";
import roleSchema from "../models/roleModel";
import { getPermissionsApi } from "./permissionController";
import { decodeAccess_token } from "./utilController";
const Role = mongoose.model("Roles", roleSchema);

export function getRoles(req, res) {
  decodeAccess_token(req.headers.authorization, user => {
    if (user === false) {
      return res.json({ status: "401", data: "Usted no esta autenticado" });
    } else {
      Role.find((error, roles) => {
        if (error) return res.json({ status: "500", data: error });
        getPermissionsApi({}, permissions => {
          roles.map((role, ind) => {
            role.permissions.map((rolepermissions, index) => {
              permissions.map(per => {
                if (rolepermissions == per._id) {
                  role.permissions[index] = per.name;
                }
              });
            });
          });
          return res.json({ status: "200", data: roles });
        });
      });
    }
  });
}

export function addNewRole(req, res) {
  decodeAccess_token(req.headers.authorization, user => {
    if (user === false) {
      return res.json({ status: "401", data: "Usted no esta autenticado" });
    } else {
      const { name, details, permissions } = req.body;
      let role = new Role();
      role.name = name;
      role.details = details;
      role.permissions = permissions;
      role.created_by = user._id;
      role.updated_by = user._id;
      role.created_at = new Date();
      role.updated_at = new Date();
      role.save((error, role) => {
        if (error) return res.json({ status: "500", data: error });
        return res.json({ status: "200", data: role._id });
      });
    }
  });
}

export function getRole(req, res) {
  decodeAccess_token(req.headers.authorization, user => {
    if (user === false) {
      return res.json({ status: "401", data: "Usted no esta autenticado" });
    } else {
      const { _id } = req.params;
      return Role.findOne({ _id: _id }, (error, role) => {
        if (error) return res.json({ status: "500", data: error });
        return res.json({ status: "200", data: role });
      });
    }
  });
}

export function updateRole(req, res) {
  decodeAccess_token(req.headers.authorization, user => {
    if (user === false) {
      return res.json({ status: "401", data: "Usted no esta autenticado" });
    } else {
      const { _id } = req.params;
      const { name, details, permissions } = req.body;
      Role.findById(_id, (error, role) => {
        if (error) return res.json({ status: "500", error: error });
        role._id = _id;
        role.name = name;
        role.details = details;
        role.permissions = permissions;
        role.updated_by = user._id;
        role.updated_at = new Date();
        role.save((error, role) => {
          if (error) return res.json({ status: "500", data: error });
          return res.json({ status: "200", data: role._id });
        });
      });
    }
  });
}

export function deleteRole(req, res) {
  decodeAccess_token(req.headers.authorization, user => {
    if (user === false) {
      return res.json({ status: "401", data: "Usted no esta autenticado" });
    } else {
      Role.deleteOne({ _id: req.params._id }, (error, role) => {
        if (error) return res.json({ status: "500", data: error });
        return res.json({ status: "200", data: role._id });
      });
    }
  });
}
