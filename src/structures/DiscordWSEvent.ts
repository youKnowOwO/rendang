import { ClientEvents } from "discord.js";

export default class DiscordWSEvent implements IDiscordWSEvent<any> {
    constructor(public name: keyof ClientEvents) {}

    public execute(): void {
        return undefined;
    }
}


interface IDiscordWSEvent<E extends keyof ClientEvents> {
    name: E;
    execute(...args: ClientEvents[E]): void;
}

const X = Object() as IDiscordWSEvent<any>;

X.execute("channelCreate")