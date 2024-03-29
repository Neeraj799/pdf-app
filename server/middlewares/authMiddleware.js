const jwt = require("jsonwebtoken");

const validateUser = async (req, res, next) => {
    let token = req.headers["authorization"];
    console.log(token);

    // Check if token starts with "Bearer "
    if (token && token.startsWith("Bearer ")) {
        // Remove "Bearer " prefix
        token = token.slice(7);
    }

    // Now token should only contain the JWT string without the prefix
    console.log(token);

    if (!token) {
        return res.status(400).json({ message: "Access is denied, Token is required" });
    }

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        req.user = decoded;
        next();
    } catch (err) {
        console.log("Token verification error:", err);
        return res.status(401).json({ error: err });
    }
};

module.exports = { validateUser };
