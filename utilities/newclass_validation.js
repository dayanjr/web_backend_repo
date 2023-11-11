const utilities = require(".")
const accountModel = require("../models/account-model")
const{body, validationResult} = require("express-validator")
const validate = {}
validate.registationRules = () => {
    return[
        body("classification_name")
        .trim()
        .isString()
        .isLength({min:1 ,max: 5})
        .withMessage("Please provide a classification name.") 
    ]
}
validate.checkRegData = async(req,res,next)=>{
    const{classification_name}=
    req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()){
        let nav = await utilities.getNav()
        res.render("./account/newclass",{
            errors,
            title: "newclass",
            nav,
            classification_name,
        })
        return
    }
    next()
}
module.exports = validate