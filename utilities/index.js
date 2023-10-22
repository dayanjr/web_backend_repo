const invModel = require("../models/inventory-model")
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
        <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
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
       <img src="${inv_thumbnail}" alt="Image of ${inv_make} ${inv_model} on CSE Motors" />
     </a>
       <div>
        <h1><strong>${inv_make} ${inv_model} details</strong></h1>
        <h1><strong>Price:</strong> $${inv_price}</h1>
        <h1><strong>Description:</strong> ${inv_description}</h1> 
        <h1><strong>Color:</strong> ${inv_color}</h1>
        <h1><strong>Miles:</strong> ${inv_miles}</h1>
   </div>
   </li>
 `;
  });
  return '<ul id="inv-display">' + gridItems.join('') + '</ul>';
};
module.exports = Util
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)