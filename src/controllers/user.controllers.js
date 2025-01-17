import User from "../models/users.models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const generateAccessToken = (user) => {
    return jwt.sign({ email: user.email , id: user._id }, process.env.ACCESS_JWT_SECRET, {
        expiresIn: "6h",
    });
};
const generateRefreshToken = (user) => {
    return jwt.sign({ email: user.email }, process.env.REFRESH_JWT_SECRET, {
        expiresIn: "7d",
    });
};


const registerUser = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    if (!email) return res.status(401).json({ message: "email is required" })
    if (!password) return res.status(401).json({ message: "password is required" })
    if (!first || !lastName) return res.status(401).json({ message: "first and lastName is required" })


    try {
        const user = await User.findOne({ email })
        if (user) return res.status(400).json({ message: "user already exist" })

        const createUser = await User.create({ email, password, firstName, lastName });

        res.json({
            message: "user registered successfully", user: createUser
        })
    } catch (error) {
        res.status(500).json({
            message: "internal server error"
        })
    }
}

// const loginUser = async (req, res) => {
//     const { email, password } = req.body

//     if (!email) return res.status(400).json({ message: "email required" });
//     if (!password) return res.status(400).json({ message: "password required" });

//     const user = await User.findOne({ email })
//     if (!user) return res.status(400).json({ message: "user is not registered" })

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) return res.status(400).json({ message: "incorrect password" });

//     const accessToken = generateAccessToken(user)
//     const refreshToken = generateRefreshToken(user)

//     res.cookie("refreshToken", refreshToken, {  httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "None" });

//     res.json({
//         message: "user logged In successfully",
//         accessToken,
//         refreshToken,
//         user
//     })
// }

const loginUser = async (req, res) => {
  const { email, password } = req.body

  if (!email) return res.status(400).json({ message: "email required" });
  if (!password) return res.status(400).json({ message: "password required" });

  const user = await User.findOne({ email })
  if (!user) return res.status(400).json({ message: "user is not registered" })

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(400).json({ message: "incorrect password" });

  const accessToken = generateAccessToken(user)

  // Access token ko cookie mein set karein
  res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });

  res.json({
      message: "user logged In successfully",
      user
  })
}

const logoutUser = async (req, res) => {
    res.clearCookie("refreshToken");
    res.json({ message: "user logout successfully" });
}

const regenerateAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken)
        return res.status(401).json({ message: "no refresh token found!" });
    try {
        const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);


        const user = await User.findOne({ email: decodedToken.email });

        if (!user) return res.status(404).json({ message: "invalid token" });

        const generateToken = generateAccessToken(user);
        res.json({ message: "access token generated", accesstoken: generateToken });
    } catch (error) {
        res.status(500).json({
            error: 'error occured'
        })
    }

}


export { registerUser, loginUser, logoutUser, regenerateAccessToken }