import express from "express";
import {signup,login,getusers} from "../controller/user.controller.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/getusers", getusers);

export default router;