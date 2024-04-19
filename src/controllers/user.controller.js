import { User, Otp, UserData} from "../models/user.model.js";
import sendMail from "../middleware/sendMail.js";
import jwt from "jsonwebtoken";

const Register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const userExists = await User.findOne({ email: email }).exec();
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }

  try {
    const user = await User.create({ name, email, password });
    const id = user._id;
    const otp = user.genrateOtp();
    sendMail(email, otp);
    const token = user.genrateJwt();
    res.status(200).json({ message: "User registered", token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email: email }).exec();
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = user.genrateJwt();
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    if (!user.isVerified) {
      const otp = user.genrateOtp();
      sendMail(email, otp);
      return res.status(400).json({ message: "User not verified" });
    }

    if (!user.isDataFilled) {
      return res.status(400).json({ message: "User data not filled" });
    }

    return res.status(200).json({ message: "User logged in", token: token });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const Home = async (req, res) => {
  const token = req.cookies.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const id = decoded.id;
  const user = await User.findOne({ _id: id }).exec();
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const userData = await UserData.findOne({ user: id }).exec();
  const res_data = {
    name: user.name,
    email: user.email,
    city: user.city,
  };

  res.status(200).json({ user: res_data, userData: userData });
};

const Verify = async (req, res) => {
  const { otp } = req.body;
  const token = req.cookies.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const id = decoded.id;
  const user = await User.findOne({ _id: id }).exec();
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const email = user.email;
  const otpExists = await Otp.findOne
  ({ otp, email }).exec();
  if (!otpExists) {
    return res.status(400).json({ message: "Invalid OTP" });
  }


  user.isVerified = true;
  await user.save();
  res.status(200).json({ message: "User verified" });
}

const AddData = async (req, res) => {
  const { city, age, work } = req.body;
  const token = req.cookies.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const id = decoded.id;
  const user = await User.findOne({ _id: id }).exec();
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const userData = await UserData.findOne({ user: id }).exec();
  if (userData) {
    return res.status(400).json({ message: "User data already exists" });
  }

  try {
    await UserData.create({ user: id, city, age, work });
    user.isDataFilled = true;
    await user.save();
    res.status(200).json({ message: "User data added" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}



export { Register, Login, Home, Verify, AddData};
