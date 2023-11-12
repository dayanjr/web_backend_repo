const utilities = require(".")
const invModel = require("../models/inventory-model")
const{body, validationResult} = require("express-validator")
const validate = {}
validate.registationRules = () => {
    return[
        body("classification_name")
            .isLength({min:1})
            .withMessage("Please provide a classification name.")
            .custom(async (classification_name)=>
        {
            const invalidType = await invModel.checkString(classification_name)
            if (invalidType){
                throw new Error("Wrong type input, it must be a string with no white-spaces")
            }
        }), 
    ]
}
validate.checkRegData = async(req,res,next)=>{
    const{classification_name}=
    req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()){
        let nav = await utilities.getNav()
        res.render("./inventory/newclass",{
            errors,
            title: "Add new class",
            nav,
            classification_name,
        })
        return
    }
    next()
}
module.exports = validate