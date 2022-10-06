// backend/routes/api/index.js
const router = require('express').Router();

// The following block of code is kept in for pedagogical purposes
// In a real application, it would be removed before publication

// router.post('/test', function (req, res) {
//   res.json({ requestBody: req.body });
// });

// // GET /api/set-token-cookie
// const { setTokenCookie } = require('../../utils/auth.js');
// const { User } = require('../../db/models');
// router.get('/set-token-cookie', async (_req, res) => {
//   const user = await User.findOne({
//     where: {
//       username: 'DemoUser1'
//     }
//   });
//   setTokenCookie(res, user);
//   return res.json({ user });
// });

// const { restoreUser } = require('../../utils/auth.js');


// router.use(restoreUser);

// router.get(
//   '/restore-user',
//   (req, res) => {
//     return res.json(req.user);
//   }
// );

// const { requireAuth } = require('../../utils/auth.js');
// router.get(
//   '/require-auth',
//   requireAuth,
//   (req, res) => {
//     return res.json(req.user);
//   }
// );

// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null
const { restoreUser } = require("../../utils/auth.js");
router.use(restoreUser);

module.exports = router;
