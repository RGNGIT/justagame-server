import { Request, Response } from "express";
import UserService from "../services/user";

let players: Array<string> = [];

class UserController {
  async regNewUser(req: Request, res: Response) {
    try {
      const data: IUser = req.body;
      const service = new UserService();
      await service.registerNewUser(data.Username, data.Password, data.Guid);
      res.sendStatus(200);
    } catch(err) {
      res.send(err);
    }
  }
  async login(req: Request, res: Response) {
    try {
      const data: IUser = req.body;
      const service = new UserService();
      const user = await service.getUserInfo(data.Username);
      if(!user) {
        res.send("WRONG_CREDENTIALS");
        return;
      }
      if(data.Password == user.Password) {
        res.json(user);
      } else {
        res.send("WRONG_CREDENTIALS");
      }
    } catch(err) {
      res.send(err);
    }
  }
  async update(req: Request, res: Response) {
    try {
      const data: IUpdater = req.body;
      const service = new UserService();
      const after = await service.updateUserInfo(data.By, data.Key, data.Field, data.Value);
      res.json(after);
    } catch(err) {
      res.send(err);
    }
  }
  async findUserByGUID(req: Request, res: Response) {
    try {
      const guid = req.params.guid;
      const service = new UserService();
      const user: IUser = await service.fetchOneByGUID(guid);
      res.json(user);
    } catch(err) {
      res.send(err);
    }
  }
  async addFriend(req: Request, res: Response)  {
    try {
      const data: IUpdater = req.body;
      const service = new UserService();
      await service.pushToOne(data.By, data.Key, data.Field, data.Value);
      res.json("OK");
    } catch(err) {
      res.send(err);
    }
  }
  async acceptFriend(req: Request, res: Response) {
    try {
      const { SelfGuid, FriendGuid } = req.body;
      const service = new UserService();
      await service.pullFromOne("Guid", SelfGuid, "FriendRequests", FriendGuid);
      await service.pushToOne("Guid", SelfGuid, "FriendList", FriendGuid);
      await service.pushToOne("Guid", FriendGuid, "FriendList", SelfGuid);
      res.json("OK");
    } catch(err) {
      res.send(err);
    }
  }
  async declineFriend(req: Request, res: Response) {
    try {
      const data: IUpdater = req.body;
      console.log(data);
      const service = new UserService();
      await service.pullFromOne(data.By, data.Key, data.Field, data.Value);
      res.json("OK");
    } catch(err) {
      res.send(err);
    }
  }
  async getOnServerUsers(req: Request, res: Response) { 
    try {
      res.json(players);
    } catch(err) {
      res.send(err);
    }
  }
}

export default new UserController();