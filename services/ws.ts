const WS = require('ws');
const wsServer = new WS.Server({port: 9000});

export let wsClientInstanses: Array<IWsMap> = [];

function filterInstanses(toRemove) {
  const temp = [];
  for(const i of wsClientInstanses) {
    if(i.Guid != toRemove) {
      temp.push(i);
    }
  }
  return temp;
}

function onConnect(wsClient) {
  wsClient.send("Сервак ответил, вы подрубились");
  wsClient.on("message", (msg) => {
    const doSplit = Buffer.from(msg).toString('utf8').split(':');
    if(doSplit[0] == "onClosure") {
      console.log(`Юзер ${doSplit[1]} закрывает коннекшн...`);
      wsClientInstanses = filterInstanses(doSplit[1]);
    } else {
      wsClientInstanses = filterInstanses(Buffer.from(msg).toString('utf8'));
      wsClientInstanses.push({Guid: Buffer.from(msg).toString('utf8'), Instance: wsClient});
    }
  });
  wsClient.on('close', (msg) => {
    console.log("Закрыт коннекшн");
  });
}

export function defineListeners() {
  wsServer.on('connection', onConnect);
}