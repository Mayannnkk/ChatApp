const { addmessage,getallmessage, clearallchats} = require("../controllers/messagescontroller")
const router = require("express").Router();

router.post("/addmsg", addmessage);
router.post("/getmsg", getallmessage);
router.post("/clrmsg", clearallchats);


module.exports = router;      