import { Connection, connect } from "mongoose";
import Log from "./logger";

class db {
  private db: Connection;
  public init() {
    this.db = new Connection();
    this.db.once("open", () => {
      Log.i("Connected to MongoDB");
    });
    this.db.on("error", (err) => {
      Log.e(err);
      process.exit();
    });
    connect("mongodb://localhost/test", { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true });
  }
  public get(): Connection {
    return this.db;
  }
}

export default new db();
