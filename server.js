/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
*************************/
console.log("Require 1");
const express = require("express")
console.log("Require 2");
const expressLayouts = require("express-ejs-layouts")
console.log("Require 3");
const env = require("dotenv").config()
console.log("Require 4");
const app = express()
console.log("Require 5");
const static = require("./routes/static")
console.log("Require 6");
const baseController = require("./controllers/baseController")
console.log("Require 7");
const inventoryRoute = require("./routes/inventoryRoute")
console.log("Require 8");
const accountRoute = require("./routes/accountRoute")
console.log("Require 9");
const utilities = require("./utilities")
console.log("Require 10");
const session = require("express-session")
console.log("Require 11");
const pool = require('./database/')
console.log("Require 12");
const bodyParser = require("body-parser")
console.log("Require 13");
const cookieParser = require("cookie-parser")

/* ***********************
 * Middleware
 * ************************/
console.log("Middleware");
 app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// Body Parser Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())

app.use(utilities.checkJWTToken)

app.use((req, res, next) => {
  res.locals.accountData = req.session.accountData || null
  next()
})

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
console.log("Routes");
app.use(static)
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))
// Inventory route
app.use("/inv", inventoryRoute)
// Account route
app.use("/account", accountRoute)
// Test Server Error Route
app.get("/error-test", (req, res, next) => {
  next(new Error("This is a test server error!"));
});
// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})



/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
console.log("Express Error Handler");
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
console.log("Local Server Info");
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
console.log("ENV PORT:", process.env.PORT)
console.log("ENV HOST:", process.env.HOST)
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})