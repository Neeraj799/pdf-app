const jwt = require("jsonwebtoken");

const validateUser = async (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(400).json({ message: "Access is denied, Token is required" });
    }

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.log("Token verification error:", err);
        return res.status(401).json({ error: err });
    }
};

module.exports = { validateUser };