const express = require('express');
const multer = require('multer');
const {
  query
} = require('../public/pool');
const router = express.Router();
const storage = multer.diskStorage({
  destination: "./public/files",
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname.toString());
  },
});
const upload = multer({
  storage: storage,
}).any("files");

router.get('/', async (req, res) => {
  res.render("addCompany");
})

router.post('/', async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.end("Error uploading file. " + err);
    }
    let {
      name,
      date,
      country,
      about
    } = req.body;

    let company = await query('insert into companies ( name, date, about, county ) values ($1, $2, $3, $4) RETURNING id',
      name, date, country, about
    )
    console.log(company);
    for (let i of req.files) {
      await query(
        "insert into company_file ( filename, filesrc, u_id ) values ($1, $2, $3)",
        i.originalname,
        i.path.split("/")[1] + "/" + i.path.split("/")[2],
        company[0].id
      );
    }
    res.render("addCompany");
  });
})

module.exports = router