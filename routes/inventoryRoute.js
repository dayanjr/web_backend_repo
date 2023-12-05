// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const NewClassValidate = require("../utilities/newclass_validation")
const NewInvValidate = require("../utilities/newinv_validation")
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInventoryId));
router.get("/", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildManagement));
router.get("/newinv",utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildNewInv))
router.post("/newinv",NewInvValidate.registationRules(),NewInvValidate.checkRegData,utilities.handleErrors(invController.registerNewInv))
router.get("/newclass",utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildNewClass))
router.post("/newclass",NewClassValidate.registationRules(),NewClassValidate.checkRegData,utilities.handleErrors(invController.registerNewClass))
router.get("/getInventory/:classification_id", utilities.checkLogin, utilities.checkAccountType,utilities.handleErrors(invController.getInventoryJSON))
router.get("/edit/:inv_id",utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.editInventoryView))
router.post("/update/", invController.updateInventory)
router.get("/delete/:inv_id", utilities.checkLogin, utilities.checkAccountType,utilities.handleErrors(invController.deleteView))
router.post("/delete", utilities.handleErrors(invController.deleteItem))


module.exports = router;
