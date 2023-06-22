import { wsClientInstanses } from "./ws";

require('dotenv').config();

class GameService {
  private players: Array<IPlayerInfo> = [];

  findIndex(playerData: IPlayerInfo) {
    for (let i = 0; i < this.players.length; i++) {
      if (playerData.Guid == this.players[i].Guid) return i;
    }
    return null;
  }

  announceDisconnected(guid) {
    this.players.filter(item => item.Guid != guid);
    wsClientInstanses.filter(item => item.Guid != guid);
    for(const channel of wsClientInstanses) {
      if(channel.Type == IWsChannelType.PLAYER) {
        channel.Handle.send(`onPlayerDisconnect:${guid}`);
      }
    }
  }

  announceConnected(playerData) {
    for(const channel of wsClientInstanses) {
      if(channel.Type == IWsChannelType.PLAYER) {
        channel.Handle.send(`onPlayerConnected:${JSON.stringify(playerData)}`);
      }
    }
  }

  updatePlayerData(msg) {
    const playerData = JSON.parse(msg) as IPlayerInfo;
    const indexOf = this.findIndex(playerData);
    if (indexOf) {
      this.players[indexOf] = playerData;
    } else {
      this.announceConnected(playerData);
      this.players.push(playerData);
    }
  }

  sendPlayerData() {
    for (const channel of wsClientInstanses) {
      if (channel.Type == IWsChannelType.PLAYER) {
        channel.Handle.send(JSON.stringify(this.players));
      }
    }
  }
}

export let gameInstanse;

export function initializeGame() {
  gameInstanse = new GameService();
  setInterval(() => gameInstanse.sendPlayerData(), <unknown>process.env.TICK_RATE as number);
}
