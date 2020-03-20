import BotClient from "../handlers/BotClient";
import EventProp from "../typings/Event";

export default class ReadyEvent implements EventProp {
    readonly name = "ready";
    constructor(private client: BotClient) {}

    public run(): void {
        console.log(`${this.client.user!.username} is ready to serve ${this.client.users.cache.size} users on ${this.client.guilds.cache.size} guilds in ${this.client.channels.cache.size} channels!`);
        return undefined;
    }
}
