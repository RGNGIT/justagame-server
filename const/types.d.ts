declare enum IWsChannelType {
  MESSENGER,
  PLAYER
}

interface IUser {
  Username: string,
  Password: string,
  Guid?: string,
  Status?: string,
  FriendList?: Array<string>,
  FriendRequests?: Array<string>,
  PM?: Array<string>
}

interface IUpdater {
  By: string,
  Key: string,
  Field: string,
  Value: string
}

interface IMessage {
  From: string,
  To: string,
  MessageText: string
}

interface IWsChannel {
  Guid: string,
  Handle: any,
  Type: IWsChannelType
}

interface IPlayerInfo {
  Guid: string,
  WorldX: number,
  WorldY: number,
  WorldZ: number,
  RotateX: number,
  RotateY: number,
  RotateZ: number
}