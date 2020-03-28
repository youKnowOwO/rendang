import Bluebird from "bluebird";
import dotenv from "dotenv";
import Client from "./handlers/BotClient";

global.Promise = Bluebird;
dotenv.config();

const client = new Client({ disableMentions: "everyone", fetchAllMembers: true });

client.build(process.env.DISCORD_TOKEN);
