import { Router } from "express";
import { Register } from "../controllers/user.controller.js";
const router = Router();

router.post("/register", Register);


export default router;