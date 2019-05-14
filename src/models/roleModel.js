import mongoose from "mongoose";
const Schema = mongoose.Schema;
var RoleSchema = new Schema({
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
  permissions: {
    type: Array,
    default: []
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
export default RoleSchema;
