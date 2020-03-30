import { Promise as Bluebird } from "bluebird";
import { useDotEnv, useBlueBird } from "./config.json";
import { config as LoadDotEnv } from "dotenv";
import Client from "./handlers/BotClient";

if (useBlueBird) global.Promise = Bluebird;
if (useDotEnv) LoadDotEnv({ path: "./src/.env" });

const client = new Client({ disableMentions: "everyone", fetchAllMembers: true })
    .setToken(process.env.DISCORD_TOKEN as string);

client.build();
