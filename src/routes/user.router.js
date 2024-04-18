import { Router } from "express";
import { Register,Login } from "../controllers/user.controller.js";
import validateJWTToken from "../middleware/validateJWTToken.js";
const router = Router();

router.post("/register", Register);
router.post("/login", Login);

router.get("/profile", validateJWTToken, (req, res) => {
    // validateJWTToken middleware will add user object to req
    res.json(req.user);
}
);
export default router;