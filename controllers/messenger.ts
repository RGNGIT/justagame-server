import { Request, Response } from "express";
import MessageService from "../services/message";

class Messenger {
  async sendMessage(req: Request, res: Response) {
    try {
      const { From, To, MessageText } = req.body;
      const ms = new MessageService();
      await ms.sendMessage(From, To, MessageText);
      res.send("OK");
    } catch (err) {
      res.send(err);
    }
  }
  async getMessagesMeta(req: Request, res: Response) {

  }
  async getMessagesByGUID(req: Request, res: Response) {
    try {
      const { selfGuid, userGuid } = req.query;
      const ms = new MessageService();
      const messages = await ms.fetchAllMessagesOfUser(selfGuid);
      if(!messages) {
        res.send("NO_MESSAGES");
        return;
      }
      let temp: Array<IMessage> = [];
      for(const message of messages) {
        const parsedMessage: IMessage = JSON.parse(message) as IMessage;
        if(parsedMessage.To == userGuid || parsedMessage.From == userGuid) {
          temp.push(parsedMessage);
        }
      }
      res.send(temp);
    } catch (err) {
      res.send(err);
    }
  }
}

export default new Messenger();