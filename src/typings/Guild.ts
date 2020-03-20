import { Guild } from "discord.js";

export default interface IGuild extends Guild {
    prefix: string;
}
