const express = require('express');
const multer = require('multer');
const {
  query
} = require('../public/pool');
const router = express.Router();


router.get('/', async(req, res) => {
    let id = req.baseUrl.split('=')[1]
    let country = await query('select * from companies WHERE id = $1', id)
    res.render('editCompany',{data: country[0]})
})

router.post('/', async(req,res) => {
  let id = req.baseUrl.split('=')[1]
  let {
    name,
    date,
    about,
    country
  } = req.body
  await query(
    "UPDATE companies SET name = $5, date = $2, about = $3, county = $4 WHERE id = $1",
    id,
    date,
    about,
    country,
    name
  );
  res.redirect("/home");
})

module.exports = router
