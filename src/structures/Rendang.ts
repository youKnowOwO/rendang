/* eslint-disable no-underscore-dangle */
import { Client, ClientOptions } from "discord.js";
import config from "../config";
import * as superagent from "superagent";
import { LogWrapper } from "../utils/LogWrapper";
import { IUserManager, IGuildManager } from "../typings";

// Extending DiscordJS structures
import "./User";
import "./Guild";
import "./GuildMember";
import "./Message";

export default class Rendang extends Client {
    private _token = "n/a";
    readonly config = config;
    readonly request = superagent;
    public guilds!: IGuildManager;
    public users!: IUserManager;
    readonly log = new LogWrapper(this.config.botName).logger;
    constructor(options?: ClientOptions) { super(options); }

    public async build(): Promise<Rendang> {
        await this.login(this.getToken());
        return this;
    }

    public setToken(token: string): Rendang {
        this._token = token;
        return this;
    }

    public getToken(): string {
        return this._token;
    }
}