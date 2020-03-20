import DiscordJS from "discord.js";

export default interface IUser extends DiscordJS.User {
    isDev?: boolean;
}
