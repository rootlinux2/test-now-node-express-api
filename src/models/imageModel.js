import mongoose from "mongoose";
const Schema = mongoose.Schema;
var ImageSchema = new Schema({
  element: {
    type: String
  },
  elementId: {
    type: String
  },
  picture: {
    type: String
  },
  active: {
    type: Boolean,
    default: false
  },
  highlight: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: new Date()
  },
  updated_at: {
    type: Date,
    default: new Date()
  },
  created_by: {
    type: String
  },
  updated_by: {
    type: String
  }
});

export default ImageSchema;
