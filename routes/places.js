'use strict'

const express = require('express');
const router  = express.Router();

router.get('/', (req, res, next) => {
  res.send({ SUCCESS: true });
});

// search for places by type
router.get('/:type', findPlaceByType);

function findPlaceByType(req, res) {

  res.json({ SUCCESS: true });
}

module.exports = router;
