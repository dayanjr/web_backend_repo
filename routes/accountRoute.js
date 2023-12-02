const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account_validation")
const utilities = require("../utilities")
//router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))
router.get("/logout", utilities.handleErrors(accountController.logoutFunct))
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.post("/login",
//regValidate.loginRules(),
//regValidate.checkLogindata,
utilities.handleErrors(accountController.accountLogin)
)
router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.post("/register", regValidate.registationRules(), regValidate.checkRegData,
utilities.handleErrors(accountController.registerAccount))
router.get("/editaccount/:account_id", utilities.handleErrors(accountController.editAccountView))
router.post("/updateaccount/", accountController.updateAccount)
router.post("/updatepassword/", accountController.updatePassword)
module.exports = router