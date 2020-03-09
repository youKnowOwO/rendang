/* eslint-disable @typescript-eslint/no-unused-vars */
import CommandCompopnent from "../typings/Command";
import BotClient from "./BotClient";
import Message from "../typings/Message";
import BotConfig from "../typings/BotConfig";

export default class BaseCommand implements CommandCompopnent {
    public conf: CommandCompopnent["conf"];
    public help: CommandCompopnent["help"];
    constructor() {
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
    public run(client: BotClient, message: Message, args: string[], flags: string[], config: typeof BotConfig | null): any {}
}
