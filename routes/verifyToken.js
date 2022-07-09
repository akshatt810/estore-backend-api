const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if (err) res.status(403).json("Invalid Token!");
            req.user = user;
            next();
        });
    } else {
        res.status(401).json("Authorisation Failed!");
    }
}
const verifyTokenAuthorisation = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin || (req.params.id == req.user.id)) {
            next();
        } else {
            res.status(403).json("Admin access denied.");
        }
    });
}
const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("Admin access denied.");
        }
    });
}

module.exports = {
    verifyToken,
    verifyTokenAuthorisation,
    verifyTokenAndAdmin
}; 