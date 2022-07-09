const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//Register
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString()
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json({ status: 200, data: { savedUser } });
    } catch (err) {
        res.status(500).json(err);
    }
})

//login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });

        if (!user) res.status(401).json("Wrong Credentials");
        else {
            const hashedPass = CryptoJS.AES.decrypt(
                user.password,
                process.env.PASS_SEC
            );
            const pwd = hashedPass.toString(CryptoJS.enc.Utf8);
            if (pwd !== req.body.password) res.status(401).json("Wrong Credentials!");
            else {
                const { password, ...others } = user._doc;

                console.log(user._id, user.isAdmin, process.env.JWT_SEC)
                const accessToken = jwt.sign(
                    {
                        id: user._id,
                        isAdmin: user.isAdmin,
                    },
                    process.env.JWT_SEC,
                    { expiresIn: '3d', }
                );

                res.status(200).json({ stsatus: 200, data: { ...others, accessToken } });
            }
        }
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
})


module.exports = router; 