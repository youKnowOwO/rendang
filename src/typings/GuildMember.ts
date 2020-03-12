import DiscordJS from "discord.js";
import User from "./User";

export default interface GuildMember extends DiscordJS.GuildMember {
    user: User;
    isDev?: boolean;
}
