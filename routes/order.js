const Order = require("../models/Order");
const router = require("express").Router();
const { verifyToken, verifyTokenAuthorisation, verifyTokenAndAdmin } = require("./verifyToken");

//CREATE
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newCart = new Order(req.body);
    try {
        const savedCart = await newCart.save();
        res.status(201).json(savedCart);
    } catch (err) {
        res.status(500).json(err);
    }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedOrder)
    } catch (err) {
        res.status(500).json(err);
    }
});

//DELETE 
router.delete("/:id", verifyTokenAuthorisation, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order rmoved from your cart!");
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET USER 0RDERS
router.get("/find/:userId", verifyTokenAuthorisation, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET ALL ORDERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;