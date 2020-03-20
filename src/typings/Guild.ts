import DiscordJS from "discord.js";

export default interface IGuild extends DiscordJS.Guild {
    prefix: string;
}
