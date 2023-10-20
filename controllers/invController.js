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
    title: className + "vehicles",
    nav,
    grid,
  })
}
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inv_id
  const data = await invModel.getInventoryByInv_Id(inv_id)
  const grid = await utilities.buildDetailGrid(data)
  const inv_make = data[0].inv_make;
  const inv_model = data[0].inv_model;
  let nav = await utilities.getNav()
  res.render("./inventory/classification", {
    title: inv_make + ' ' + inv_model,
    nav,
    grid,
  })
}
module.exports = invCont