import mongoose from "mongoose";
const Schema = mongoose.Schema;
var Packagechema = new Schema({
	tittle: {
		type: Object
	},
	guests: {
		type: Number
	},
	hours: {
		type: String
	},
	totalDay: {
		type: Number
	},
	price: {
		type: Number
	},
	package_rules: {
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
	state: {
		type: String
	},
	imagePortada: {
		type: String,
		default: "http://localhost/img/allincuba/excursion.png"
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

export default Packagechema;
