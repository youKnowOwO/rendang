/* eslint-disable @typescript-eslint/unbound-method */
import { Collection, ClientEvents, Channel } from "discord.js";
import { IDiscordWSEventManager, IMessage } from "../typings";
import Rendang from "../structures/Rendang";
import DiscordWSEvent from "../structures/DiscordWSEvent";

export default class DiscordWSEventManager {
    public store: Collection<keyof ClientEvents, ClientEvents>  = new Collection();
    constructor(public client: Rendang, private path: string) {}

    public add<K extends keyof ClientEvents>(eventName: K, listener: (...args: ClientEvents[K]) => void): Rendang {
        return this.client;
    }
}

new DiscordWSEventManager(Object() as Rendang, "abcd").add("message", (message: IMessage) => {

});