import mongoose from "mongoose";
const Schema = mongoose.Schema;
var ExcursionSchema = new Schema({
  tittle: {
    type: Object
  },
  type_of_excursion: {
    type: Object
  },
  location: {
    type: String
  },
  guests: {
    type: Number
  },
  hours:{
    type:String
  }   ,
  priceByPerson: {
    type: Number
  },
  general_description: {
    type: Object
  },
  location_description: {
    type: Object
  }, 
  activity_rules: {
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
  imagePortada: {
    type: String,
    default:"http://localhost/img/allincuba/excursion.png"
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

export default ExcursionSchema;
