import mongoose from "mongoose";
const Schema = mongoose.Schema;
var SessionSchema = new Schema({
  date: {
    type: Date,
    default: new Date()
  },
  user_id: {
    type: String,
    required: true
  },
  access_token_auth0: {
    type: String,
    required: true
  },
  access_token_api: {
    type: String,
    required: true
  },
  user_email: {
    type: String,
    required: true
  },
  user_name: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: new Date()
  }
});
export default SessionSchema;
