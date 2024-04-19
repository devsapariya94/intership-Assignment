import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDataFilled: {
      type: Boolean,
      default: false,
    },
    
  },
  { timestamps: true }
);

const otpSchema = new mongoose.Schema(
  {
    otp: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600});

const userDataSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    city: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    work: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  let user = this;
  if (!user.isModified("password")) return next();
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

userSchema.methods.comparePassword = async function (password) {
  try {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
  } catch (error) {
    throw error;
  }
};

const Otp = mongoose.model("Otp", otpSchema);

userSchema.methods.genrateOtp = function () {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const email = this.email;
  Otp.create({ otp, email });
  return otp;
};

userSchema.methods.genrateJwt = function () {
  console.log("genrateJwt");
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return token;
};

const User = mongoose.model("User", userSchema);
const UserData = mongoose.model("UserData", userDataSchema);
export { User, UserData, Otp };
