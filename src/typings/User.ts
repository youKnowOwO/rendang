import { User } from "discord.js";

export default interface IUser extends User {
    isDev?: boolean;
}
