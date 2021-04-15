const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {
  let arr = []
  res.render('index', {
      dataObj: arr
  })
})

module.exports = router