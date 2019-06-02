import mongoose from "mongoose";
import excursionSchema from "../models/excursionModel";
import { decodeAccess_token } from "./utilController";
const Excursion = mongoose.model("Excursiones", excursionSchema);

export function getExcursion(req, res) {
  decodeAccess_token(req.headers.authorization, user => {
    if (user === false) {
      return res.json({ status: "401", data: "Usted no esta autenticado" });
    } else {
      const { _id } = req.params;
      return Excursion.findById(_id, (error, excursion) => {
        if (error) return res.json({ status: "500", data: error });
        return res.json({ status: "200", data: excursion });
      });
    }
  });
}
export function getExcursiones(req, res) {
  decodeAccess_token(req.headers.authorization, user => {
    if (user === false) {
      return res.json({ status: "401", data: "Usted no esta autenticado" });
    } else {
      Excursion.find((error, excursiones) => {
        if (error) return res.json({ status: "500", data: error });
        return res.json({ status: "200", data: excursiones });
      });
    }
  });
}

export function addNewExcursion(req, res) {
  decodeAccess_token(req.headers.authorization, user => {
    if (user === false) {
      return res.json({ status: "401", data: "Usted no esta autenticado" });
    } else {
      const {
        tittle,
        type_of_excursion,
        location,
        guests,       
        priceByPerson,
        general_description,
        location_description,        
        excursion_rules,
        included_services,
        extra_services,
        address,
        contact
      } = req.body;
      let excursion = new Excursion();
      excursion.tittle = tittle;
      excursion.type_of_excursion = type_of_excursion;
      excursion.location = location;
      excursion.guests = guests;      
      excursion.priceByPerson = priceByPerson;
      excursion.general_description = general_description;
      excursion.location_description = location_description;
      excursion.excursion_rules = excursion_rules;
      excursion.included_services = included_services;
      excursion.extra_services = extra_services;
      excursion.address = address;
      excursion.contact = contact;
      excursion.state = 'No Publicado';
      excursion.created_by = user._id;
      excursion.updated_by = user._id;
      excursion.created_at = new Date();
      excursion.updated_at = new Date();
      excursion.save((error, excursion) => {
        if (error) return res.json({ status: "500", data: error });
        return res.json({ status: "200", data: excursion._id });
      });
    }
  });
}

export function updateExcursion(req, res) {
  decodeAccess_token(req.headers.authorization, user => {
    if (user === false) {
      return res.json({ status: "401", data: "Usted no esta autenticado" });
    } else {
      const { _id } = req.params;
      const {
        tittle,
        type_of_excursion,
        location,
        guests,       
        priceByPerson,
        general_description,
        location_description,        
        excursion_rules,
        included_services,
        extra_services,
        address,
        contact,
        state
      } = req.body;
      Excursion.findById(_id, (error, excursion) => {
        if (error) return res.json({ status: "500", error: error });
        excursion.tittle = tittle;
        excursion.type_of_excursion = type_of_excursion;
        excursion.location = location;
        excursion.guests = guests;      
        excursion.priceByPerson = priceByPerson;
        excursion.general_description = general_description;
        excursion.location_description = location_description;
        excursion.excursion_rules = excursion_rules;
        excursion.included_services = included_services;
        excursion.extra_services = extra_services;
        excursion.address = address;
        excursion.contact = contact;
        excursion.state = state.value;
        excursion.updated_by = user._id;
        excursion.updated_at = new Date();
        excursion.save((error, excursion) => {
          if (error) return res.json({ status: "500", data: error });
          return res.json({ status: "200", data: excursion._id });
        });
      });
    }
  });
}

export function deleteExcursion(req, res) {
  decodeAccess_token(req.headers.authorization, user => {
    if (user === false) {
      return res.json({ status: "401", data: "Usted no esta autenticado" });
    } else {
      Excursion.deleteOne({ _id: req.params._id }, (error, excursion) => {
        if (error) return res.json({ status: "500", data: error });
        return res.json({ status: "200", data: excursion._id });
      });
    }
  });
}
