import { RateLimitData } from "discord.js";
import { client } from "../app";

export default () => {
  client.on("rateLimit", async (rateLimitData: RateLimitData) => {
    console.dir(rateLimitData);
  });
};
