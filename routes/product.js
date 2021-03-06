const Product = require("../models/Product");
const router = require("express").Router();
const { verifyToken, verifyTokenAuthorisation, verifyTokenAndAdmin } = require("./verifyToken");

//CREATE
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        const savedProduct = await newProduct.save();
        res.status(201).json({ stsatus: 200, savedProduct });
    } catch (err) {
        res.status(500).json(err);
    }
});

//UPDATE
router.put("/:id", verifyTokenAuthorisation, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json({ stsatus: 200, updatedProduct })
    } catch (err) {
        res.status(500).json(err);
    }
});


//DELETE 
router.delete("/:id", verifyTokenAuthorisation, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ stsatus: 200, msg: "Product deleted!" });
    } catch (err) {
        res.status(401).json(err);
    }
});

//GET PRODUCT 
router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json({ stsatus: 200, product });
    } catch (err) {
        res.status(401).json(err);
    }
});

//GET ALL PRoDUCTS 
router.get("/", async (req, res) => {
    try {
        const qNew = req.query.new;
        const qCategory = req.query.category;
        let products;

        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(5);
        } else if (qCategory) {
            products = await Product.find({
                category: {
                    $in: qCategory,
                }
            });
        } else {
            products = await Product.find();
        }

        res.status(200).json(products);
    } catch (err) {
        res.status(401).json(err);
    }
});

module.exports = router;