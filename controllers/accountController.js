const utilities = require('../utilities');
const accountModel = require('../models/account-model');


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
    })
}

/* ****************************************
*  Deliver Registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
/* https://byui-cse.github.io/cse340-ww-content/views/server-validation.html
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}
*/

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  console.log('Inserting user:', { account_firstname, account_lastname, account_email, account_password });
  const regResult = await accountModel.registerAccount(account_firstname, account_lastname, account_email, account_password);
  console.log('Registration result:', regResult);

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you are registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}



module.exports = {buildLogin,buildRegister,registerAccount}
