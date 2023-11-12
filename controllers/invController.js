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
    title: className + " " + "vehicles",
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
invCont.buildManagement = async function (req, res, next){
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
      title: "Management",
      nav,
  })
}
invCont.buildNewClass = async function (req, res, next){
  let nav = await utilities.getNav()
  res.render("./inventory/newclass", {
      title: "newclass",
      nav,
      errors: null,
  })
}
 invCont.registerNewClass = async function(req, res){
  let nav = await utilities.getNav()
  const{
    classification_name,
  } = req.body
  const reqResult = await invModel.registerNewClass(
    classification_name,
  )
  if (reqResult){
      req.flash(
          "notice",
          `Congratilations, you\'re registered ${classification_name}. Please log in.`
      )
      res.status(201).render("./inventory/management", {
          title: "Management",
          nav,
      })
  } else{
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("./inventory/newclass", {
          title: "newclass",
          nav,
          errors: null,
      })
  }
}
 invCont.registerNewInv = async function(req, res){

  let nav = await utilities.getNav()
  const{
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color

  } = req.body
  const reqResult = await invModel.registerNewInv(
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  )
  if (reqResult){
      req.flash(
          "notice",
          `Congratilations, you\'ve registered new inventory.`
      )
      res.redirect("/inv/")
  } else{
     //const data = await invModel.getInventoryByClassificationId(classification_id)
     const classificationList = await utilities.buildClassificationList()
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("./inv/newinv", {
          title: "add inventory",
          nav,
          classificationList,
          errors: null,
      })
  }
}
invCont.buildNewInv = async function (req, res, next){
  const classificationList = await utilities.buildClassificationList()
  let nav = await utilities.getNav()
  res.render("./inventory/newinv", {
      title: "newinv",
      nav,
      classificationList,
      errors: null,
  })
}

module.exports = invCont