const jwt = require("jsonwebtoken")
require("dotenv").config()
const bcrypt = require("bcryptjs")
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
      errors: [],
      account_email: ""
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
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  console.log('Inserting user:', { account_firstname, account_lastname, account_email, account_password });
  const regResult = await accountModel.registerAccount(account_firstname, account_lastname, account_email, hashedPassword);
  console.log('Registration result:', regResult);

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you are registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      account_email: ""
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      req.session.accountData = {
        account_id: accountData.account_id,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
        account_type: accountData.account_type
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    messages: req.flash(),
    errors: null,
    accountData: res.locals.accountData
  })
}

async function buildUpdateAccount(req, res) {
  let nav = await utilities.getNav()
  const account_id = parseInt(req.params.account_id)
  const accountData = await accountModel.getAccountById(account_id)
  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: [],
    accountData,
    messages: req.flash()
  })
}

async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  const updateResult = await accountModel.updateAccountInfo(account_id, account_firstname, account_lastname, account_email)
  if (updateResult) {
    req.flash("notice", "Account information updated successfully.")
    // Get updated data
    const accountData = await accountModel.getAccountById(account_id)
    res.render("account/management", {
      title: "Account Management",
      nav,
      messages: req.flash(),
      errors: null,
      accountData
    })
  } else {
    req.flash("error", "Account update failed. Please try again.")
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: [],
      accountData: req.body,
      messages: req.flash()
    })
  }
}

async function updatePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_password } = req.body
  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)
    const updateResult = await accountModel.updateAccountPassword(account_id, hashedPassword)
    if (updateResult) {
      req.flash("notice", "Password updated successfully.")
      const accountData = await accountModel.getAccountById(account_id)
      res.render("account/management", {
        title: "Account Management",
        nav,
        messages: req.flash(),
        errors: null,
        accountData
      })
    } else {
      req.flash("error", "Password update failed. Please try again.")
      res.render("account/update", {
        title: "Update Account",
        nav,
        errors: [],
        accountData: await accountModel.getAccountById(account_id),
        messages: req.flash()
      })
    }
  } catch (error) {
    req.flash("error", "There was an error updating your password.")
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: [],
      accountData: await accountModel.getAccountById(account_id),
      messages: req.flash()
    })
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement,
  buildUpdateAccount,
  updateAccount,
  updatePassword
}
