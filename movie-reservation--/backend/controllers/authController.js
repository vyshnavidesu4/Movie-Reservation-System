import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const signupUser = async (req, res) => {
  try {
    const { username, mobile, email, password, preferredName } = req.body;

    const existingUsername = await User.findOne({ username });
    if (existingUsername)
      return res.status(400).json({ msg: "Username already exists" });

    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res.status(400).json({ msg: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      mobile,
      email,
      password: hashedPassword,
      preferredName,
    });

    return res.json({
      msg: "Signup successful",
      user: {
        username: newUser.username,
        email: newUser.email,
        preferredName: newUser.preferredName,
        mobile: newUser.mobile,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    if (error.code === 11000) {
      if (error.keyPattern?.username)
        return res.status(400).json({ msg: "Username already exists" });

      if (error.keyPattern?.email)
        return res.status(400).json({ msg: "Email already exists" });
    }

    return res.status(500).json({ msg: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ msg: "Invalid username or password" });

    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch)
      return res.status(400).json({ msg: "Invalid username or password" });

    return res.json({
      msg: "Login successful",
      user: {
        username: user.username,
        email: user.email,
        preferredName: user.preferredName,
        mobile: user.mobile,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// ⭐ DELETE ACCOUNT
export const deleteUser = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ msg: "Username required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    await User.deleteOne({ username });

    return res.json({ msg: "Account deleted successfully" });

  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};
