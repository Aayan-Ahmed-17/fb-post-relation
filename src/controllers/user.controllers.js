// import User from "../models/users.models.js";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";

// const generateAccessToken = (user) => {
//   return jwt.sign(
//     { email: user.email, id: user._id },
//     process.env.ACCESS_JWT_SECRET,
//     {
//       expiresIn: "6h",
//     }
//   );
// };
// const generateRefreshToken = (user) => {
//   return jwt.sign({ email: user.email }, process.env.REFRESH_JWT_SECRET, {
//     expiresIn: "7d",
//   });
// };

// const registerUser = async (req, res) => {
//   const { email, password, firstName, lastName } = req.body;

//   //* Checking Validations
//   if (!email) return res.status(401).json({ message: "email is required" });

//   if (!password)
//     return res.status(401).json({ message: "password is required" });

//   if (!firstName || !lastName)
//     return res.status(401).json({ message: "First & Last Name is required" });

//   try {
//     //* isEmail already exist
//     const user = await User.findOne({ email });
//     if (user) return res.status(400).json({ message: "user already exist" });

//     //* create user if not exist
//     const createUser = await User.create({
//       email,
//       password,
//       firstName,
//       lastName,
//     });
//     res.json({
//       message: "user registered successfully",
//       user: createUser,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "internal server error" + error,
//     });
//   }
// };

// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   //* checking validations
//   if (!email) return res.status(400).json({ message: "email required" });
//   if (!password) return res.status(400).json({ message: "password required" });

//   //* isRegistered || not
//   const user = await User.findOne({ email });
//   if (!user) return res.status(400).json({ message: "user is not registered" });

//   //* isCorrect password after decryption
//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid)
//     return res.status(400).json({ message: "incorrect password" });

//   //* when user Logouts tokens get expired | when token expires user gets logout
//   try {
//     const accessToken = generateAccessToken(user);
//     const refreshToken = generateRefreshToken(user);

//     //* store in cookie
//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "None",
//     });

//     res.json({
//       message: "user logged In successfully",
//       accessToken,
//       refreshToken,
//       user,
//     });
//   } catch (err) {
//     res.json({
//       message: "Error: " + err,
//     });
//   }
// };

// const logoutUser = async (req, res) => {
//   res.clearCookie("refreshToken");
//   res.json({ message: "user logout successfully" });
// };

// const regenerateAccessToken = async (req, res) => {
//   const refreshToken = req?.cookies?.refreshToken || req?.body?.refreshToken;
//   if (!refreshToken)
//     return res.status(401).json({ message: "no refresh token found!" });
//   try {
//     const decodedToken = jwt.verify(
//       refreshToken,
//       process.env.REFRESH_JWT_SECRET
//     );

//     const user = await User.findOne({ email: decodedToken.email });

//     if (!user) return res.status(404).json({ message: "invalid token" });

//     const generateToken = generateAccessToken(user);
//     res.json({ message: "access token generated", accesstoken: generateToken });
//   } catch (error) {
//     res.status(500).json({
//       error: "error occured",
//     });
//   }
// };

// export { registerUser, loginUser, logoutUser, regenerateAccessToken };


import User from "../models/users.models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id }, // Only include necessary data in the token
    process.env.ACCESS_JWT_SECRET,
    {
      expiresIn: "6h", // Adjust expiration time as needed
    }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_JWT_SECRET, {
    expiresIn: "7d", // Adjust expiration time as needed
  });
};

const registerUser = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    // Validate input
    if (!email) return res.status(400).json({ message: "Email is required" });
    if (!password) return res.status(400).json({ message: "Password is required" });
    if (!firstName || !lastName)
      return res.status(400).json({ message: "First and Last Name are required" });

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password securely
    const hashedPassword = await bcrypt.hash(password, 10); // Adjust salt rounds as needed

    // Create new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    // Generate tokens
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    // Store refresh token in a secure HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    res.status(201).json({
      message: "User registered successfully",
      accessToken,
      user: newUser,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email) return res.status(400).json({ message: "Email is required" });
    if (!password) return res.status(400).json({ message: "Password is required" });

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Compare password hashes
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Incorrect password" });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in a secure HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    res.json({
      message: "User logged in successfully",
      accessToken,
      user,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Internal server error" });
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "User logged out successfully" });
};

const regenerateAccessToken = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token found!" });

  try {
    // Verify refresh token
    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);

    // Find user by ID (more secure than using email from decoded token)
    const user = await User.findById(decodedToken.id);
    if (!user) return res.status(404).json({ message: "Invalid token or user not found" });

    // Generate new access token
    const newAccessToken = generateAccessToken(user);

    res.json({ message: "Access token regenerated", accessToken: newAccessToken });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

export { registerUser, loginUser, logoutUser, regenerateAccessToken };