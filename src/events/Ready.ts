import BotClient from "../handlers/BotClient";

const code = (client: BotClient): void => {
    console.log(`${client.user?.username} is ready to serve!`);
};

const name = "ready";

export { code,  name };
