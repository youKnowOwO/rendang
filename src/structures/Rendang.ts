/* eslint-disable no-underscore-dangle */
import { Client, ClientOptions } from "discord.js";
import config from "../config";
import { resolve } from "path";
import * as superagent from "superagent";
import { LogWrapper } from "../utils/LogWrapper";
import EventManager from "../managers/EventManager";
// import CommandsManager from "../managers/CommandsManager";

// Extending DiscordJS structures
// still none yet.

export default class Rendang extends Client {
    private _token = "n/a";
    readonly config = config;
    readonly request = superagent;
    readonly log = new LogWrapper(this.config.botName).logger;
    readonly events = new EventManager(this);
    // readonly commands = new CommandsManager(this);
    constructor(options?: ClientOptions) { super(options); }

    public async build(): Promise<Rendang> {
        // this.on("ready", () => this.commands.load());
        this.events.load(resolve(__dirname, "..", "events"));
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