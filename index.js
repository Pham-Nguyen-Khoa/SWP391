const express = require("express");
const bodyParser = require('body-parser')
const app = express();
const port = process.env.PORT || 7777;
const sequelize = require("./config/database"); // Database
const methodOverride = require('method-override')
const systemConfig = require("./config/system")

const route = require("./router/client/index.route")
const routeAdmin = require("./router/admin/index.route")
const routeDoctor = require("./router/doctor/index.route")
const routeStaff = require("./router/staff/index.route")
// Flash 
const flash = require('express-flash')
const cookieParser = require(`cookie-parser`)
const session = require(`express-session`)

// // Middleware to parse JSON bodies
app.use(express.json());

sequelize; // Database

//[PATCH]
app.use(methodOverride('_method'))

// bodyParser để nhận req.body
app.use(bodyParser.urlencoded({ extended: false }))

// [ENV]
require('dotenv').config(); 


//Flash
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

app.set('views', './views')
app.set('view engine', 'pug')

app.use(express.static(`public`));


// Router

route(app);
routeAdmin(app);
routeDoctor(app);
routeStaff(app);






// Biến admin local 
app.locals.prefixAdmin = systemConfig.prefixAdmin; 
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
