// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

module.exports = router;
//// Needed Resources 
//const express = require("express")
//const router = new express.Router() 
//controller
//const invController = require("../controllers/invController")
//utilities
//const utilities = require("../utilities")
//// Route to build inventory by classification view
//router.get("/detail/:classificationId", invController.buildByClassificationId);
//
//module.exports = router;
