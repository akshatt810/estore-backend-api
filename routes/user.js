const User = require("../models/User");
const { verifyToken, verifyTokenAuthorisation, verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();

//UPDATE
router.put("/:id", verifyTokenAuthorisation, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.bodu.password,
            process.env.PASS_SEC
        ).toString();
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedUser)
    } catch (err) {
        res.status(500).json(err);
    }
});

//DELETE 
router.delete("/:id", verifyTokenAuthorisation, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User deleted!");
    } catch (err) {
        res.status(401).json(err);
    }
});

//GET USER 
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others });
    } catch (err) {
        res.status(401).json(err);
    }
});

//GET ALL USERS 
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const query = req.query.new;
        const user = query ?
            await User.find().sort({ _id: -1 }).limit(5)
            : await User.find();
        res.status(200).json({ user });
    } catch (err) {
        res.status(401).json(err);
    }
});

module.exports = router