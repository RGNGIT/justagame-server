require('dotenv').config();
const WS = require('ws');
const wsServer = new WS.Server({port: process.env.WS_PORT});

import { gameInstanse } from "./game";

export let wsClientInstanses: Array<IWsChannel> = [];

function filterMessengerInstanses(toRemove) {
  const temp = [];
  for(const i of wsClientInstanses) {
    if(i.Type == IWsChannelType.MESSENGER) {
      if(i.Guid != toRemove) {
        temp.push(i);
      } else {
        i.Handle.close();
      }
    } else {
      temp.push(i);
    }
  }
  return temp;
}

function onPlayerLogic(guid, wsClient) {
  console.log(`Юзер ${guid} подключился как игрок`);
  wsClientInstanses.push({Guid: Buffer.from(guid).toString('utf8'), Handle: wsClient, Type: IWsChannelType.PLAYER});
}

function onClosureLogic(guid) {
  console.log(`Юзер ${guid} закрывает коннекшн...`);
  wsClientInstanses = filterMessengerInstanses(guid);
}

function onConnect(wsClient) {
  // wsClient.send("Сервак ответил, вы подрубились");
  wsClient.on("message", (msg) => {
    // Логика игры
    const resolveChannel = wsClientInstanses.find(item => item == wsClient);
    if(resolveChannel && resolveChannel.Type == IWsChannelType.PLAYER) {
      gameInstanse.updatePlayerData(msg);
      return;
    }
    // Логика мессенджера и прочего говна
    const splitParseMessage = Buffer.from(msg).toString('utf8').split(':');
    switch(splitParseMessage[0]) {
      case "onPlayer": onPlayerLogic(splitParseMessage[1], wsClient); break;
      case "onClosure": onClosureLogic(splitParseMessage[1]); break;
      case "onPlayerDisconnect": gameInstanse.announceDisconnected(splitParseMessage[1]); break;
      default:
        wsClientInstanses = filterMessengerInstanses(Buffer.from(msg).toString('utf8'));
        wsClientInstanses.push({Guid: Buffer.from(msg).toString('utf8'), Handle: wsClient, Type: IWsChannelType.MESSENGER});
        break;
    }
  });
  wsClient.on('close', (msg) => {
    // console.log("Закрыт коннекшн");
  });
}

export function defineListeners() {
  wsServer.on('connection', onConnect);
}