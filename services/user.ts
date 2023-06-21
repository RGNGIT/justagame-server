import MongoAction from "../mongo";

export default class UserService {
  async registerNewUser(Username, Password, Guid) {
    const inst = new MongoAction();
    await inst.insertOne('players', {Username, Password, Guid});
  }
  async getUserInfo(Username) {
    const inst = new MongoAction();
    return <unknown>(await inst.findOne('Username', 'players', Username)) as IUser;
  }
  async updateUserInfo(By, Key, Field, Value) {
    const inst = new MongoAction();
    return <unknown>(await inst.findOneAndUpdate(By, Key, 'players', Field, Value)) as IUser;
  }
  async fetchOneByGUID(GUID) {
    const inst = new MongoAction();
    return <unknown>(await inst.findOne('Guid', 'players', GUID)) as IUser;
  }
  async pushToOne(By, Key, Field, Value) {
    const inst = new MongoAction();
    await inst.pushToOne(By, Key, 'players', Field, Value);
  }
  async pullFromOne(By, Key, Field, Value) {
    const inst = new MongoAction();
    await inst.pullFromOne(By, Key, 'players', Field, Value);
  }
}