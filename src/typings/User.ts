import DiscordJS from "discord.js";

export default interface User extends DiscordJS.User {
    isDev?: boolean;
}
