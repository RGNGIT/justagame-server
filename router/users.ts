import { Router } from "express";
import SERVER from "../const/request";
import UserController from "../controllers/users";

const router = Router();

router.post(SERVER.REG_NEW_USER, UserController.regNewUser);
router.post(SERVER.LOGIN, UserController.login);
router.put(SERVER.UPDATE, UserController.update);
router.get(SERVER.GET_USER_BY_GUID, UserController.findUserByGUID);
router.put(SERVER.ADD_FRIEND, UserController.addFriend);
router.put(SERVER.ACCEPT_FRIEND, UserController.acceptFriend);
router.put(SERVER.DECLINE_FRIEND, UserController.declineFriend);
router.get(SERVER.GET_SERVER_USERS, UserController.getOnServerUsers);

export default router;