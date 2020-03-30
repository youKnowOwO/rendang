/* eslint-disable no-underscore-dangle */
import { Client, ClientOptions, Collection, Snowflake } from "discord.js";
import { resolve } from "path";
import * as request from "superagent";
import config from "../config.json";
import EventsLoader from "./Events";
import ModulesLoader from "./Modules";
import Util from "./Util";
import CommandsHandler from "./Commands";
import { IGuildManager, IUserManager, EventProp, CommandComponent, HelpMeta, IDatabases, IGuildModel } from "../typings";
import { LogWrapper } from "./LogWrapper";
import { Adapter as DatabaseAdapter } from "../database";
import GuildModel from "../database/models/Guild.model";
import { Model } from "mongoose";

// Extending DiscordJS structures
import "../structures/User";
import "../structures/Guild";
import "../structures/GuildMember";
import "../structures/Message";

export default class BotClient extends Client {
    private _token = "n/a";
    readonly config = config;
    readonly request = request;
    public guilds!: IGuildManager;
    public users!: IUserManager;
    readonly events: Collection<string, EventProp> = new Collection();
    readonly commands: Collection<string | undefined, CommandComponent | undefined> = new Collection();
    readonly aliases: Collection<string | undefined, string> = new Collection();
    readonly categories: Collection<string, Collection<string | undefined, CommandComponent | undefined>> = new Collection();
    readonly helpMeta: Collection<string, HelpMeta> = new Collection();
    readonly cooldowns: Collection<string, Collection<Snowflake, number>> = new Collection();
    readonly util = new Util(this);
    readonly commandsHandler = new CommandsHandler(this);
    readonly loader = {events: new EventsLoader(this, resolve(__dirname, "..", "events")), modules: new ModulesLoader(this, resolve(__dirname, "..", "commands"))};
    readonly log = new LogWrapper(this.config.botName).logger;
    readonly db: IDatabases;
    constructor(opt: ClientOptions) {
        super(opt);
        this.db = {
            Adapter: new DatabaseAdapter(process.env.MONGODB_URI, {}),
            guild: GuildModel as Model<IGuildModel>
        };
    }

    public async build(): Promise<BotClient> {
        this.on("ready", () => this.loader.modules.build());
        this.loader.events.build();
        await this.db.Adapter.connect();
        this.login(this.getToken());
        return this;
    }
    // Getter Setter
    public setToken(token: string): BotClient {
        this._token = token;
        return this;
    }
    public getToken(): string {
        return this._token;
    }
}
