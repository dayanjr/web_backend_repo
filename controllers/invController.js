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

module.exports = invCont
//required models
//const invModel = require("../models/inventory-model")
//required utilities
//const utilities = require("../utilities/")
//
//const invCont = {}
//
///* ***************************
// *  Build inventory by classification view
// * ************************** */
//invCont.buildByClassificationId = async function (req, res, next) {
//  const classification_id = req.params.classificationId
    //model, that is meant to get the data from database
//  const data = await invModel.getInventoryByClassificationId(classification_id)
    //utilities that builds the grid
//  const grid = await utilities.buildClassificationGrid(data)
    //utilities that builds the nav
//  let nav = await utilities.getWhatever()
//  const className = data[0].classification_name
//  res.render("./inventory/classification", {
//    title: className + " vehicles",
//    nav,
//    grid,
//  })
//}
//
//module.exports = invCont