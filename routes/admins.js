const express = require('express');
const {
    query
} = require('../public/pool');
const router = express.Router();

router.get('/', async (req, res) => {
    let users = await query('select * from admins')
    res.render('admins', {
        admins: users
    })
})

module.exports = router