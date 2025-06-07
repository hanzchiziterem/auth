import User from "../models/user.model.js";
import { signinSchema, signupSchema } from "../middlewares/validator.js";
import hashPassowrd from "../utils/hashPassword.js";
import validateHashedPassword from "../utils/validateHashedPassword.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error, value } = signupSchema.validate({ email, password });

    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }

    const doesUserExist = await User.findOne({ email });
    if (doesUserExist) {
      return res
        .status(401)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await hashPassowrd(password, 12);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    const result = await newUser.save();
    result.password = undefined;
    res.status(201).json({
      success: true,
      message: "Your account has been created successfully.",
      result,
    });
  } catch (error) {
    console.log(error);
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error, value } = signinSchema.validate({ email, password });

    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }

    const doesUserExist = await User.findOne({ email }).select("+password");
    if (!doesUserExist) {
      return res
        .status(401)
        .json({ success: false, message: "User doesn't exist!" });
    }
    const result = await validateHashedPassword(
      password,
      doesUserExist.password
    );
    if (!result) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials!" });
    }
    const token = jwt.sign(
      {
        userId: doesUserExist._id,
        email: doesUserExist.email,
        verified: doesUserExist.verified,
      },
      process.env.TOKEN_SECRET_PHRASE, {
      expiresIn: '8h',
    }
    );

    res
      .cookie("Authorization", "Bearer" + token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      })
      .json({ success: true, token, message: "Logged In Successfully." });
  } catch (error) {
    console.log(error);
  }
};


