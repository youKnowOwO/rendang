import { GuildMember } from "discord.js";
import IUser from "./User";

export default interface IGuildMember extends GuildMember {
    user: IUser;
    isDev?: boolean;
}
