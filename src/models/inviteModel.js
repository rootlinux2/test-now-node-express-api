import mongoose from "mongoose";
const Schema = mongoose.Schema;
const InviteSchema = new Schema({
  code: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    default: false
  },
  roles: {
    type: Array
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

export default InviteSchema;
