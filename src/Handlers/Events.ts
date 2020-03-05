import { readdirSync } from "fs";
import BotClient from "./Rendang";

export default (client: BotClient): BotClient => {
    const events: string[] | undefined = readdirSync("./src/Events");
    for (const event of events) {
        const file = require(`../Events/${event}`).default;
        client.on(event.split(".")[0], (...args) => file(client, ...args));
    }
    return client;
};
