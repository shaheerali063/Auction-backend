const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user');

const signJwt = (user) => {
  let jwtToken = jwt.sign(
    {
      email: user.email,
      id: user.id,
      role: user.user_type,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '3d',
    }
  );
  return jwtToken;
};

const register = async (req, res) => {
  const { fullName, email, password, user_type } = req.body;

  try {
    const verifyEmail = await userModel.findOne({ email: email });

    if (verifyEmail) {
      return res.status(403).json({
        message: 'Email already used',
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = new userModel({
      fullName: fullName,
      email: email,
      password: hash,
      user_type: user_type,
    });

    const response = await user.save();

    return res.status(201).json({
      message: 'User successfully created!',
      result: response,
      success: true,
      accessToken: signJwt(response),
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res.status(401).json({
        message: 'Authentication Failed',
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Authentication Failed',
      });
    }

    return res.status(200).json({
      accessToken: signJwt(user),
      result: user,
      success: true,
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message,
      success: false,
    });
  }
};

module.exports = {
  register,
  login,
};
