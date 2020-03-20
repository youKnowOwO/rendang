import { Guild, VoiceState, Collection, Snowflake, VoiceStateManager, ChannelResolvable, GuildMemberResolvable, GuildMemberManager, UserResolvable, BanOptions, FetchMemberOptions, FetchMembersOptions } from "discord.js";
import IGuildMember from "./GuildMember";
import IUser from "./User";

export default interface IGuild extends Guild {
    prefix: string;
    me: IGuildMember;
    owner: IGuildMember;
    members: IGuildMemberManager;
    voice: IVoiceState | null;
    voiceStates: IVoiceStateManager;
    setOwner(owner: GuildMemberResolvable, reason?: string): Promise<IGuild>;
}

interface IGuildMemberManager extends GuildMemberManager {
    cache: Collection<Snowflake, IGuildMember>;
    guild: IGuild;
    ban(user: UserResolvable, options?: BanOptions): Promise<IGuildMember | IUser | Snowflake>;
    fetch(options: UserResolvable | FetchMemberOptions | (FetchMembersOptions & { user: UserResolvable })): Promise<IGuildMember>;
    fetch(options?: FetchMembersOptions): Promise<Collection<Snowflake, IGuildMember>>;
    resolve(member: GuildMemberResolvable): IGuildMember;
    unban(user: UserResolvable, reason?: string): Promise<IUser>;
}


interface IVoiceState extends VoiceState {
    guild: IGuild;
    member: IGuildMember | null;
    setDeaf(deaf: boolean, reason?: string): Promise<IGuildMember>;
    setMute(mute: boolean, reason?: string): Promise<IGuildMember>;
    kick(reason?: string): Promise<IGuildMember>;
    setChannel(channel: ChannelResolvable | null, reason?: string): Promise<IGuildMember>;
}

interface IVoiceStateManager extends VoiceStateManager {
    guild: IGuild;
    cache: Collection<Snowflake, IVoiceState>;
}
