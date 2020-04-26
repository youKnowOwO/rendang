/* eslint-disable @typescript-eslint/unbound-method */
import Rendang from "../structures/Rendang";
import { IEvent } from "../typings";
import { readdirSync } from "fs";

export default class EventManager {
    constructor(public client: Rendang) {}

    public add(event: IEvent): Rendang {
        this.client.log.info(`Event "${event.name}" has been loaded!`);
        return this.client.addListener(event.name, (...args: any) => event.execute(...args));
    }

    public remove(eventName: IEvent["name"]): Rendang {
        return this.client.removeListener(eventName, () => this.client.log.info(`Event "${eventName}" has been unloaded`));
    }

    public emit(eventName: IEvent["name"]): any {
        return this.emit(eventName);
    }

    public load(path: string): Rendang {
        const eventFiles: string[] | undefined = readdirSync(path);
        for (const eventFile of eventFiles) {
            if (eventFile.endsWith(".map")) continue;
            const event = new (require(`${path}/${eventFile}`).default)(this.client);
            this.add(event);
        }
        return this.client;
    }
}