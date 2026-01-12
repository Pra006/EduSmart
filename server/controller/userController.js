import bcrypt from "bcryptjs";
import userMlodel from "../model/userMlodel.js";
import jwt from "jsonwebtoken";

export const Login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // 1. Basic Validation
    if (!email || !password || !role) {
      return res.send({ message: "All fields are required", success: false });
    }

    if (!["student", "educator", "admin"].includes(role)) {
      return res.send({ message: "Invalid role specified", success: false });
    }

    // 2. User Existence & Role Check
    const existingUser = await userMlodel.findOne({ email });
    if (!existingUser) {
      return res.send({ message: "User does not exist", success: false });
    }

    if (existingUser.role !== role) {
      return res.send({
        message: `User is not registered as ${role}`,
        success: false,
      });
    }

    // 🔐 BLOCK educator if not approved (KEEPING THIS AS REQUESTED)
    if (
      existingUser.role === "educator" &&
      existingUser.approvalStatus !== "approved"
    ) {
      return res.send({
        message: "Your educator account is pending admin approval",
        success: false,
      });
    }

    // 🔐 BLOCK inactive accounts (KEEPING THIS AS REQUESTED)
    if (!existingUser.isActive) {
      return res.send({
        message: "Your account is inactive",
        success: false,
      });
    }

    // 3. Password Verification
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.send({ message: "Wrong Password", success: false });
    }

    // 4. Token Generation
    const token = jwt.sign(
      { _id: existingUser._id, role: existingUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .send({
        message: "Login successful",
        existingUser: {
          id: existingUser._id, // This is the ID we use to separate student data
          fullname: existingUser.fullname,
          email: existingUser.email,
          role: existingUser.role,
        },
        success: true,
      });
  } catch (error) {
    console.log(error);
    return res.send({ message: error.message, success: false });
  }
};

export const Signup = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;
    const document = req.file;

    if (!fullname || !email || !password || !role) {
      return res.send({ message: "All fields are required", success: false });
    }

    //  Prevent admin signup from UI
    if (role === "admin") {
      return res.send({ message: "Admin signup is not allowed", success: false });
    }

    //  Document required ONLY for educator
    if (role === "educator" && !document) {
      return res.send({ message: "Educator certificate document is required", success: false });
    }

    const existingUser = await userMlodel.findOne({ email });
    if (existingUser) {
      return res.send({ message: "User already exists", success: false });
    }

    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);

    const newUser = new userMlodel({
      fullname,
      email,
      password: hashpassword,
      role,
      document: document ? document.path : null,
    });

    await newUser.save();

    return res.send({
      message: role === "educator"
        ? "Signup successful. Your account is pending admin approval."
        : "Signup successful. Please login.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.send({ message: error.message, success: false });
  }
};

export const getMe = async (req, res) => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - No user found", success: false });
    }

    const user = await userMlodel.findById(userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    return res.status(200).json({
      message: "User retrieved successfully",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};