const validator = require("../utils/validate");
const productValidator = async (req, res, next) => {
  const validateRule = {
    seller: "required",
    name: "required|string",
    minimumBidAmount: "required",
  };

  await validator(req.body, validateRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  }).catch((err) => console.log(err));
};

//Exporting the validation function to make it available in every modules
module.exports = {
  productValidator,
};
