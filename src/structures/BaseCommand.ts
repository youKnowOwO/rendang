/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommandComponent, IMessage } from "../typings";
import BotClient from "../handlers/BotClient";

export default class BaseCommand implements CommandComponent {
    public conf: CommandComponent["conf"];
    public help: CommandComponent["help"];
    constructor(public client: BotClient, readonly category: string, readonly path: string) {
        this.conf = {
            aliases: [],
            cooldown: 3,
            devOnly: false,
            guildOnly: false,
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
    public run(message: IMessage): any {}

    public reload(): CommandComponent | void {
        delete require.cache[require.resolve(`${this.path}`)];
        const newCMD = new (require(`${this.path}`).default)();
        // eslint-disable-next-line @typescript-eslint/unbound-method
        this.client.commands.get(this.help.name)!.run = newCMD.run;
        this.client.commands.get(this.help.name)!.help = newCMD.help;
        this.client.commands.get(this.help.name)!.conf = newCMD.conf;
        console.info(`${this.help.name} command reloaded.`);
        return this.client.commands.get(this.help.name);
    }
}
