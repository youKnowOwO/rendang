import { GuildMember } from "discord.js";
import IUser from "./User";
import IGuild from "./Guild";

export default interface IGuildMember extends GuildMember {
    user: IUser;
    isDev: boolean;
    guild: IGuild;
}
