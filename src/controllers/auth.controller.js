import User from "../models/user.model.js";
import { signupSchema } from "../middlewares/validator.js";
import hashPassowrd from "../utils/hashPassword.js";

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
      result
    });
  } catch (error) {
    console.log(error);
  }
};
