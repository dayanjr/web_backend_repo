const accountModel = require('../models/account-model')
const utilities = require('../utilities')
const bcrypt = require("bcryptjs")
async function buildLogin(req, res, next){
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
    })
}
module.exports = { buildLogin }
async function buildRegister(req, res, next){
    let nav= await utilities.getNav()
    res.render("account/register",{
        title: "Register",
        nav,
        errors: null,
    })
}
module.exports = {buildLogin, buildRegister}
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

module.exports = {buildLogin, buildRegister, registerAccount}