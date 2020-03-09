import DiscordJS from "discord.js";
import BotClient from "./BotClient";

export default class Util {
    private client: BotClient;
    constructor(client: BotClient) {
        this.client = client;
    }

    public getAvatar(user: DiscordJS.UserResolvable | any): Promise<string> | string | any {
        let isGif: any = this.client.users.resolve(user)!.displayAvatarURL().split(".");
        isGif = isGif[isGif.length - 1] === "gif";
        const final: DiscordJS.ImageURLOptions = isGif ? { format: "gif" } : { format: "png" };
        return this.client.users.resolve(user)!.displayAvatarURL(final);
    }

    public getGuildIcon(guild): Promise<string> | string | any {
        if (guild.iconURL === null) return guild.iconURL();
        let isGif: any = guild.iconURL().split(".");
        isGif = isGif[isGif.length - 1] === "gif";
        const final: DiscordJS.ImageURLOptions = isGif ? { format: "gif" } : { format: "png" };
        return guild.iconURL(final);
    }
}
