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
import { IGuildManager } from "../typings/Guild";

// Extending DiscordJS structures
import "../structures/User";
import "../structures/Guild";
import "../structures/GuildMember";
import "../structures/Message";

export default class BotClient extends Client {
    readonly config: typeof config = config;
    readonly request: typeof request = request;
    public guilds!: IGuildManager;
    readonly events: Collection<string, EventProp> = new Collection();
    readonly commands: Collection<string | undefined, CommandComponent | undefined> = new Collection();
    readonly aliases: Collection<string | undefined, string> = new Collection();
    readonly categories: Collection<string, Collection<string | undefined, CommandComponent | undefined>> = new Collection();
    readonly helpMeta: Collection<string, helpMeta> = new Collection();
    readonly cooldowns: Collection<string, Collection<Snowflake, number>> = new Collection();
    readonly util: Util = new Util(this);
    readonly commandsHandler: CommandsHandler = new CommandsHandler(this);
    readonly loader = {events: new EventsLoader(this, resolve(__dirname, "..", "events")), modules: new ModulesLoader(this, resolve(__dirname, "..", "commands"))};
    constructor(opt: ClientOptions) { super(opt); }

    public build(token: string | undefined): BotClient {
        this.loader.events.build();
        this.on("ready", () => this.loader.modules.build());
        this.login(token);
        return this;
    }
}
