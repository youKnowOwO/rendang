import DiscordJS from "discord.js";
import User from "./User";

export default interface IGuildMember extends DiscordJS.GuildMember {
    user: User;
    isDev?: boolean;
}
