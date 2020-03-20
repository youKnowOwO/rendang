import Client from "./handlers/BotClient";
import dotenv from "dotenv";
import { Promise } from "bluebird";
global.Promise = Promise;

dotenv.config({ path: "./.env" });

const client = new Client({ disableMentions: "everyone", fetchAllMembers: true });

client.build(process.env.DISCORD_TOKEN);
