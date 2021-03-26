const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const bodyParser = require("body-parser");
const multer = require("multer");
const export2xls = require("./export.js");
const PORT = 3100;
const {
    query
} = require('./public/pool.js');
const storage = multer.diskStorage({
    destination: "./public/files",
    filename: function (req, file, cb) {
        cb(
            null,
            Date.now() + file.originalname.toString()
        );
    },
});
const upload = multer({
    storage: storage,
}).any("files");

app.set("view engine", "html");
app.engine("html", ejs.renderFile);
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", (req, res) => {
    res.render('index')
});

app.post('/search', async (req, res) => {
    if (req.body.from == 'shaxs') {
        let user = req.body.searchInput.toLowerCase()
        let find_user = query('select * from shaxs where fullname = $1', user)
        res.render('user', {
            users: find_user
        })
    } else if (req.body.from == 'company') {
        res.render('company')
    } else {
        res.send('Error retry.')
    }
});

app.get("/create/user", async (req, res) => {
    res.render("addUser");
});

app.post('/create/user', (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.end("Error uploading file." + err);
        }
        let {
            passport,
            birthday,
            nationality,
            fullname
        } = req.body
        let f_name = fullname.split(' ')[0]
        let l_name = fullname.split(' ')[1]
        let m_name = fullname.split(' ').legth == 3 ? fullname.split(' ')[2] : fullname.split(' ')[2] + ' ' + fullname.split(' ')[3]
        let user = await query('insert into shaxs (f_name, l_name, m_name, birthday, passport, nationality) values ( $1, $2, $3, $4, $5, $6) RETURNING id ',
            f_name,
            l_name,
            m_name,
            birthday,
            passport,
            nationality
        )
        // console.log(user);
        for (let i of req.files) {
            await query('insert into user_file ( filename, filesrc, u_id ) values ($1, $2, $3)', i.originalname, i.path.split('/')[1] + '/' + i.path.split('/')[2], user[0].id)
        }
        res.render('addUser')
    });
})

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