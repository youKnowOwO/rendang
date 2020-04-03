import { Promise as Bluebird } from "bluebird";
import { useDotEnv, useBlueBird } from "./config.json";
import { config as loadDotEnv } from "dotenv";
import Client from "./handlers/BotClient";

if (useBlueBird) global.Promise = Bluebird;
if (useDotEnv) loadDotEnv({ path: "./src/.env" });

new Client({ disableMentions: "everyone", fetchAllMembers: true })
    .setToken(process.env.DISCORD_TOKEN as string)
    .build();
