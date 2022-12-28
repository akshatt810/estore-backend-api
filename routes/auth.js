const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//Register
router.post("/register", async (req, res) => {
    if (!req.body.username) {
        return res.status(401).json("Username Field Is Required.");
    }
    if (!req.body.email) {
        return res.status(401).json("Email Field Is Required.");
    }
    if (!req.body.password) {
        return res.status(401).json("Password Field Is Required.");
    }

    let user = await User.findOne({ email: req.body.email });
    if (user != null)
        return res.status(200).json("Email Already Registered.");

    user = await User.findOne({ username: req.body.username });
    if (user != null) {
        return res.status(200).json("Username Already Registered. Please Enter Different Username.");
    }

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC || "KEY required!"
        ).toString()
    });

    try {
        const savedUser = await newUser.save();
        return res.status(201).json({ status: 200, data: { savedUser } });
    } catch (err) {
        return res.status(500).json(err);
    }
});

//login
router.post("/login", async (req, res) => {
    try {

        if (!req.body.username)
            return res.status(401).json("Username Field Is Required.");

        if (!req.body.password)
            return res.status(401).json("Password Field Is Required.");

        const user = await User.findOne({ username: req.body.username });

        if (!user) {
            return res.status(401).json("Wrong Credentials");
        }
        else {
            const hashedPass = CryptoJS.AES.decrypt(
                user.password,
                process.env.PASS_SEC || "KEY required!"
            );
            const pwd = hashedPass.toString(CryptoJS.enc.Utf8);
            if (pwd !== req.body.password) res.status(401).json("Wrong Credentials!");
            else {
                const { password, ...others } = user._doc;

                const accessToken = jwt.sign(
                    {
                        id: user._id,
                        isAdmin: user.isAdmin,
                    },
                    process.env.JWT_SEC || "KEY required!",
                    { expiresIn: '3d', }
                );

                return res.status(200).json({ stsatus: 200, data: { ...others, accessToken } });
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
})


module.exports = router; 