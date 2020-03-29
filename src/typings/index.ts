import { PermissionString, Snowflake, Collection, GuildMemberResolvable, ClientEvents, UserResolvable, BanOptions, FetchMemberOptions, FetchMembersOptions, Guild, GuildManager, GuildMemberManager, VoiceState, GuildMember, VoiceStateManager, Message, User, UserManager, ChannelResolvable } from "discord.js";
import BotClient from "../handlers/BotClient";

export interface CommandComponent {
    run(message: IMessage): any;
    category: string;
    path: string;
    reload(): CommandComponent | void;
    conf: {
        aliases: string[];
        cooldown: number;
        devOnly: boolean;
        guildOnly: boolean;
        requiredPermissions: PermissionString[];
        disable: boolean;
    };
    help: {
        name: string | any;
        description: string | any;
        usage: string | any;
        example: string | any;
    };
}

export interface EventProp {
    name: keyof ClientEvents;
    run: any;
}

export interface IGuild extends Guild {
    prefix: string;
    me: IGuildMember;
    owner: IGuildMember;
    members: IGuildMemberManager;
    voice: IVoiceState | null;
    voiceStates: IVoiceStateManager;
    setOwner(owner: GuildMemberResolvable, reason? : string): Promise<IGuild>;
}

export interface IGuildManager extends GuildManager {
    cache: Collection<Snowflake, IGuild>;
}

export interface IGuildMemberManager extends GuildMemberManager {
    cache: Collection<Snowflake, IGuildMember>;
    guild: IGuild;
    ban(user: UserResolvable, options? : BanOptions): Promise<IGuildMember | IUser | Snowflake>;
    fetch(options: UserResolvable | FetchMemberOptions | (FetchMembersOptions & { user: UserResolvable })): Promise<IGuildMember>;
    fetch(options? : FetchMembersOptions): Promise<Collection<Snowflake, IGuildMember>>;
    resolve(member: GuildMemberResolvable): IGuildMember;
    unban(user: UserResolvable, reason? : string): Promise<IUser>;
}

export interface IGuildMember extends GuildMember {
    user: IUser;
    isDev: boolean;
    guild: IGuild;
    voice: IVoiceState;
}

export interface IVoiceState extends VoiceState {
    guild: IGuild;
    member: IGuildMember | null;
    setDeaf(deaf: boolean, reason? : string): Promise<IGuildMember>;
    setMute(mute: boolean, reason? : string): Promise<IGuildMember>;
    kick(reason? : string): Promise <IGuildMember>;
    setChannel(channel: ChannelResolvable | null, reason? : string): Promise<IGuildMember>;
}

export interface IVoiceStateManager extends VoiceStateManager {
    guild: IGuild;
    cache: Collection<Snowflake, IVoiceState>;
}

export interface HelpMeta {
    name: string;
    hide: boolean;
    path: string;
    cmds: string[];
}

export interface IMessage extends Message {
    guild: IGuild | null;
    author: IUser;
    member: IGuildMember | null;
    client: BotClient;
    args: string[];
    cmd: string | any;
    flag: string[];
}

export interface ModuleConf {
    name: string | any;
    hide: boolean;
    path: string | any;
    cmds: string[];
}

export interface IUser extends User {
    isDev: boolean;
}

export interface IUserManager extends UserManager {
    cache: Collection <Snowflake, IUser>;
    client: BotClient;
    fetch(id: Snowflake, cache? : boolean): Promise<IUser>;
    resolve(user: UserResolvable): IUser;
    resolveID(user: UserResolvable): Snowflake;
}
