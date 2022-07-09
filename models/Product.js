const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true, unique: true },
    info: { type: String, required: true },
    img: { type: String, required: true },
    category: { type: String, required: true },
    company: { type: String, required: true },
    inCart: { type: Boolean, default: false },
    count: { type: Number, required: true },
    total: { type: Number, required: true },
    price: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);