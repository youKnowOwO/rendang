import BotClient from "../handlers/BotClient";

export default class ReadyEvent {
    public name: string;
    constructor(private client: BotClient) { this.name = "ready"; }

    public run(): void {
        console.log(`${this.client.user!.username} is ready to serve ${this.client.users.cache.size} users on ${this.client.guilds.cache.size} guilds in ${this.client.channels.cache.size} channels!`);
        return undefined;
    }
}
