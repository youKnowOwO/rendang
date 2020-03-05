import { Client, ClientOptions, Collection } from "discord.js";
import config from "../config.json";
import CommandProp from "../typings/Command";

export default class Rendang extends Client {
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

}
