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

module.exports = invCont