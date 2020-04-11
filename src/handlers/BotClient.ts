/* eslint-disable no-underscore-dangle */
import { Client, ClientOptions } from "discord.js";
import { resolve } from "path";
import * as request from "superagent";
import config from "../config";
import EventsLoader from "./Events";
import ModulesLoader from "./Modules";
import Util from "./Util";
import CommandsHandler from "./Commands";
import { IGuildManager, IUserManager, IDatabases, IGuildModel } from "../typings";
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
    readonly util = new Util(this);
    readonly loader = { events: new EventsLoader(this, resolve(__dirname, "..", "events")), modules: new ModulesLoader(this, resolve(__dirname, "..", "commands")) };
    readonly commandsHandler = new CommandsHandler(this);
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
