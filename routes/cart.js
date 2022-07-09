const Cart = require("../models/Cart");
const router = require("express").Router();
const { verifyToken, verifyTokenAuthorisation, verifyTokenAndAdmin } = require("./verifyToken");

//CREATE
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newCart = new Cart(req.body);
    try {
        const savedCart = await newCart.save();
        res.status(201).json({ stsatus: 200, savedCart });
    } catch (err) {
        res.status(500).json(err);
    }
});

//UPDATE
router.put("/:id", verifyTokenAuthorisation, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json({ stsatus: 200, updatedCart })
    } catch (err) {
        res.status(500).json(err);
    }
});

//DELETE 
router.delete("/:id", verifyTokenAuthorisation, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json({ stsatus: 200, msg: "PRoduct rmoved from your cart!" });
    } catch (err) {
        res.status(401).json(err);
    }
});

//GET USER CART 
router.get("/find/:userId", verifyTokenAuthorisation, async (req, res) => {
    try {
        const Cart = await Cart.findOne(req.params.userId);
        res.status(200).json({ stsatus: 200, Cart });
    } catch (err) {
        res.status(401).json(err);
    }
});

//GET ALL  
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json({ stsatus: 200, Carts });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;