import { log } from "../modules/logger";
import { client } from "../app";

client.on("error", async (err: Error) => {
  log.e(`ClientError > [${err.name}] ${err.message}`);
});
