const express = require('express');
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');

const router = express.Router();

router.get('/stats', auth, authorizeRoles('admin'), (req, res) => {
  res.status(200).json({
    message: 'Admin-only endpoint access granted',
    user: req.user
  });
});

module.exports = router;