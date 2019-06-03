import mongoose from "mongoose";
import Jimp from "jimp";
import { isArray } from "util";
import { decodeAccess_token } from "./utilController";
import imageSchema from "../models/imageModel";
import activitySchema from "../models/activityModel";
import excursionSchema from "../models/excursionModel";
import accommodationSchema from "../models/accommodationModel";
import packageSchema from "../models/packageModel";
const Image = mongoose.model("Images", imageSchema);
const Accommodation = mongoose.model("Accommodations", accommodationSchema);
const Activity = mongoose.model("Activities", activitySchema);
const Excursion = mongoose.model("Excursiones", excursionSchema);
const Package = mongoose.model("Packages", packageSchema);
const pathUrl = `/var/www/html/img/allincuba/upload/`;
const urlImg = `http://localhost/img/allincuba/upload/`;

export function getImagesByElementAndElementId(req, res) {
	decodeAccess_token(req.headers.authorization, user => {
		if (user === false) {
			return res.json({ status: "401", data: "Usted no esta autenticado" });
		} else {
			const { element, elementId } = req.body;
			Image.find(
				{ element: element, elementId: elementId },
				{
					element: 1,
					elementId: 1,
					picture: 1,
					highlight: 1,
					portada: 1,
					active: 1
				},
				(error, images) => {
					if (error) return res.json({ status: "500", data: error });
					return res.json({
						status: "200",
						data: { images: images, elementId: elementId }
					});
				}
			);
		}
	});
}

export function saveImgeElementAndElementId({
	imageFile,
	element,
	elementId,
	user_id
}) {
	let nombreCortado = imageFile.name.split(".");
	let extension = nombreCortado[nombreCortado.length - 1];
	let id_unico_archivo = Math.random()
		.toString(36)
		.substr(2, 9);
	let nombreArchivo = `${id_unico_archivo}.${extension}`;
	Jimp.read(imageFile.data).then(image => {
		image
			.quality(60)
			.resize(768, Jimp.AUTO)
			.writeAsync(`${pathUrl}${nombreArchivo}`)
			.then(() => {
				let image = new Image();
				image.element = element;
				image.elementId = elementId;
				image.vote = 0;
				image.replys = 0;
				image.comment = [];
				image.name = nombreArchivo;
				image.tag = [];
				image.picture = `${urlImg}/${nombreArchivo}`;
				image.created_by = user_id;
				image.created_at = new Date();
				image.updated_by = user_id;
				image.updated_at = new Date();
				image.save((error, imagen) => {
					if (error) return new Error(error);
					return imagen._id;
				});
			})
			.catch(error => {
				return new Error(error);
			});
	});
}

export function addNewImage(req, res) {
	decodeAccess_token(req.body.authorization, user => {
		if (user === false) {
			return res.json({ status: "401", data: "Usted no esta autenticado" });
		} else {
			let promaise = [];
			let sampleFile = req.files.file;
			let { element, elementId } = req.body;
			if (isArray(sampleFile)) {
				promaise = sampleFile.map(file => {
					let image = {};
					image.imageFile = file;
					image.element = element;
					image.elementId = elementId;
					image.user_id = user._id;
					return saveImgeElementAndElementId(image);
				});
			} else {
				let image = {};
				image.imageFile = sampleFile;
				image.element = element;
				image.elementId = elementId;
				image.user_id = user._id;
				promaise.push(saveImgeElementAndElementId(image));
			}
			Promise.all(promaise)
				.then(response => {
					return res.json({ status: "200", data: response });
				})
				.catch(error => {
					return res.json({ status: "500", data: error });
				});
		}
	});
}
export function active(req, res) {
	decodeAccess_token(req.headers.authorization, user => {
		const { _id } = req.body;
		Image.findOne({ _id: _id }, (error, imagen) => {
			if (error) return res.json({ status: "500", data: error });
			imagen._id = _id;
			imagen.active = imagen.active === false ? true : false;
			imagen.updated_by = user._id;
			imagen.updated_at = new Date();
			imagen.save((error, imagen) => {
				if (error) return res.json({ status: false, data: error });
				return res.json({ status: true, data: imagen._id });
			});
		});
	});
}
export function highlight(req, res) {
	decodeAccess_token(req.headers.authorization, user => {
		const { _id } = req.body;
		Image.findOne({ _id: _id }, (error, imagen) => {
			if (error) return res.json({ status: "500", data: error });
			imagen._id = _id;
			imagen.highlight = imagen.highlight === false ? true : false;
			imagen.active = imagen.highlight === false ? imagen.active : true;
			imagen.updated_by = user._id;
			imagen.updated_at = new Date();
			imagen.save((error, imagen) => {
				if (error) return res.json({ status: false, data: error });
				return res.json({ status: true, data: imagen._id });
			});
		});
	});
}
export function portada(req, res) {
	decodeAccess_token(req.headers.authorization, user => {
		const { _id } = req.body;
		Image.findOne({ _id: _id }, (error, imagen) => {
			if (error) return res.json({ status: "500", data: error });
			imagen._id = _id;
			imagen.portada = imagen.portada === false ? true : false;
			imagen.updated_by = user._id;
			imagen.updated_at = new Date();
			imagen.save((error, imagen) => {
				Image.updateMany(
					{
						_id: { $ne: { _id } },
						element: imagen.element,
						elementId: imagen.elementId
					},
					{ $set: { portada: false } },
					(error, response) => {
						if (error) return res.json({ status: false, data: error });
						switch (imagen.element) {
							case "accommodation":
								Accommodation.updateOne(
									{ _id: imagen.elementId },
									{ $set: { imagePortada: imagen.picture } },
									(error, accomm) => {
										if (error) return res.json({ status: false, data: error });
										return res.json({ status: true, data: imagen._id });
									}
								);
								break;
							case "excursion":
								Excursion.updateOne(
									{ _id: imagen.elementId },
									{ $set: { imagePortada: imagen.picture } },
									(error, accomm) => {
										if (error) return res.json({ status: false, data: error });
										return res.json({ status: true, data: imagen._id });
									}
								);
								break;
							case "package":
								Package.updateOne(
									{ _id: imagen.elementId },
									{ $set: { imagePortada: imagen.picture } },
									(error, accomm) => {
										if (error) return res.json({ status: false, data: error });
										return res.json({ status: true, data: imagen._id });
									}
								);
								break;
							default:
								Activity.updateOne(
									{ _id: imagen.elementId },
									{ $set: { imagePortada: imagen.picture } },
									(error, accomm) => {
										if (error) return res.json({ status: false, data: error });
										return res.json({ status: true, data: imagen._id });
									}
								);
								break;
						}
					}
				);
			});
		});
	});
}
export function deleteImage(req, res) {
	const { _id } = req.params;
	var fs = require("fs");
	Image.findById(_id, (error, imagen) => {
		if (error) return res.json({ status: "500", error: error });
		var filePath = `${pathUrl}${imagen.name}`;
		fs.unlink(filePath, function(error) {
			if (error) return res.json({ status: "500", error: error });
			imagen.remove((error, imagen) => {
				if (error) return res.json({ status: "500", error: error });
				return res.json({ status: imagen._id });
			});
		});
	});
}

export function getImage(req, res) {
	// decodeAccess_token(req.headers.authorization, user => {
	//   if (user === false) {
	//     return res.json({ status: "401", data: "Usted no esta autenticado" });
	//   } else {
	const { _id } = req.params;
	return Image.findOne({ _id: _id }, (error, image) => {
		if (error) return res.json({ status: "500", data: error });
		return res.json({ status: "200", data: image });
	});
}
//     });
//   }
