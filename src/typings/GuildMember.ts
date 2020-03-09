import DiscordJS from "discord.js";

export default interface GuildMember extends DiscordJS.GuildMember {
    isDev?: boolean;
}
