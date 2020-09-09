const mongoose = require("../configs/mongoose");
const Schema = mongoose.Schema;

const boardSchema = new Schema({
	name: {
		type: String,
		required: [true, "username is required"],
		minlength: [3, "must not be less that 3 charatcters"],
		maxlength: [20, "must not be longer than 20 characters"],
	},
	description: {
		type: String,
		maxlength: [40, "must not be longer than 40 characters"],
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	members: [
		{
			_id: false,
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		},
	],
	columns: [
		{
			_id: false,
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Task",
			},
		},
	],
});

const Board = mongoose.model("Board", boardSchema);

Board.processErrors = (err) => {
	const msg = {};
	for (const key in err.errors) {
		msg[key] = err.errors[key].message;
	}
	return msg;
};

module.exports = Board;
