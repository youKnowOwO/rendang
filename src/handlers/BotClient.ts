import { Client, ClientOptions, Collection } from "discord.js";
import config from "../config.json";
import CommandProp from "../typings/Command";
import EventsLoader from "./Events";
import EventProp from "../typings/Event";
import { resolve } from "path";
import ModulesLoader from "./Modules.js";

export default class BotClient extends Client {
    public config: typeof config = config;
    public events: Collection<string, EventProp>;
    public commands: Collection<string | undefined, CommandProp>;
    public aliases: Collection<string, string>;
    public categories: Collection<string, object>;
    public helpMeta: Collection<string, object>;
    public loader: { events?: EventsLoader; modules?: ModulesLoader };
    constructor(opt: ClientOptions) {
        super(opt);
        this.events = new Collection();
        this.commands = new Collection();
        this.aliases = new Collection();
        this.categories = new Collection();
        this.helpMeta = new Collection();

        this.loader = {};
        this.loader.events = new EventsLoader(this, resolve(__dirname, "..", "events"));
        this.loader.modules = new ModulesLoader(this, resolve(__dirname, "..", "commands"));

    }

    public build(token: string | undefined): BotClient {
        this.login(token);
        this.loader.events!.build();
        this.events.forEach((event: EventProp) => {
            this.on(event.name, event.run);
        });
        this.loader.modules!.build();
        return this;
    }

}
