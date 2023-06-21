import { Router } from "express";
import SERVER from "../const/request";
import MessengerController from "../controllers/messenger";

const router = Router();

router.post(SERVER.SEND_MESSAGE, MessengerController.sendMessage);
router.get(SERVER.GET_MESSAGES, MessengerController.getMessagesByGUID);

export default router;