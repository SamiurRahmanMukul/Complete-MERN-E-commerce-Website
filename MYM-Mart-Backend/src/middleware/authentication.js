const User = require("../models/users.model");
const jwt = require("jsonwebtoken");

// make a middleware for identify authenticated authorized user
exports.isAuthenticatedUser = async (req, res, next) => {
  try {
    // get token form cookie
    const { AccessToken } = req.cookies;

    if (!AccessToken) {
      return res.status(401).json({
        statusCode: 401,
        message: "Unauthorized access. Please login to continue.",
      });
    } else {
      // verify token
      const decoded = jwt.verify(AccessToken, process.env.JWT_SECRET_KEY);

      // check if user exists
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          statusCode: 401,
          message: "Unauthorized access. Please login to continue.",
        });
      } else {
        // check if user is logged in
        if (user.status === "login") {
          next();
        } else {
          return res.status(401).json({
            statusCode: 401,
            message: "Unauthorized access. Please login to continue.",
          });
        }
      }
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: "User identify failed.",
      error: error,
    });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    // get token form cookie
    const { AccessToken } = req.cookies;

    if (!AccessToken) {
      return res.status(401).json({
        statusCode: 401,
        message: "Unauthorized access. Please login to continue.",
      });
    } else {
      // verify token
      const decoded = jwt.verify(AccessToken, process.env.JWT_SECRET_KEY);

      // check if user exists
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          statusCode: 401,
          message: "Unauthorized access. Please login to continue.",
        });
      } else {
        // check if user is logged in
        if (user.status === "login" && user.role === "admin") {
          next();
        } else {
          return res.status(401).json({
            statusCode: 401,
            message: "Unauthorized access. Only authorized user access here.",
          });
        }
      }
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: "User identify failed.",
      error: error,
    });
  }
};

// make a middleware for api routes using jwt token
exports.isAuthenticatedApiFetcher = async (req, res, next) => {
  try {
    // get token form headers
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({
        statusCode: 401,
        message: "Unauthorized access. Please login to continue.",
      });
    } else {
      // verify token
      const token = authorization.split(" ")[1];

      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, result) => {
        if (err) {
          return res.status(401).json({
            statusCode: 401,
            message: "Unrecognized access can not be allowed.",
            error: err,
          });
        } else {
          const { url } = result;
          const splitUrl = url.split(process.env.APP_API_PREFIX)[1];

          if (url && splitUrl === req.url) {
            next();
          } else {
            res.status(401).json({
              statusCode: 401,
              message: "Unrecognized access can not be allowed w.",
            });
          }
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: "Unrecognized access can not be allowed.",
      error: error,
    });
  }
};
