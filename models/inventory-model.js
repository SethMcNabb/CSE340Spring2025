const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get vehicle details by ID
 * ************************** */
async function getVehicleById(vehicleId) {
  try {
    const query = "SELECT * FROM public.inventory WHERE inv_id = $1";
    const result = await pool.query(query, [vehicleId]);
    if (result.rows.length === 0) {
      console.log(`No vehicle found with inv_id: ${vehicleId}`);
      return null; // Return null instead of throwing an error
    }
    return result.rows[0];
  } catch (error) {
    console.error("getVehicleById error: " + error);
    throw error; // Re-throw the error for further handling
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById};