const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

// from inventoryRoute
router.get(
  "/",
  utilities.handleErrors(accountController.buildLogin)
);

module.exports = router;
