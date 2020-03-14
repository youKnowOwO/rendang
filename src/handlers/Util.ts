import DiscordJS from "discord.js";
import BotClient from "./BotClient";
import Message from "../typings/Message";

export default class Util {
    private client: BotClient;
    constructor(client: BotClient) {
        this.client = client;
    }

    public base64 = {
        encode: (text: string): string => {
            return Buffer.from(text).toString("base64");
        },
        decode: (base64): string => {
            return Buffer.from(base64, "base64").toString();
        }
    };

    public hex = {
        encode: (text: string): string => {
            return Buffer.from(text).toString("hex");
        },
        decode: (hex): string => {
            return Buffer.from(hex, "hex").toString();
        }
    };

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

    public bytesToSize(bytes: number): string {
        if (isNaN(bytes) && bytes != 0) throw new Error(`[bytesToSize] (bytes) Error: bytes is not a Number/Integer, received: ${typeof bytes}`);
        const sizes = ["B", "KiB", "MiB", "GiB", "TiB", "PiB"];
        if (bytes < 2 && bytes > 0) return `${bytes} Byte`;
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
        if (i == 0) return bytes + " " + sizes[i];
        if (sizes[i] === undefined) return bytes + " " + sizes[sizes.length - 1];
        return Number(bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
    }

    public parseDur(ms): string {
        let seconds = ms / 1000;
        const days = parseInt((seconds / 86400).toString());
        seconds = seconds % 86400;
        const hours = parseInt((seconds / 3600).toString());
        seconds = seconds % 3600;
        const minutes = parseInt((seconds / 60).toString());
        seconds = parseInt((seconds % 60).toString());


        if (days) {
            return `${days}d ${hours}h ${minutes}min ${seconds}s`;
        } else if (hours) {
            return `${hours}h ${minutes}min ${seconds}s`;
        } else if (minutes) {
            return `${minutes}min ${seconds}s`;
        }
        return `${seconds}s`;
    }

    public trimArray(arr: string[], length = 10): string[] {
        const len = arr.length - length;
        const temp = arr.slice(0, length);
        temp.push(`...${len} more.`);
        return temp;
    }

    public percentOf(num: number, prcnt: number): number {
        if (!num || isNaN(num)) throw new Error(`[percentOf] (num) Error: num is not a Number/Integer, received: ${typeof num}`);
        if (!prcnt || isNaN(prcnt)) prcnt = 100;
        const number = Number(num);
        const percent = Number(prcnt);
        const result = percent / 100 * number;
        return result;
    }

    public getPercentage(percentFor: number, percentOf: number): string {
        if (!percentFor || isNaN(percentFor)) throw new Error(`[getPercentage] (percentFor) Error: percentFor is not a Number/Integer, received: ${typeof percentFor}`);
        if (!percentOf || isNaN(percentOf)) throw new Error(`[getPercentage] (percentOf) Error: percentOf is not a Number/Integer, received: ${typeof percentOf}`);
        const percentage = Math.floor(percentFor / percentOf * 100);
        return `${percentage}%`;
    }

    public codeblock(text: string, code: string): string {
        return `\`\`\`${code}\n${text}\`\`\``;
    }

    public getFirstLetter(string: string): string {
        return string.split("")[0];
    }

    public argsMissing(msg: Message, reason: string, cmd): Promise<any> {
        const usage = cmd.usage ? `**${msg.guild.prefix}**${cmd.usage}` : "No usage provided.";
        const example = cmd.example ? `**${msg.guild.prefix}**${cmd.example}` : "No example provided.";
        const embed = new DiscordJS.MessageEmbed()
            .setAuthor(`It's not how you use ${cmd.name}`, `${this.client.config.staticServer}/images/596234507531845634.png`)
            .setColor("#FF0000")
            .setThumbnail(this.client.user!.displayAvatarURL())
            .addFields({
                name: "<:info:596219360209797161> Reason:",
                value: `**${reason}**`
            }, {
                name: "<:true:596220121429573653> Correct Usage :",
                value: usage
            }, {
                name: "📃 Example :",
                value: example
            })
            .setTimestamp()
            .setFooter(`Get more info about this command using ${msg.guild.prefix}help ${cmd.name}`, `${this.client.config.staticServer}/images/390511462361202688.png`);

        return msg.channel.send(embed);
    }

}
