const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const jwt = require("jsonwebtoken")

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
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
      title: "Management",
      nav,
      errors: null,
      classificationSelect,
  })
}
invCont.buildNewClass = async function (req, res, next){
  let nav = await utilities.getNav()
  res.render("./inventory/newclass", {
      title: "Add new class",
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
          `Congratilations, you\'ve registered a new ${classification_name}.`
      )
      res.redirect("/inv/")
  } else{
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("./inventory/newclass", {
          title: "Add new class",
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
      res.status(501).render("./inventory/newinv", {
          title: "Add new inventory",
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
      title: "Add new inventory",
      nav,
      classificationList,
      errors: null,
  })
}
/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}
/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInv_Id(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData[0].classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
}
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}
invCont.deleteView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInv_Id(inv_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_price: itemData[0].inv_price, 
  })
}
invCont.deleteItem = async function (req, res, next) { 
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id)  
  const deleteResult = await invModel.deleteInventoryItem(inv_id) 
  if(deleteResult){
    req.flash("notice", "The item was successfully deleted.")
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the delete failed.")  
    res.redirect("/inv/delete/" + inv_id)
  }
}
module.exports = invCont