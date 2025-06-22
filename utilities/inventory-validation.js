const utilities = require("../utilities")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.classificationRules = () => [
  body("classification_name")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Classification name must be 3-50 characters.")
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("No spaces or special characters allowed.")
]

validate.checkClassificationData = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav: res.locals.nav,
      errors: errors.array(),
      messages: req.flash()
    })
  }
  next()
}

validate.inventoryRules = () => [
  body("classification_id").notEmpty().withMessage("Classification is required."),
  body("inv_make").trim().isLength({ min: 1 }).withMessage("Make is required."),
  body("inv_model").trim().isLength({ min: 1 }).withMessage("Model is required."),
  body("inv_year").isInt({ min: 1900, max: 2025 }).withMessage("Year must be valid."),
  body("inv_description").trim().isLength({ min: 1 }).withMessage("Description is required."),
  body("inv_image").trim().isLength({ min: 1 }).withMessage("Image path is required."),
  body("inv_thumbnail").trim().isLength({ min: 1 }).withMessage("Thumbnail path is required."),
  body("inv_price").isFloat({ min: 0 }).withMessage("Price must be a positive number."),
  body("inv_miles").isInt({ min: 0 }).withMessage("Miles must be a positive integer."),
  body("inv_color").trim().isLength({ min: 1 }).withMessage("Color is required.")
]

validate.checkInventoryData = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    utilities.buildClassificationList(req.body.classification_id).then(classificationList => {
      res.render("inventory/add-inventory", {
        title: "Add Inventory",
        nav: res.locals.nav,
        classificationList,
        errors: errors.array(),
        messages: req.flash(),
        ...req.body // sticky fields
      })
    })
    return
  }
  next()
}

module.exports = validate