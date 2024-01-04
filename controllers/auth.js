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
      expiresIn: '1h',
    }
  );
  return jwtToken;
};

const register = async (req, res) => {
  const { fullName, email, password, user_type } = req.body;

  const verifyEmail = await userModel.findOne({ email: email });
  try {
    if (verifyEmail) {
      return res.status(403).json({
        message: 'Email already used',
      });
    } else {
      //using bcrypt to hash the password sent from the user
      bcrypt.hash(req.body.password, 10).then((hash) => {
        const user = new userModel({
          fullName: fullName,
          email: email,
          password: hash,
          user_type: user_type,
        });

        user
          .save()
          .then((response) => {
            return res.status(201).json({
              message: 'user successfully created!',
              result: response,
              success: true,
              accessToken: signJwt(response),
            });
          })
          .catch((error) => {
            res.status(500).json({
              error: error,
            });
          });
      });
    }
  } catch (error) {
    return res.status(412).send({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  let getUser;

  userModel
    .findOne({
      email: email,
    })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: 'Authentication Failed',
        });
      }
      getUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((response) => {
      if (!response) {
        return res.status(401).json({
          message: 'Authentication Failed',
        });
      } else {
        return res.status(200).json({
          accessToken: signJwt(getUser),
          result: getUser,
          success: true,
        });
      }
    })
    .catch((err) => {
      return res.status(401).json({
        message: err.message,
        success: false,
      });
    });
};

const userProfile = async (req, res, next) => {
  const { id } = req.params;

  try {
    const verifyUser = await userModel.findById(id);
    if (!verifyUser) {
      return res.status(403).json({
        message: 'user not found',
        success: false,
      });
    } else {
      return res.status(200).json({
        message: `user ${verifyUser.fullName}`,
        data: verifyUser,
        success: true,
        userData: req.userData,
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const users = async (req, res) => {
  try {
    const users = await userModel.find();
    return res.status(200).json({
      data: users,
      success: true,
      message: 'users list',
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  userProfile,
  users,
};
