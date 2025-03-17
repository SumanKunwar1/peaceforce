import { Router } from "express";
import { AdminLoginController } from "@controllers";

const router = Router();

router.post("/", AdminLoginController.loginAdmin);

export default router;
