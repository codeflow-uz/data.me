const express = require('express');
const {
    query
} = require('../public/pool');
const router = express.Router();

router.get('/', async (req, res) => {
    let users = await query('select * from companies')
    let files = await query('select * from company_file')
    users.forEach((element) => {
        element.files = [];
        for (let i of files) {
          if (i.u_id == element.id) {
            element.files.push(i);
          }
        }
      });
    res.render('company', {
      companies: users
    })
})

module.exports = router