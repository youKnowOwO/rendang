import { useDotEnv } from "./config";
import { config as loadDotEnv } from "dotenv";
import Client from "./handlers/BotClient";

if (useDotEnv) loadDotEnv();

new Client({ disableMentions: "everyone", fetchAllMembers: true })
    .setToken(process.env.DISCORD_TOKEN as string)
    .build();
