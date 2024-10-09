import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Assignment } from "../models/Assignment.js";

//Register Functionality:-

export const register = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body; //to get user details
    //checking so that nothing is missing
    if (!fullname || !email || !password || !role) {
      return res.status(400).json({
        message: "Something Is Missing",
        success: false,
      });
    }
    //checking if user already exist
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User Already Exist With This Email",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10); //hashing password
    await User.create({
      fullname,
      email,
      password: hashedPassword,
      role,
    });
    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//Login Functionality:-

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log(email);

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password); //comparing password with hashed password
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }
    //Check for correct role for person who is entering information
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role.",
        success: false,
      });
    }
    // Create token data
    const tokenData = {
      userId: user._id,
    };
    // Sign token with a secret key and setting expiration for 1day
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    //for response purpose
    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcom Back ${user.fullname} `,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

//Logout functionality:-

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//User Uploading Assignment:-(Also checking only person with user role can upload assignment )

export const uploadAssignment = async (req, res) => {
  try {
    const { task, admin } = req.body;

    const user = await User.findById(req.id);

    if (!user || user.role !== "user") {
      return res.status(403).json({
        message: "Only users can upload assignments.",
        success: false,
      });
    }

    // Create a new assignment
    const assignment = new Assignment({
      userId: req.id, // User ID from the middleware
      task,
      admin,
    });

    await assignment.save(); // Save the assignment to the database
    return res
      .status(201)
      .json({ msg: "Assignment uploaded successfully", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

//Fetch all admin Feature :-

export const getAllAdmins = async (req, res) => {
  try {
    //showing id,email,fullname,role for fetched admins
    const admins = await User.find({ role: "admin" }).select(
      "_id email fullname role"
    );

    res.status(200).json({
      success: true,
      admins,
    });
  } catch (error) {
    console.log(error);
  }
};
