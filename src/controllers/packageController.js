import mongoose from "mongoose";
import packageSchema from "../models/packageModel";
import { decodeAccess_token } from "./utilController";
const Package = mongoose.model("Packages", packageSchema);

export function getPackage(req, res) {
	decodeAccess_token(req.headers.authorization, user => {
		if (user === false) {
			return res.json({ status: "401", data: "Usted no esta autenticado" });
		} else {
			const { _id } = req.params;
			return Package.findById(_id, (error, pack) => {
				if (error) return res.json({ status: "500", data: error });
				return res.json({ status: "200", data: pack });
			});
		}
	});
}
export function getPackages(req, res) {
	decodeAccess_token(req.headers.authorization, user => {
		if (user === false) {
			return res.json({ status: "401", data: "Usted no esta autenticado" });
		} else {
			Package.find((error, pack) => {
				if (error) return res.json({ status: "500", data: error });
				return res.json({ status: "200", data: pack });
			});
		}
	});
}

export function addNewPackage(req, res) {
	decodeAccess_token(req.headers.authorization, user => {
		if (user === false) {
			return res.json({ status: "401", data: "Usted no esta autenticado" });
		} else {
			const {
				tittle,
				guests,
				price,
				package_rules,
				included_services,
				extra_services,
				address
			} = req.body;
			let pack = new Package();
			pack.tittle = tittle;
			pack.guests = guests;
			pack.price = price;
			pack.package_rules = package_rules;
			pack.included_services = included_services;
			pack.extra_services = extra_services;
			pack.address = address;
			pack.state = "No Publicado";
			pack.created_by = user._id;
			pack.updated_by = user._id;
			pack.created_at = new Date();
			pack.updated_at = new Date();
			pack.save((error, pack) => {
				if (error) return res.json({ status: "500", data: error });
				return res.json({ status: "200", data: pack._id });
			});
		}
	});
}

export function updatePackage(req, res) {
	decodeAccess_token(req.headers.authorization, user => {
		if (user === false) {
			return res.json({ status: "401", data: "Usted no esta autenticado" });
		} else {
			const { _id } = req.params;
			const {
				tittle,
				guests,
				price,
				package_rules,
				included_services,
				extra_services,
				address,
				state
			} = req.body;
			Package.findById(_id, (error, pack) => {
				if (error) return res.json({ status: "500", error: error });
				pack.tittle = tittle;
				pack.guests = guests;
				pack.price = price;
				pack.package_rules = package_rules;
				pack.included_services = included_services;
				pack.extra_services = extra_services;
				pack.address = address;
				pack.state = state.value;
				pack.updated_by = user._id;
				pack.updated_at = new Date();
				pack.save((error, pack) => {
					if (error) return res.json({ status: "500", data: error });
					return res.json({ status: "200", data: pack._id });
				});
			});
		}
	});
}

export function deletePackage(req, res) {
	decodeAccess_token(req.headers.authorization, user => {
		if (user === false) {
			return res.json({ status: "401", data: "Usted no esta autenticado" });
		} else {
			Package.deleteOne({ _id: req.params._id }, (error, pack) => {
				if (error) return res.json({ status: "500", data: error });
				return res.json({ status: "200", data: pack._id });
			});
		}
	});
}
