import Client from "./handlers/Rendang";
import EventHandler from "./handlers/Events";

const client = new Client({ disableMentions: "everyone", fetchAllMembers: true });

client.login(process.env.DISCORD_TOKEN);
EventHandler(client);
