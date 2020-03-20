import DiscordJS from "discord.js";
import Guild from "./Guild";
import User from "./User";
import GuildMember from "./GuildMember";
import BotClient from "../handlers/BotClient";

export default interface IMessage extends DiscordJS.Message {
    guild: Guild | null;
    author: User;
    member: GuildMember | null;
    client: BotClient;
    args: string[];
    cmd?: string | any;
    flag: string[];
}
