import MongoAction from "../mongo";
import { wsClientInstanses } from "./ws";

export default class MessageService {
  async sendMessage(from, to, message) {
    await (new MongoAction()).pushMessageToOne('Guid', from, 'players', JSON.stringify({From: from, To: to, MessageText: message} as IMessage));
    await (new MongoAction()).pushMessageToOne('Guid', to, 'players', JSON.stringify({From: from, To: to, MessageText: message} as IMessage));
    const ws = wsClientInstanses.find(item => item.Guid == to);
    if(ws) {
      ws.Instance.send(JSON.stringify({From: from, To: to, MessageText: message} as IMessage));
    }
  }
  async fetchAllMessagesOfUser(userGuid) {
    return (<unknown>(await (new MongoAction()).findOne('Guid', 'players', userGuid)) as IUser)?.PM;
  }
}