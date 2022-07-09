const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
    {
        userID: { type: String, required: true, unique: true },
        products: [
            {
                productsID: {
                    type: String,
                    required: true
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
        amount: { type: Number, required: true },
        address: { type: Object, required: true },
        status: { type: String, default: "pending" }
    },
    { timestamps: true }
);
module.exports = mongoose.model("Cart", CartSchema);