import express from "express";
import { mpesaCallback, requestSTKPush } from "./mpesa.controller.js";
const router = express.Router();

router.post("/:user_id/stk", requestSTKPush);
router.post("/callback", mpesaCallback);

export default router;