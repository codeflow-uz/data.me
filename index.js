const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const export2xls = require("./export.js");
const PORT = 2900;
const { query } = require("./public/pool.js");
const home = require('./routes/home')
const shaxs = require('./routes/shaxs')
const login = require('./routes/login')
const company = require('./routes/company')
const admins = require('./routes/admins')
const newAdmin = require('./routes/newAdmin')
const newUser = require('./routes/newUser')
const newCompany = require('./routes/newCompany')

app.set("view engine", "html");
app.engine("html", ejs.renderFile);
app.use(express.static("public"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use('/', login)
app.use('/home', home)
app.use('/users', shaxs)
app.use('/company', company)
app.use('/admins', admins)
app.use('/create/admin', newAdmin)
app.use('/create/user', newUser)
app.use('/create/company', newCompany)


app.get("/create/company", async (req, res) => {
  let companies = await query("select * from companies");
  let files = await query("select * from company_file");
  companies.forEach((element) => {
    element.files = files.find((e) => e.u_id == element.id);
  });
  console.log(companies);
  res.render("addCompany", {
    data: "data",
  });
});

app.post("/create/company", async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.end("Error uploading file. " + err);
    }
    let { name, about, country, date } = req.body;
    let user = await query(
      "insert into companies (name, about, date, county) values ( $1, $2, $3, $4) RETURNING id ",
      name,
      about,
      date,
      country
    );
    // console.log(user);
    for (let i of req.files) {
      await query(
        "insert into company_file ( filename, filesrc, u_id ) values ($1, $2, $3)",
        i.originalname,
        i.path.split("/")[1] + "/" + i.path.split("/")[2],
        user[0].id
      );
    }
    res.render("addCompany");
  });
});

app.get("/data/import", (req, res) => {
  res.send("import");
});
app.get("/data/export", async (req, res) => {
  let data = await query("select * from shaxs");
  let data_c = await query("select * from companies");
  await export2xls(data, data_c);
  res.redirect("/");
});

app.get("/edit/shaxs/id=:root", async (req, res) => {
  let user = await query("select * from shaxs where id = $1", req.params.root);
  console.log(user[0]);
  res.render("editUser", { data: user[0] });
});
app.post("/edit/shaxs/id=:root", async (req, res) => {
  let { fullname, birthday, passport, nationality } = req.body;
  let f_name = fullname.split(" ")[0];
  let l_name = fullname.split(" ")[1];
  let m_name =
    fullname.split(" ").length == 3
      ? fullname.split(" ")[2]
      : fullname.split(" ")[2] + " " + fullname.split(" ")[3];
  let id = req.params.root;
  await query(
    "UPDATE shaxs SET f_name = $1, l_name = $2, m_name = $3, fullname = $4, birthday = $5, passport = $6, nationality = $7 WHERE id = $8 ",
    f_name,
    l_name,
    m_name,
    fullname,
    birthday,
    passport,
    nationality,
    id
  );
  res.redirect("/");
});

app.listen(PORT, () => console.log(`Port: ${PORT}`));