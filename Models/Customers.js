const mongoose = require("mongoose");
const { Schema } = mongoose;

// Create monoose schema/document
const customerSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    date: { type: Date, default: Date.now },
    status: { type: String, default: "active" },
    type: { type: String, default: "customer" },
});
const Customer = mongoose.model("customer", customerSchema);
module.exports = Customer;
