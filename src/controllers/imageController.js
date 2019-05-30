import mongoose from "mongoose";
import imageSchema from "../models/imageModel";
const Image = mongoose.model("Images", imageSchema);
import { decodeAccess_token } from "./utilController";
import Jimp from "jimp";
import { isArray } from "util";
const pathUrl = `C:\/wamp64\/www\/img\/allincuba\/upload/`;
const urlImg = `http://localhost/img/allincuba/upload/`;

export function getImagesByElementAndElementId(req, res) {
  decodeAccess_token(req.headers.authorization, user => {
    if (user === false) {
      return res.json({ status: "401", data: "Usted no esta autenticado" });
    } else {
      const { element, elementId } = req.body;
      Image.find(
        { element: element, elementId: elementId },
        { element: 1, elementId: 1, picture: 1, highlight: 1, active: 1 },
        (error, images) => {
          if (error) return res.json({ status: "500", data: error });
          return res.json({ status: "200", data: { images: images, elementId: elementId } });
        }
      );
    }
  });
}

export function getImages(req, res) {
  // decodeAccess_token(req.headers.authorization, user => {
  //     if (user === false) {
  //         return res.json({ status: "401", data: "Usted no esta autenticado" });
  //         } else {
  Image.find({}, (error, images) => {
    if (error) return res.json({ status: "500", data: error });
    return res.json({ status: "200", data: images });
    //     });
    // }
  })
    .populate("album")
    .sort("-created_at")
    .exec();
}

export function saveImgeElementAndElementId({ imageFile, element, elementId, user_id }) {
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
  console.log("req.body.authorization", req.body.authorization);
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
      }

      Promise.all(promaise)
        .then(response => {
          console.log("+++++++++++ Promise.all(promaise)+++++response+++++++++++++++++++++");
          console.log(response);
          console.log("+++++++++++++++++++++++++++++++++++++");

          return res.json({ status: "200", data: response });
        })
        .catch(error => {
          return res.json({ status: "500", data: error });
        });
    }
  });
}
export function deleteImage(req, res) {
  // decodeAccess_token(req.headers.authorization, user => {
  //   if (user === false) {
  //     return res.json({ status: "401", data: "Usted no esta autenticado" });
  //   } else {
  Image.deleteOne({ _id: req.params._id }, (error, image) => {
    if (error) return res.json({ status: "500", data: error });
    return res.json({ status: "200", data: image._id });
  });
}
//     });
//   }

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
