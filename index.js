const express = require("express");
const ejs = require("ejs");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const {
    query
} = require('./public/pool.js')
var bodyparser = require("body-parser");
const app = express();
const json2xls = require('json-to-excel');
const export2xls = require("./export.js");
const PORT = 3000;
let data = fs.readFileSync("data.json");
let dbase = JSON.parse(data);
const storage = multer.diskStorage({
    destination: "./public/files",
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});
const upload = multer({
    storage: storage,
}).single("pdf");

app.set("view engine", "html");
app.engine("html", ejs.renderFile);
app.use(express.static("public"));
app.use(express.json());
app.use(bodyparser.urlencoded({
    extended: false,
}));

app.get("/", (req, res) => {
    res.render('index')
});

app.post('/search', async(req, res) => {
    if (req.body.from == 'shaxs') {
        res.render('user')
    } else  if(req.body.from == 'company'){
        res.render('company') 
    }else {
        res.send('Error retry.')
    }
});

app.get("/create/user", (req, res) => {
    res.render("addUser");
});

app.get("/create/company", (req, res) => {
    res.render("addCompany");
});

app.get("/data/import", (req, res) => {
    res.send('import')
})
app.get("/data/export", async (req, res) => {
    let data = await query('select * from shaxs')
    let data_c = await query('select * from companies')
    await export2xls(data, data_c)
    res.redirect('/')
});


app.listen(PORT, () => console.log(`Port: ${PORT}`));