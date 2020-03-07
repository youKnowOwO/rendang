import Client from "./handlers/BotClient";
import dotenv from "dotenv";

dotenv.config({ path: "./src/.env" });

const client = new Client({ disableMentions: "everyone", fetchAllMembers: true });

client.build(process.env.DISCORD_TOKEN);
