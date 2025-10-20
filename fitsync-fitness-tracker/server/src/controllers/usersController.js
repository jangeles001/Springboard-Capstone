import User from "../models/userModel";

const createUser = async (req, res, next) => {
  try {
    const newUsesr = new User(req.validatedBody);
    await newUsesr.save();

    res.status(201).json({
      message: "User created successfully!",
      user: {
        id: newUsesr._id,
        username: newUsesr.username,
        email: newUsesr.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err.message });
  }
};

export default createUser;
