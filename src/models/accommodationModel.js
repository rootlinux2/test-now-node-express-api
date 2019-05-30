import mongoose from "mongoose";
const Schema = mongoose.Schema;
var AccommodationSchema = new Schema({
  tittle: {
    type: Object
  },
  type_of_property: {
    type: Object
  },
  location: {
    type: String
  },
  guests: {
    type: Number
  },
  rooms: {
    type: Number
  },
  bathrooms: {
    type: Number
  },
  price: {
    type: Number
  },
  general_description: {
    type: Object
  },
  location_description: {
    type: Object
  },
  service_description: {
    type: Object
  },
  host_rules: {
    type: Object
  },
  included_services: {
    type: Object
  },
  extra_services: {
    type: Object
  },
  address: {
    type: Object
  },
  contact: {
    type: Array
  },
  state: {
    type: String
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
    type: Schema.Types.ObjectId,
    ref: "Users"
  },
  updated_by: {
    type: Schema.Types.ObjectId,
    ref: "Users"
  }
});

export default AccommodationSchema;
