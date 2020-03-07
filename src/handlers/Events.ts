import { readdirSync } from "fs";
import BotClient from "./BotClient";

export default (client: BotClient): BotClient => {
    const eventFiles: string[] | undefined = readdirSync("./src/Events");
    for (const eventFile of eventFiles) {
        const event = require(`../Events/${eventFile}`);
        client.on(event.name, (...args) => event.code(client, ...args));
    }
    return client;
};
