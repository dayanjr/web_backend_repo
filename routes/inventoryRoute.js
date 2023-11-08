// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInventoryId));
router.get("/", utilities.handleErrors(invController.buildManagement));
router.get("/newinv", utilities.handleErrors(invController.buildNewInv))
router.get("/newclass", utilities.handleErrors(invController.buildNewClass))
router.post("/newclass", utilities.handleErrors(invController.registerNewClass))
module.exports = router;
