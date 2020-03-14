import { Client, ClientOptions, Collection, Snowflake } from "discord.js";
import config from "../config.json";
import CommandComponent from "../typings/Command";
import EventsLoader from "./Events";
import EventProp from "../typings/Event";
import { resolve } from "path";
import ModulesLoader from "./Modules";
import Util from "./Util";
import CommandsHandler from "./Commands";
import * as request from "superagent";

// Extending DiscordJS structures
import "../structures/User";
import "../structures/Guild";
import "../structures/GuildMember";
import "../structures/Message";
import helpMeta from "../typings/helpMeta";

export default class BotClient extends Client {
    public config: typeof config = config;
    public request: typeof request;
    public events: Collection<string, EventProp>;
    public commands: Collection<string | undefined, CommandComponent | undefined>;
    public aliases: Collection<string | undefined, string>;
    public categories: Collection<string, Collection<string | undefined, CommandComponent | undefined>>;
    public helpMeta: Collection<string, helpMeta>;
    public cooldowns: Collection<string, Collection<Snowflake, number>>;
    public util: Util;
    public commandsHandler: CommandsHandler;
    constructor(opt: ClientOptions) {
        super(opt);

        this.request = request;
        this.util = new Util(this);

        this.events = new Collection();
        this.commands = new Collection();
        this.aliases = new Collection();
        this.categories = new Collection();
        this.helpMeta = new Collection();
        this.cooldowns = new Collection();

        this.commandsHandler = new CommandsHandler(this);
    }

    public build(token: string | undefined): BotClient {
        this.login(token);
        const loader = {events: new EventsLoader(this, resolve(__dirname, "..", "events")), modules: new ModulesLoader(this, resolve(__dirname, "..", "commands"))};
        loader.events.build();
        this.events.forEach((event: EventProp) => {
            this.on(event.name, event.run);
        });
        this.on("ready", () => loader.modules.build());
        return this;
    }

}
