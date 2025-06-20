const regValidate = require('../utilities/account-validation')
const express = require('express');
const router = express.Router();
const utilities = require('../utilities');
const accountController = require('../controllers/accountController');

// Login Routes
router.get('/login', utilities.handleErrors(accountController.buildLogin()))

// Registration Routes
router.get('/register', utilities.handleErrors(accountController.buildRegister()))
// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

module.exports = router;

