import { Structures } from "discord.js";
import BotClient from "../BotClient";
import Guild from "../../typings/Guild";
import User from "../../typings/User";

Structures.extend("GuildMember", DJSGuildMember => {
    class GuildMember extends DJSGuildMember {
        public isDev?: boolean;
        constructor(client: BotClient, data: object, guild: Guild) {
            super(client, data, guild);
            const user: User = this.user;
            if (user.isDev) this.isDev = true;
            else this.isDev = false;
        }
    }

    return GuildMember;
});
