import DiscordJS from "discord.js";
import BotClient from "./BotClient";
import Message from "../typings/Message";

export default class Util {
    private client: BotClient;
    constructor(client: BotClient) {
        this.client = client;
    }

    public async hastebin(text: string): Promise<string> {
        const { body } = await this.client.request.post("https://bin.hzmi.xyz/documents")
            .send(text);
        return `https://bin.hzmi.xyz/${body.key}`;
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

    public argsMissing(msg: Message, reason: string, cmd): Promise<any> {
        const usage = cmd.usage ? cmd.example : "No usage provided.";
        const example = cmd.example ? cmd.example : "No example provided.";
        const embed = new DiscordJS.MessageEmbed()
            .setAuthor(`It's not how you use ${cmd.name}`, `${this.client.config.staticServer}/images/596234507531845634.png`)
            .setColor("#FF0000")
            .setThumbnail(this.client.user!.displayAvatarURL())
            .addFields({name: "<:info:596219360209797161> Reason:", value: `**${reason}**`})
            .addFields({name: "<:true:596220121429573653> Correct Usage :", value: `**${msg.guild.prefix}**${usage}` })
            .addFields({name: "📃 Example :", value: `**${msg.guild.prefix}**${example}`})
            .setTimestamp()
            .setFooter(`Get more info about this command using ${msg.guild.prefix}help ${cmd.name}`, `${this.client.config.staticServer}/images/390511462361202688.png`);

        return msg.channel.send(embed);
    }

}
