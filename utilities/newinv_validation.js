const utilities = require(".")
const invModel = require("../models/inventory-model")
const{body, validationResult} = require("express-validator")
const validate = {}
validate.registationRules = () => {
    return[
        body("classification_id")
        .isLength({min:1})
        .withMessage("Please provide a classification name."),
        body("inv_make")
        .isLength({min:1})
        .withMessage("Please provide a make for the car.")
        .custom(async (inv_make)=>
        {
            const invalidType = await invModel.checkString(inv_make)
            if (invalidType){
                throw new Error("Wrong type input, it must be a string with no white-spaces")
            }
        }), 
        body("inv_model")
        .isLength({min:1})
        .withMessage("Please provide a model for the car."), 
        body("inv_year")
        .isNumeric()
        .isLength({min:1 ,max: 4})
        .withMessage("Please provide a valid year number for the car."), 
        body("inv_description")
        .isLength({min:1})
        .withMessage("Please provide a description for the car."), 
        body("inv_image")
        .isLength({min:1})
        .withMessage("Please provide an image url."), 
        body("inv_thumbnail")
        .isLength({min:1})
        .withMessage("Please provide a thumbnail image url."), 
        body("inv_price")
        .trim()
        .isInt()
        .isLength({min:1})
        .withMessage("Please provide a price for the car."), 
        body("inv_miles")
        .trim()
        .isNumeric()
        .isLength({min:1})
        .withMessage("Please provide a mile number for the car."), 
        body("inv_color")
        .isLength({min:1})
        .withMessage("Please provide a color name.")
        .custom(async (inv_color)=>
        {
            const invalidType = await invModel.checkString(inv_color)
            if (invalidType){
                throw new Error("Wrong type input, it must be a string with no white-spaces")
            }
        }) 
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
        res.render("./inventory/newinv",{
            errors,
            title: "Add new inventory",
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