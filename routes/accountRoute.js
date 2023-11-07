const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account_validation")
const utilities = require("../utilities")
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.post("/register", regValidate.registationRules(), regValidate.checkRegData,
utilities.handleErrors(accountController.registerAccount))
module.exports = router