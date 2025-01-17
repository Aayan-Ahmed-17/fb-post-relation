import jwt from "jsonwebtoken"

const authenticateUser = async (req, res, next) => {
    // Ab token cookies se check karenge
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: "no token found" });
    
    jwt.verify(token, process.env.ACCESS_JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "invalid token" });
        req.userId = user.id;
        next();
    });
};
export default authenticateUser