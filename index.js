const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const bodyParser = require("body-parser");
const multer = require("multer");
const export2xls = require("./export.js");
const PORT = 2900;
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

app.get("/", async (req, res) => {
    // let user = await query('select * from shaxs')
    // let company = await query('select * from companies')
    // let arr = []
    // company.forEach(e => arr.push(e.name))
    // user.forEach(e => arr.push(e.fullname))

    // res.render('index', {
    //     dataObj: arr
    // })
    res.render('login')
});

app.post('/search', async (req, res) => {
    if (req.body.from == 'shaxs') {
        let user = req.body.searchInput
        let company = await query('select * from shaxs')
        let users = await query('select * from companies')
        let companies = await query('select * from shaxs where fullname = $1', user)
        let files = await query('select * from user_file')
        let arr = []

        company.forEach(e => arr.push(e.fullname))
        users.forEach(e => arr.push(e.name))

        companies.forEach(element => {
            element.files = []
            for (let i of files) {
                if (i.u_id == element.id) {
                    element.files.push(i)
                }
            }
        });

        res.render('user', {
            users: companies,
            dataObj: arr
        })

    } else if (req.body.from == 'company') {
        let user = req.body.searchInput
    let users = await query('select * from shaxs')
    let company = await query('select * from companies')
        let companies = await query('select * from companies where name = $1', user)
        let files = await query('select * from company_file')
        let arr = []

        company.forEach(e => arr.push(e.name))
        users.forEach(e => arr.push(e.fullname))

        companies.forEach(element => {
            element.files = []
            for (let i of files) {
                if (i.u_id == element.id) {
                    element.files.push(i)
                }
            }
        });

        res.render('company', {
            companies: companies,
            dataObj: arr
        })
    } else {
        res.send('Error retry. Please select all inputs.')
    }
});

app.get("/create/user", async (req, res) => {
    let companies = await query('select * from shaxs')
    res.render("addUser");
});

app.post('/create/user', (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.end("Error uploading file. " + err);
        }
        let {
            passport,
            birthday,
            nationality,
            fullname
        } = req.body
        let f_name = fullname.split(' ')[0]
        let l_name = fullname.split(' ')[1]
        let m_name = fullname.split(' ').length == 3 ? fullname.split(' ')[2] : fullname.split(' ')[2] + ' ' + fullname.split(' ')[3]
        let user = await query('insert into shaxs (f_name, l_name, m_name, fullname, birthday, passport, nationality) values ( $1, $2, $3, $4, $5, $6, $7) RETURNING id ',
            f_name,
            l_name,
            m_name,
            fullname,
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

app.get("/create/company", async (req, res) => {
    let companies = await query('select * from companies')
    let files = await query('select * from company_file')
    companies.forEach(element => {
        element.files = files.find(e => e.u_id == element.id)
    });
    console.log(companies);
    res.render('addCompany', {
        data: 'data'
    })
});

app.post('/create/company', (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.end("Error uploading file. " + err);
        }
        let {
            name,
            about,
            country,
            date
        } = req.body
        let user = await query('insert into companies (name, about, date, county) values ( $1, $2, $3, $4) RETURNING id ',
            name,
            about,
            date,
            country
        )
        // console.log(user);
        for (let i of req.files) {
            await query('insert into company_file ( filename, filesrc, u_id ) values ($1, $2, $3)', i.originalname, i.path.split('/')[1] + '/' + i.path.split('/')[2], user[0].id)
        }
        res.render('addCompany')
    });
})

app.get("/data/import", (req, res) => {
    res.send('import')
})
app.get("/data/export", async (req, res) => {
    let data = await query('select * from shaxs')
    let data_c = await query('select * from companies')
    await export2xls(data, data_c)
    res.redirect('/')
});

app.get('/edit/shaxs/id=:root', async (req, res) => {
    let user = await query('select * from shaxs where id = $1', req.params.root);
    console.log(user[0]);
    res.render('editUser', { data: user[0] });
})
app.post('/edit/shaxs/id=:root', async (req,res) => {
    let {
        fullname,
        birthday,
        passport,
        nationality
    } = req.body
    let f_name = fullname.split(' ')[0]
    let l_name = fullname.split(' ')[1]
    let m_name = fullname.split(' ').length == 3 ? fullname.split(' ')[2] : fullname.split(' ')[2] + ' ' + fullname.split(' ')[3]
    let id = req.params.root
    await query('UPDATE shaxs SET f_name = $1, l_name = $2, m_name = $3, fullname = $4, birthday = $5, passport = $6, nationality = $7 WHERE id = $8 ',
        f_name,
        l_name,
        m_name,
        fullname,
        birthday,
        passport,
        nationality,
        id
    )   
    res.redirect('/')
})


app.listen(PORT, () => console.log(`Port: ${PORT}`))