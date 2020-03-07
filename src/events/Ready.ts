import BotClient from "../handlers/BotClient";

const code = (client: BotClient): void => {
    console.log(`${client.user?.username} is ready to serve ${client.users.cache.size} users on ${client.guilds.cache.size} guilds in ${client.guilds.cache.size} channels!`);
};

const name = "ready";

export { code,  name };
