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
import helpMeta from "../typings/helpMeta";

// Extending DiscordJS structures
import "../structures/User";
import "../structures/Guild";
import "../structures/GuildMember";
import "../structures/Message";

export default class BotClient extends Client {
    public config: typeof config = config;
    public request: typeof request = request;
    public events: Collection<string, EventProp> = new Collection();
    public commands: Collection<string | undefined, CommandComponent | undefined> = new Collection();
    public aliases: Collection<string | undefined, string> = new Collection();
    public categories: Collection<string, Collection<string | undefined, CommandComponent | undefined>> = new Collection();
    public helpMeta: Collection<string, helpMeta> = new Collection();
    public cooldowns: Collection<string, Collection<Snowflake, number>> = new Collection();
    public util: Util = new Util(this);
    public commandsHandler: CommandsHandler = new CommandsHandler(this);
    constructor(opt: ClientOptions) { super(opt); }

    public build(token: string | undefined): BotClient {
        this.login(token);
        const loader = {events: new EventsLoader(this, resolve(__dirname, "..", "events")), modules: new ModulesLoader(this, resolve(__dirname, "..", "commands"))};
        loader.events.build();
        this.on("ready", () => loader.modules.build());
        return this;
    }

}
