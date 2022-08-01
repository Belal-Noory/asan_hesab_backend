const mongoose = require("mongoose");
const { Schema } = mongoose;

// Create monoose schema/document
const contractSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    start: {
        type: Date,
        required: true,
    },
    end: {
        type: String,
        required: true,
    },
    current:{
        type: Number,
        default: 1
    }
});
const Contract = mongoose.model("contract", customerSchema);
module.exports = Contract;
