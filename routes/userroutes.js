const { register, getallusers, adduser, showuser, showcurrentuser } = require("../controllers/usercontroller");
const { login } = require("../controllers/usercontroller");
const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);

router.post('/allusers', getallusers);
router.post('/adduser', adduser);
router.post('/showuser', showuser);
router.post('/showcurrentuser', showcurrentuser);

module.exports = router;   