import { Router } from "express";
import { Register,Login, Home, Verify, AddData} from "../controllers/user.controller.js";
import validateJWTToken from "../middleware/validateJWTToken.js";
const router = Router();

router.post("/register", Register);
router.post("/login", Login);
router.get("/home",validateJWTToken, Home);
router.get("/verify",validateJWTToken, Verify);
router.post("/addData",validateJWTToken, AddData);
router.get("/logout",validateJWTToken, Logout);

export default router;