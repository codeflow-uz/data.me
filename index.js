const express = require("express");
const ejs = require("ejs");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
var bodyparser = require("body-parser");
const app = express();

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
app.use(bodyparser.json());

app.use(
  bodyparser.urlencoded({
    extended: false,
  })
);

var visited = 0;
var x = false;

app.get("/", (req, res) => {
  if (!visited) {
    res.render("index", {
      data: dbase,
      user: false,
    });
  } else {
    res.render("index", {
      data: dbase,
      user: x,
    });
  }
});

app.get("/userfind/:id", (req, res) => {
  let id = req.url.split("/")[2];
  x = dbase.find((e) => e.id == id);
  visited++;
  res.redirect("/");
});

app.get("/adduser/", (req, res) => {
  res.render("user");
});

app.post("/adduser/", (req, res) => {
  dbase.push({
    id: "user_id" + Math.random() * 1000000,
    name: req.body.usname,
    files: [],
  });
  let data = JSON.stringify(dbase, null, 4);
  fs.writeFileSync("data.json", data);
  x = false;
  res.redirect("/");
});

app.get("/addcomp/", (req, res) => {
  res.render("company", {
    data: dbase,
  });
});

app.post("/addcomp/", (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.log("Multer", err);
    } else if (err) {
      console.log(err);
    }
    let user = dbase.find((e) => e.id == req.body.user);
    user.files.push({
      file_name: req.file.filename,
      uploaded:
        new Date().getDate() +
        " " +
        new Date().getMonth() +
        1 +
        " " +
        new Date().getFullYear(),
      src: req.file.path,
    });
    let data = JSON.stringify(dbase, null, 4);
    fs.writeFileSync("data.json", data);
    res.redirect("/");
  });
});

app.get("/public/files/:root", (req, res) => {
  let root = req.originalUrl.split("/")[3];
  console.log(root);
  res.sendFile(__dirname + `/public/files/${root}`);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Port: ${PORT}`));
