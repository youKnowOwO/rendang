import { Client, ClientOptions, Collection } from "discord.js";
import config from "../config.json";
import CommandProp from "../typings/Command";
import EventsLoader from "./Events";

export default class BotClient extends Client {
    public config: typeof config = config;
    public commands: Collection<string | undefined, CommandProp>;
    public aliases: Collection<string, string>;
    public categories: Collection<string, object>;
    public helpMeta: Collection<string, object>;
    constructor(opt: ClientOptions) {
        super(opt);
        this.commands = new Collection();
        this.aliases = new Collection();
        this.categories = new Collection();
        this.helpMeta = new Collection();

    }

    public build(token: string | undefined): BotClient {
        this.login(token);
        EventsLoader(this);
        return this;
    }

}
