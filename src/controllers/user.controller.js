import { User } from "../models/user.model.js";

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
    return res.status(500).json({ message: "Internal server error" });
  }

  try {
    const user = await User.create({ name, email, password });
    const id = user._id;
    res.status(200).json({ message: "User registered", id });
  } catch (error) {
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
    res.status(200).json({ message: "User logged in", token: token});
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export { Register, Login };
