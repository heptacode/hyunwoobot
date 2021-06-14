import { createError } from "../modules/createError";
import { client } from "../app";

client.on("error", async (err: Error) => {
  createError("ClientError", `[${err.name}] ${err.message}`);
});
