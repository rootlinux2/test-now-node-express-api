import mongoose from "mongoose";
import accommodationSchema from "../models/accommodationModel";
import { decodeAccess_token } from "./utilController";
const Accommodation = mongoose.model("Accommodations", accommodationSchema);

export function getAccommodation(req, res) {
  decodeAccess_token(req.headers.authorization, user => {
    if (user === false) {
      return res.json({ status: "401", data: "Usted no esta autenticado" });
    } else {
      const { _id } = req.params;
      return Accommodation.findById(_id, (error, accommodation) => {
        if (error) return res.json({ status: "500", data: error });
        return res.json({ status: "200", data: accommodation });
      });
    }
  });
}
export function getAccommodations(req, res) {
  decodeAccess_token(req.headers.authorization, user => {
    if (user === false) {
      return res.json({ status: "401", data: "Usted no esta autenticado" });
    } else {
      Accommodation.find((error, accommodations) => {
        if (error) return res.json({ status: "500", data: error });
        return res.json({ status: "200", data: accommodations });
      });
    }
  });
}

export function addNewAccommodation(req, res) {
  decodeAccess_token(req.headers.authorization, user => {
    if (user === false) {
      return res.json({ status: "401", data: "Usted no esta autenticado" });
    } else {
      const {
        tittle,
        type_of_property,
        location,
        guests,
        rooms,
        bathrooms,
        price,
        general_description,
        location_description,
        service_description,
        host_rules,
        included_services,
        extra_services,
        address,
        contact
      } = req.body;
      let accommodation = new Accommodation();
      accommodation.tittle = tittle;
      accommodation.type_of_property = type_of_property;
      accommodation.location = location;
      accommodation.guests = guests;
      accommodation.rooms = rooms;
      accommodation.bathrooms = bathrooms;
      accommodation.price = price;
      accommodation.general_description = general_description;
      accommodation.location_description = location_description;
      accommodation.service_description = service_description;
      accommodation.host_rules = host_rules;
      accommodation.included_services = included_services;
      accommodation.extra_services = extra_services;
      accommodation.address = address;
      accommodation.contact = contact;
      accommodation.created_by = user._id;
      accommodation.updated_by = user._id;
      accommodation.created_at = new Date();
      accommodation.updated_at = new Date();
      accommodation.save((error, accommodation) => {
        if (error) return res.json({ status: "500", data: error });
        return res.json({ status: "200", data: accommodation._id });
      });
    }
  });
}

export function updateAccommodation(req, res) {
  decodeAccess_token(req.headers.authorization, user => {
    if (user === false) {
      return res.json({ status: "401", data: "Usted no esta autenticado" });
    } else {
      const { _id } = req.params;
      const {
        tittle,
        type_of_property,
        location,
        guests,
        rooms,
        bathrooms,
        price,
        general_description,
        location_description,
        service_description,
        host_rules,
        included_services,
        extra_services,
        address,
        contact
      } = req.body;
      Accommodation.findById(_id, (error, accommodation) => {
        if (error) return res.json({ status: "500", error: error });

        accommodation.tittle = tittle;
        accommodation.type_of_property = type_of_property;
        accommodation.location = location;
        accommodation.guests = guests;
        accommodation.rooms = rooms;
        accommodation.bathrooms = bathrooms;
        accommodation.price = price;
        accommodation.general_description = general_description;
        accommodation.location_description = location_description;
        accommodation.service_description = service_description;
        accommodation.host_rules = host_rules;
        accommodation.included_services = included_services;
        accommodation.extra_services = extra_services;
        accommodation.address = address;
        accommodation.contact = contact;
        accommodation.updated_by = user._id;
        accommodation.updated_at = new Date();
        accommodation.save((error, accommodation) => {
          if (error) return res.json({ status: "500", data: error });
          return res.json({ status: "200", data: accommodation._id });
        });
      });
    }
  });
}

export function deleteAccommodation(req, res) {
  decodeAccess_token(req.headers.authorization, user => {
    if (user === false) {
      return res.json({ status: "401", data: "Usted no esta autenticado" });
    } else {
      Accommodation.deleteOne({ _id: req.params._id }, (error, accommodation) => {
        if (error) return res.json({ status: "500", data: error });
        return res.json({ status: "200", data: accommodation._id });
      });
    }
  });
}
