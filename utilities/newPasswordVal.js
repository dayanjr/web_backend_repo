const utilities = require(".")
const accountModel = require("../models/account-model")
const{body, validationResult} = require("express-validator")
const validate = {}
validate.updatePassword = () => {
    return[
        body("account_id"),
        body("account_password")
        .trim()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Password does not meet requirements.")
    ]
}
validate.checkPasswordData = async(req,res,next)=>{
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()){
        const{account_id}=
    req.body
        let nav = await utilities.getNav()
        const itemData = await accountModel.getAccountByAccount_Id(account_id)
        const itemName = `${itemData[0].account_firstname} ${itemData[0].account_lastname}`
        res.render("account/edit-account",{
            errors,
            title: "Edit " + itemName,
            nav,
            account_id: itemData[0].account_id,
            account_firstname: itemData[0].account_firstname,
            account_lastname: itemData[0].account_lastname,
            account_email: itemData[0].account_email,
            account_type: itemData[0].account_type,
        })
        return
    }
    next()
}
module.exports = validate