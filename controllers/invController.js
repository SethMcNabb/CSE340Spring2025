const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 * Build vehicle detail view
 * ************************** */
invCont.buildVehicleDetails = async function (req, res, next) {
  try {
    const vehicleId = req.params.vehicleId;
    const vehicleData = await invModel.getVehicleById(vehicleId);

    if (!vehicleData) { 
      return res.status(404).render("404"); 
    }

    let nav = await utilities.getNav(); 

    console.log("Title:", `${vehicleData.inv_make} ${vehicleData.inv_model}`);

    res.render("inventory/detail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`, 
      nav, 
      vehicleData, 
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Internal Server Error' }); 
  }
};

/* ***************************
 * Build inventory management view
 * ************************** */
invCont.buildManagement = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    messages: req.flash()
  })
}

invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: [],
    messages: req.flash()
  })
}

invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  try {
    await invModel.addClassification(classification_name)
    req.flash("notice", "Classification added successfully!")
    nav = await utilities.getNav()
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      messages: req.flash()
    })
  } catch (error) {
    req.flash("error", "Failed to add classification.")
    res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: [{ msg: error.message }],
      messages: req.flash()
    })
  }
}

invCont.buildAddInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: [],
    messages: req.flash()
  })
}

invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList(req.body.classification_id)
  const {
    classification_id, inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
  } = req.body

  try {
    await invModel.addInventory(
      classification_id, inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
    )
    req.flash("notice", "Inventory item added successfully!")
    nav = await utilities.getNav()
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      messages: req.flash()
    })
  } catch (error) {
    req.flash("error", "Failed to add inventory item.")
    res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: [{ msg: error.message }],
      messages: req.flash(),
      ...req.body // sticky fields
    })
  }
}

module.exports = invCont