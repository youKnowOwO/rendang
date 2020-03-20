import BotClient from "../handlers/BotClient";
import { Message } from "discord.js";
import IGuild from "./Guild";
import IUser from "./User";
import IGuildMember from "./GuildMember";

export default interface IMessage extends Message {
    guild: IGuild | null;
    author: IUser;
    member: IGuildMember | null;
    client: BotClient;
    args: string[];
    cmd: string | any;
    flag: string[];
}
