import DiscordJS from "discord.js";

export default interface Guild extends DiscordJS.Guild {
    prefix: string;
}
