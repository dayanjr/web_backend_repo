const utilities = require(".")
const accountModel = require("../models/account-model")
const{body, validationResult} = require("express-validator")
const validate = {}
validate.registationRules = () => {
    return[
        body("classification_id")
        .trim()
        .isString()
        .isLength({min:1})
        .withMessage("Please provide a classification name."), 
        body("inv_make")
        .trim()
        .isString()
        .isLength({min:1 ,max: 3})
        .withMessage("Please provide a classification name."), 
        body("inv_model")
        .trim()
        .isString()
        .isLength({min:1 ,max: 3})
        .withMessage("Please provide a classification name."), 
        body("inv_year")
        .trim()
        .isString()
        .isLength({min:1 ,max: 3})
        .withMessage("Please provide a classification name."), 
        body("inv_description")
        .trim()
        .isString()
        .isLength({min:1 ,max: 3})
        .withMessage("Please provide a classification name."), 
        body("inv_image")
        .trim()
        .isString()
        .isLength({min:1 ,max: 3})
        .withMessage("Please provide a classification name."), 
        body("inv_thumbnail")
        .trim()
        .isString()
        .isLength({min:1 ,max: 3})
        .withMessage("Please provide a classification name."), 
        body("inv_price")
        .trim()
        .isString()
        .isLength({min:1 ,max: 3})
        .withMessage("Please provide a classification name."), 
        body("inv_miles")
        .trim()
        .isString()
        .isLength({min:1 ,max: 3})
        .withMessage("Please provide a classification name."), 
        body("inv_color")
        .trim()
        .isString()
        .isLength({min:1 ,max: 3})
        .withMessage("Please provide a classification name.") 
    ]
}
validate.checkRegData = async(req,res,next)=>{
    const{classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color}=
    req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()){
        let nav = await utilities.getNav()
        const classificationList = await utilities.buildClassificationList(classification_id)
        res.render("./account/newinv",{
            errors,
            title: "newinv",
            nav,
            classificationList,
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color
        })
        return
    }
    next()
}
module.exports = validate