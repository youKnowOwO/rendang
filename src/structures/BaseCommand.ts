/* eslint-disable @typescript-eslint/no-unused-vars */
import CommandComponent from "../typings/Command";
import BotClient from "../handlers/BotClient";
import Message from "../typings/Message";

export default class BaseCommand implements CommandComponent {
    public client: BotClient;
    public category: string;
    public path: string;
    public conf: CommandComponent["conf"];
    public help: CommandComponent["help"];
    constructor(client: BotClient, category: string, path: string) {
        this.client = client;
        this.category = category;
        this.path = path;
        this.conf = {
            aliases: [],
            cooldown: 3,
            devOnly: false,
            requiredPermissions: [],
            disable: false
        };
        this.help = {
            name: null,
            description: null,
            usage: null,
            example: null
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public run(message: Message): any {}

    public reload(): CommandComponent | void {
        delete require.cache[require.resolve(`${this.path}`)];
        const newCMD = new (require(`${this.path}`).default)();
        this.client.commands.get(this.help.name)!.run = newCMD.run;
        this.client.commands.get(this.help.name)!.help = newCMD.help;
        this.client.commands.get(this.help.name)!.conf = newCMD.conf;
        console.info(`${this.help.name} command reloaded.`);
        return this.client.commands.get(this.help.name);
    }
}
