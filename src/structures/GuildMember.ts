import { Structures } from "discord.js";
import BotClient from "../handlers/BotClient";
import IGuild from "../typings/Guild";
import IUser from "../typings/User";
import IGuildMember from "../typings/GuildMember";

Structures.extend("GuildMember", DJSGuildMember => {
    class GuildMember extends DJSGuildMember implements IGuildMember {
        public isDev?: boolean;
        public user!: IUser;
        public guild!: IGuild;
        constructor(client: BotClient, data: object, guild: IGuild) {
            super(client, data, guild);
            this.isDev = this.user.isDev! ? true : false;
        }
    }

    return GuildMember;
});
