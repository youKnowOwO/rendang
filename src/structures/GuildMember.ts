import { Structures } from "discord.js";
import BotClient from "../handlers/BotClient";
import Guild from "../typings/Guild";
import User from "../typings/User";

Structures.extend("GuildMember", DJSGuildMember => {
    class GuildMember extends DJSGuildMember {
        public isDev?: boolean;
        constructor(client: BotClient, data: object, guild: Guild) {
            super(client, data, guild);
            // eslint-disable-next-line no-extra-parens
            this.isDev = (this.user as User).isDev! ? true : false;
        }
    }

    return GuildMember;
});
