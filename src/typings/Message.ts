import DiscordJS from "discord.js";
import Guild from "./Guild";
import User from "./User";
import GuildMember from "./GuildMember";
import BotClient from "../handlers/BotClient";

export default interface Message extends DiscordJS.Message {
    guild: Guild;
    author: User;
    member: GuildMember;
    client: BotClient;
    args: string[];
    cmd: string;
    flag: string[];
}
