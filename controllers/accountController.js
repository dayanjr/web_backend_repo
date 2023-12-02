const accountModel = require('../models/account-model')
const utilities = require('../utilities')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()
async function buildLogin(req, res, next){
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
    })
}
module.exports = { buildLogin}
async function logoutFunct(req, res, next){
   res.clearCookie("jwt")
   res.redirect("/")
   return
}
module.exports = { buildLogin , logoutFunct}
async function buildRegister(req, res, next){
    let nav= await utilities.getNav()
    res.render("account/register",{
        title: "Register",
        nav,
        errors: null,
    })
}
module.exports = {buildLogin, buildRegister, logoutFunct}
async function registerAccount(req, res){
    let nav = await utilities.getNav()
    const{
        account_firstname,
        account_lastname,
        account_email,
        account_password,
    } = req.body
    let hashedPassword 
try{
    hashedPassword = await bcrypt.hashSync(account_password, 10)
} catch(error) {
    req.flash("notice",
        "Sorry, there was an error processing the registration."
    )
    res.status(500).render("account/register", {
        title: "Registration",
        nav,
    })
}
    const reqResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )
    if (reqResult){
        req.flash(
            "notice",
            `Congratilations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
        })
    } else{
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }
}
async function accountLogin(req, res){
    let nav = await utilities.getNav()
    const{ account_email, account_password} = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if(!accountData){
        req.flash("notice","Please check your credentials and try again.")
        res.status(400).render("account/login",{
            title:"Login",
            nav,
            errors:null,
            account_email,
        })
        return
    }
    try{
        if (await bcrypt.compare(account_password, accountData.account_password)){
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600 * 1000})
            res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 * 1000})
            return res.redirect("/account/")
        }
    } catch(error){
        return new Error('Access Forbidden')
    }
}
async function buildManagement(req, res, next){
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    res.render("./inventory/management", {
        title: "Management",
        nav,
        errors: null,
        classificationSelect,
    })
  }
async function buildAccountManagement(req, res, next){
    let nav = await utilities.getNav()
    //const itemName = `${itemData[0].account_firstname} ${itemData[0].account_lastname}`
    //const classificationSelect = await utilities.buildClassificationList()
    res.render("./account/accountManagement", {
        title: "Account Management",
        nav,
        errors: null,
    })
  }
  async function editAccountView (req, res, next) {
    const account_id = parseInt(req.params.account_id)
    let nav = await utilities.getNav()
    const itemData = await accountModel.getAccountByAccount_Id(account_id)
    const itemName = `${itemData[0].account_firstname} ${itemData[0].account_lastname}`
    res.render("./account/edit-account", {
      title: "Edit " + itemName,
      nav,
      errors: null,
      account_id: itemData[0].account_id,
      account_firstname: itemData[0].account_firstname,
      account_lastname: itemData[0].account_lastname,
      account_email: itemData[0].account_email,
      account_type: itemData[0].account_type,
  
    })
  }
   async function updateAccount(req, res, next){
    let nav = await utilities.getNav()
    const{
      account_firstname,
      account_lastname,
      account_email,
      account_type,
      account_password,
      account_id,
  
    } = req.body
    const itemData = await accountModel.getAccountByEmail(account_email)
    const itemName = `${itemData[0].account_firstname} ${itemData[0].account_lastname}`
    let hashedPassword 
    try{
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch(error) {
        
        req.flash("notice",
            "Sorry, there was an error processing the registration."
        )
        res.status(500).render("account/edit-account", {
            title: "Edit " + itemName,
            nav,
        })
    }
    const reqResult = await accountModel.updateAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_type,
      hashedPassword,
      account_id,
    )
    if (reqResult){
        req.flash(
            "notice",
            `Congratilations, you\'ve successfully update your account.` 
        )
        res.clearCookie("jwt")
        const accessToken = jwt.sign(itemData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600 * 1000})
        res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 * 1000})
        return res.redirect("/account/")
    } else{
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("./account/accountManagement", {
            title: "Account Management",
            nav,
            errors: null,
        })
    }
  }
   async function updatePassword(req, res, next){
    let nav = await utilities.getNav()
    const{
      account_password,
      account_id,
    } = req.body
    const itemData = await accountModel.getAccountByAccount_Id(account_id)
    const itemName = `${itemData[0].account_firstname} ${itemData[0].account_lastname}`
    let hashedPassword 
    try{
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch(error) {
        req.flash("notice",
            "Sorry, there was an error on updating."
        )
        res.status(500).render("account/edit-account", {
            title: "Edit " + itemName,
            nav,
        })
    }
    //const itemData = await accountModel.getAccountByAccount_Id(account_id)
    const reqResult = await accountModel.updatePassword(
      hashedPassword,
      account_id,
    )
    if (reqResult){
        req.flash(
            "notice",
            `Congratilations, you\'ve registered new inventory.` 
        )
        //delete accountData.account_password
        //res.clearCookie("jwt")
        //const accessToken = jwt.sign(itemData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600 * 1000})
        //res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 * 1000})
        //return res.redirect("/account/")
        res.redirect("/account/")
    } else{
       //const data = await invModel.getInventoryByClassificationId(classification_id)
       //const classificationList = await utilities.buildClassificationList()
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("./account/accountManagement", {
            title: "Account Management",
            nav,
            errors: null,
        })
    }
  }
module.exports = {buildLogin, buildRegister, registerAccount, accountLogin, buildManagement, logoutFunct, buildAccountManagement, editAccountView,updateAccount,updatePassword}