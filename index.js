const express = require("express");
const path = require('path');
const bodyParser = require('body-parser')
const app = express();
const port = process.env.PORT || 7777;
const sequelize = require("./config/database"); // Database
const methodOverride = require('method-override')
const systemConfig = require("./config/system")
const http = require("http");
const { Server } = require("socket.io");


const route = require("./router/client/index.route")
const routeAdmin = require("./router/admin/index.route")
const routeDoctor = require("./router/doctor/index.route")
const routeStaff = require("./router/staff/index.route")

// Cấu hình body-parser với giới hạn lớn
app.use(bodyParser.json({ limit: '50mb' })); // Giới hạn cho JSON
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // Giới hạn cho URL-encoded


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

//[TINYMCE]
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
//Flash
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash()); 

app.set('views', './views')
app.set('view engine', 'pug')

app.use(express.static(`public`));

// Socket.io
const server = http.createServer(app);
const io = new Server(server);
global.io = io;

// End Socket.io


// Router

route(app);
routeAdmin(app);
routeDoctor(app); 
routeStaff(app);
app.get("*" ,  (req, res) => {
  res.render("client/pages/errors/404",{
    pageTitle: "Trang không tồn tại",
  })
})






// Biến admin local 
app.locals.prefixAdmin = systemConfig.prefixAdmin; 
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
