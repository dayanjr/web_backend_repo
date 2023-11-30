const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}
/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  if (data.length === 0) {
    return '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }

  const gridItems = data.map(vehicle => `
  <li>
      <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
        <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" class="list-img"/>
      </a>
      <div class="namePrice">
        <hr />
        <h2>
          <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
            ${vehicle.inv_make} ${vehicle.inv_model}
          </a>
        </h2>
        <span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
      </div>
    </li>
  `);

  return `<ul id="inv-display">${gridItems.join('')}</ul>`;
};
Util.buildClassificationList = async function (classification_id = null){
  let data = await invModel.getClassifications();
  let classificationList =
  '<select name="classification_id" id="classificationList">'
  classificationList += "<option required>Choose a Classification</option>"
  data.rows.forEach((row) =>{
    classificationList += '<option value="' + row.classification_id + '"'
    if(
      classification_id != null && 
      row.classification_id == classification_id
      ){
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}
Util.buildLogin = async function() {
  return `
    <form id="classification-form">
      <label for="make">Make:</label>
      <select name="make" id="make">
        <option value="Toyota">Toyota</option>
        <option value="Honda">Honda</option>
        <option value="Ford">Ford</option>
        <!-- Add more make options as needed -->
      </select>
      
      <label for="model">Model:</label>
      <select name="model" id="model">
        <option value="Corolla">Corolla</option>
        <option value="Civic">Civic</option>
        <option value="Focus">Focus</option>
        <!-- Add more model options as needed -->
      </select>
      
      <label for="price-range">Price Range:</label>
      <input type="range" name="price-range" id="price-range" min="0" max="50000" step="1000">
      
      <button type="submit">Search</button>
    </form>
  `;
};

/* **************************************
* Build the detail view HTML
* ************************************ */
Util.buildDetailGrid = async function(data){
  if (data.length === 0) {
    return '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }

  const gridItems = data.map(vehicle => {  
     const {
    inv_id,
    inv_make,
    inv_model,
    inv_thumbnail,
    inv_price,
    inv_description,
    inv_color,
    inv_miles,
   } = vehicle;
   return`
   <li id="displayer">
     <a href="../../inv/detail/${inv_id}" title="View ${inv_make} ${inv_model} details">
       <img src="${inv_thumbnail}" alt="Image of ${inv_make} ${inv_model} on CSE Motors" class="detail-img"/>
     </a>
       <div>
        <h1><strong>${inv_make} ${inv_model} details</strong></h1>
        <h1><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(inv_price)}</h1>
        <h1><strong>Description:</strong> ${inv_description}</h1> 
        <h1><strong>Color:</strong> ${inv_color}</h1>
        <h1><strong>Miles:</strong> ${new Intl.NumberFormat('en-US').format(inv_miles)}</h1>
   </div>
   </li>
 `;
  });
  return '<ul id="inv-display">' + gridItems.join('') + '</ul>';
};
Util.checkJWTToken = (req,res,next)=>{
  if(req.cookies.jwt){
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData){
        if(err){
          req.flash("notice","Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      })
  } else{
    next()
  }
}
Util.destroyCookie = (req,res,next)=>{
  res.clearCookie("jwt")
  next()
}
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }
module.exports = Util
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)