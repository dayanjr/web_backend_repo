const utilities = require(".")
const accountModel = require("../models/account-model")
const{body, validationResult} = require("express-validator")
const validate = {}
validate.updateRules = () => {
    return[
        body("account_firstname")
        .trim()
        .isString()
        .isLength({min: 1})
        .withMessage("Please provide a first name."),
        body("account_lastname")
        .trim()
        .isString()
        .isLength({min: 1})
        .withMessage("Please provide a last name."),
        body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("A valid email is required."),
        body("account_type")
        .trim()
        .isString()
        .isLength({min: 1})
        .withMessage("Please provide a type."),
    ]
}
validate.checkUpData = async(req,res,next)=>{
    const{account_firstname, account_lastname, account_email, account_type,}=
    req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()){
        let nav = await utilities.getNav()
        const itemName = `${account_firstname} ${account_lastname}`
        res.render("account/edit-account",{
            errors,
            title: "Edit " + itemName,
            nav,
            account_firstname,
            account_lastname,
            account_email,
            account_type,
        })
        return
    }
    next()
}
module.exports = validate