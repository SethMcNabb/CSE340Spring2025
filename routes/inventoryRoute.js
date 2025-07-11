const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")

router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

router.get(
  "/detail/:vehicleId",
  utilities.handleErrors(invController.buildVehicleDetails)
);

router.get(
  '/', 
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildManagement)
);

router.get(
  "/add-classification",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddClassification)
)

router.post(
  "/add-classification",
  utilities.checkEmployeeOrAdmin,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

router.get(
  "/add-inventory",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddInventory)
)

router.post(
  "/add-inventory",
  utilities.checkEmployeeOrAdmin,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

router.get(
  "/getInventory/:classification_id",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.getInventoryJSON)
);

router.get(
  "/edit/:inventory_id",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildEditInventory)
);

router.post(
  "/update/",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.updateInventory)
)

router.get(
  "/delete/:inventory_id",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildDeleteConfirm)
);

router.post(
  "/delete/",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.deleteInventoryItem)
);

module.exports = router;