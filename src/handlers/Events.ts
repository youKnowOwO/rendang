import { readdirSync } from "fs";
import BotClient from "./BotClient";
import EventProp from "../typings/Event";

export default class EventLoader {
    constructor(private client: BotClient, readonly path: string) {}

    public build(): BotClient {
        const eventFiles: string[] | undefined = readdirSync(this.path);
        for (const eventFile of eventFiles) {
            if (eventFile.endsWith(".map")) continue;
            const event: EventProp = new (require(`${this.path}/${eventFile}`).default)(this.client);
            this.client.events.set(event.name, event);
            this.client.on(event.name, (...args) => event.run(...args));
            console.info(`Event ${event.name} has been loaded!`);
        }
        return this.client;
    }
}
