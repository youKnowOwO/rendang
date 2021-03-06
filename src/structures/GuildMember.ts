import { Structures } from "discord.js";
import BotClient from "../handlers/BotClient";
import { IGuildMember } from "../typings";

Structures.extend("GuildMember", DJSGuildMember => {
    class GuildMember extends DJSGuildMember implements IGuildMember {
        public user!: IGuildMember["user"];
        public guild!: IGuildMember["guild"];
        readonly isDev = this.user.isDev;
        readonly voice!: IGuildMember["voice"];
        constructor(client: BotClient, data: object, guild: IGuildMember["guild"]) { super(client, data, guild); }
    }

    return GuildMember;
});
