import { User, UserManager, Collection, Snowflake, UserResolvable } from "discord.js";
import BotClient from "../handlers/BotClient";

export default interface IUser extends User {
    isDev: boolean;
}

interface IUserManager extends UserManager {
    cache: Collection<Snowflake, IUser>;
    client: BotClient;
    fetch(id: Snowflake, cache?: boolean): Promise<IUser>;
    resolve(user: UserResolvable): IUser;
    resolveID(user: UserResolvable): Snowflake;
}
