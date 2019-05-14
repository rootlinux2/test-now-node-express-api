import mongoose from "mongoose";
const Schema = mongoose.Schema;
const PermissionSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: new Date()
  },
  details: {
    type: String,
    required: true
  },
  url: {
    type: String,
    default: "/"
  },
  method: {
    type: String,
    default: "GET"
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

export default PermissionSchema;
