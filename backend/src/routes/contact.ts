import { Router } from "express";
import { ContactController } from "../controllers";
import { isAuthenticated, validateContact } from "../middleware";

const router = Router();

router.post("/", validateContact, ContactController.createContact);

router.get("/", isAuthenticated, ContactController.getContacts);

router.get("/:contactId", isAuthenticated, ContactController.getContactById);

router.delete("/:contactId", isAuthenticated, ContactController.deleteContact);

export default router;
