const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { getAllContacts, getContactById, updateContact, mergeContacts } = require("../controllers/contactsController");

router.use(authenticate);

router.get("/", getAllContacts);
router.get("/:id", getContactById);
router.patch("/:id", updateContact);
router.post("/:id/merge", mergeContacts);

module.exports = router;
