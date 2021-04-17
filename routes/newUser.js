const express = require('express');
const multer = require('multer');
const {
  query
} = require('../public/pool');
const router = express.Router();
const storage = multer.diskStorage({
  destination: "./public/files",
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname.toString());
  },
});
const upload = multer({
  storage: storage,
}).any("files");

router.get('/', async (req, res) => {
  res.render("addUser");
})

router.post('/', async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.end("Error uploading file. " + err);
    }
    let { passport, birthday, nationality, fullname } = req.body;
    let f_name = fullname.split(" ")[0];
    let l_name = fullname.split(" ")[1];
    let m_name =
      fullname.split(" ").length == 3
        ? fullname.split(" ")[2]
        : fullname.split(" ")[2] + " " + fullname.split(" ")[3];
    let user = await query(
      "insert into shaxs (f_name, l_name, m_name, fullname, birthday, passport, nationality) values ( $1, $2, $3, $4, $5, $6, $7) RETURNING id ",
      f_name,
      l_name,
      m_name,
      fullname,
      birthday,
      passport,
      nationality
    );
    // console.log(user);
    for (let i of req.files) {
      await query(
        "insert into user_file ( filename, filesrc, u_id ) values ($1, $2, $3)",
        i.originalname,
        i.path.split("/")[1] + "/" + i.path.split("/")[2],
        user[0].id
      );
    }
    res.render("addUser");
  });
})

module.exports = router