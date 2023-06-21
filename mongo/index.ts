const MongoClient = require("mongodb").MongoClient;

require('dotenv').config();

export default class MongoAction {
  private mongoClient = new MongoClient(process.env.MONGO_STRING);
  private db;

  // Private methods for internal usage

  constructor() {
    this.mongoClient.connect();
    this.db = this.mongoClient.db('justagame');
    if (!this.check()) {
      console.log("Трабл с монгой!");
    }
  }

  async check() {
    const result = await this.db.command({ ping: 1 });
    // console.log("Подключение с сервером успешно установлено");
    // console.log(result);
    return result.ok == 1;
  }

  async breaker() {
    await this.mongoClient.close();
  }

  // Public methods

  public async insertOne(collection, data) {
    const c = this.db.collection(collection);
    await c.insertOne(data);
    await this.breaker();
  }

  public async findOne(by, collection, value) {
    const c = this.db.collection(collection);
    const result = await c.findOne(JSON.parse(`{"${by}":"${value}"}`));
    await this.breaker();
    return result;
  }

  public async findOneAndUpdate(by, key, collection, field, value) {
    const c = this.db.collection(collection);
    const result = await c.findOneAndUpdate(
      JSON.parse(`{"${by}":"${key}"}`),
      { $set: JSON.parse(`{"${field}":"${value}"}`) },
      { upsert: true, returnDocument: "after" }
    );
    await this.breaker();
    return result.value;
  }

  public async pushToOne(by, key, collection, field, value) {
    const c = this.db.collection(collection);
    await c.updateOne(
      JSON.parse(`{"${by}":"${key}"}`),
      { $push: JSON.parse(`{"${field}":"${value}"}`) }
    );
    await this.breaker();
  }

  public async pushMessageToOne(by, key, collection, value) {
    const c = this.db.collection(collection);
    await c.updateOne(
      JSON.parse(`{"${by}":"${key}"}`),
      { $push: { PM: value } }
    );
    await this.breaker();
  }

  public async pullFromOne(by, key, collection, field, value) {
    const c = this.db.collection(collection);
    await c.updateOne(
      JSON.parse(`{"${by}":"${key}"}`),
      { $pull: JSON.parse(`{"${field}":"${value}"}`) }
    );
    await this.breaker();
  }
}