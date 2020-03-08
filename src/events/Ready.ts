import BotClient from "../handlers/BotClient";

export default class ReadyEvent {
    private client: BotClient;
    public name: string;
    public run: Function;
    constructor(client) {
        this.client = client;
        this.name = "ready";

        this.run = (): void => {
            console.log(this.client);
            console.log(`${this.client.user!.username} is ready to serve ${this.client.users.cache.size} users on ${this.client.guilds.cache.size} guilds in ${this.client.guilds.cache.size} channels!`);
            return undefined;
        };
    }
}
