import mongoose from "mongoose";
import activitySchema from "../models/activityModel";
import { decodeAccess_token } from "./utilController";
const Activity = mongoose.model("Activities", activitySchema);

export function getActivity(req, res) {
  decodeAccess_token(req.headers.authorization, user => {
    if (user === false) {
      return res.json({ status: "401", data: "Usted no esta autenticado" });
    } else {
      const { _id } = req.params;
      return Activity.findById(_id, (error, activity) => {
        if (error) return res.json({ status: "500", data: error });
        return res.json({ status: "200", data: activity });
      });
    }
  });
}
export function getActivities(req, res) {
  decodeAccess_token(req.headers.authorization, user => {
    if (user === false) {
      return res.json({ status: "401", data: "Usted no esta autenticado" });
    } else {
      Activity.find((error, activities) => {
        if (error) return res.json({ status: "500", data: error });
        return res.json({ status: "200", data: activities });
      });
    }
  });
}

export function addNewActivity(req, res) {
  decodeAccess_token(req.headers.authorization, user => {
    if (user === false) {
      return res.json({ status: "401", data: "Usted no esta autenticado" });
    } else {
      const {
        tittle,
        type_of_activity,
        location,
        guests,       
        priceByPerson,
        general_description,
        location_description,        
        activity_rules,
        included_services,
        extra_services,
        address,
        contact
      } = req.body;
      let activity = new Activity();
      activity.tittle = tittle;
      activity.type_of_activity = type_of_activity;
      activity.location = location;
      activity.guests = guests;      
      activity.priceByPerson = priceByPerson;
      activity.general_description = general_description;
      activity.location_description = location_description;
      activity.activity_rules = activity_rules;
      activity.included_services = included_services;
      activity.extra_services = extra_services;
      activity.address = address;
      activity.contact = contact;
      activity.state = 'No Publicado';
      activity.created_by = user._id;
      activity.updated_by = user._id;
      activity.created_at = new Date();
      activity.updated_at = new Date();
      activity.save((error, activity) => {
        if (error) return res.json({ status: "500", data: error });
        return res.json({ status: "200", data: activity._id });
      });
    }
  });
}

export function updateActivity(req, res) {
  decodeAccess_token(req.headers.authorization, user => {
    if (user === false) {
      return res.json({ status: "401", data: "Usted no esta autenticado" });
    } else {
      const { _id } = req.params;
      const {
        tittle,
        type_of_activity,
        location,
        guests,       
        priceByPerson,
        general_description,
        location_description,        
        activity_rules,
        included_services,
        extra_services,
        address,
        contact,
        state
      } = req.body;
      Activity.findById(_id, (error, activity) => {
        if (error) return res.json({ status: "500", error: error });

        activity.tittle = tittle;
        activity.type_of_activity = type_of_activity;
        activity.location = location;
        activity.guests = guests;      
        activity.priceByPerson = priceByPerson;
        activity.general_description = general_description;
        activity.location_description = location_description;
        activity.activity_rules = activity_rules;
        activity.included_services = included_services;
        activity.extra_services = extra_services;
        activity.address = address;
        activity.contact = contact;
        activity.state = state.value;
        activity.updated_by = user._id;
        activity.updated_at = new Date();
        activity.save((error, activity) => {
          if (error) return res.json({ status: "500", data: error });
          return res.json({ status: "200", data: activity._id });
        });
      });
    }
  });
}

export function deleteActivity(req, res) {
  decodeAccess_token(req.headers.authorization, user => {
    if (user === false) {
      return res.json({ status: "401", data: "Usted no esta autenticado" });
    } else {
      Activity.deleteOne({ _id: req.params._id }, (error, activity) => {
        if (error) return res.json({ status: "500", data: error });
        return res.json({ status: "200", data: activity._id });
      });
    }
  });
}
