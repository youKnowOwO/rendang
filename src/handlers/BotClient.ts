import { Client, ClientOptions, Collection, Snowflake } from "discord.js";
import config from "../config.json";
import CommandComponent from "../typings/Command";
import EventsLoader from "./Events";
import EventProp from "../typings/Event";
import { resolve } from "path";
import ModulesLoader from "./Modules";
import Util from "./Util";
import CommandsHandler from "./Commands";

// Extending DiscordJS structures
import "../handlers/structures/User";
import "../handlers/structures/Guild";
import "../handlers/structures/GuildMember";

export default class BotClient extends Client {
    public config: typeof config = config;
    public events: Collection<string, EventProp>;
    public commands: Collection<string | undefined, CommandComponent>;
    public aliases: Collection<string, string>;
    public categories: Collection<string, object>;
    public helpMeta: Collection<string, object>;
    public cooldowns: Collection<string, Collection<Snowflake, number>>;
    public util: Util;
    public commandsHandler: CommandsHandler;
    private loader: { events?: EventsLoader; modules?: ModulesLoader };
    constructor(opt: ClientOptions) {
        super(opt);

        this.events = new Collection();
        this.commands = new Collection();
        this.aliases = new Collection();
        this.categories = new Collection();
        this.helpMeta = new Collection();
        this.cooldowns = new Collection();
        this.util = new Util(this);
        this.commandsHandler = new CommandsHandler(this);
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
        this.on("ready", () => this.loader.modules!.build());
        return this;
    }

}
