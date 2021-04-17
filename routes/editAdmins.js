const express = require('express');
const multer = require('multer');
const {
  query
} = require('../public/pool');
const router = express.Router();


router.get('/', async(req, res) => {
    let id = req.baseUrl.split('=')[1]
    let admin = await query('select * from admins where id = $1', id)
    res.render('editAdmin',{data: admin[0]})
})

router.post('/', async(req,res) => {
  let {
    fullname,
    login,
    password,
    status
  } = req.body
  await query(
    "UPDATE admins SET fullname = $1, login = $2, password = $3, level = $4",
    fullname,
    login,
    password,
    status
  );
  res.redirect("/");
})

module.exports = router
