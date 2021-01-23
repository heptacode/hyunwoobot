import Log from "../modules/logger";
import { client } from "../app";

client.on("error", async (err: Error) => {
  Log.e(`ClientError > [${err.name}] ${err.message}`);
});
