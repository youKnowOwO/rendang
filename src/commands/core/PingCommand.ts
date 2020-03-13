/* eslint-disable @typescript-eslint/no-unused-vars */
import BaseCommand from "../../structures/BaseCommand";
import BotClient from "../../handlers/BotClient";
import Message from "../../typings/Message";
import BotConfig from "../../typings/BotConfig";
import { MessageEmbed } from "discord.js";

export default class PingCommand extends BaseCommand {
    constructor() {
        super();
        this.conf = {
            aliases: ["pong", "peng", "p", "pingpong"],
            cooldown: 3,
            devOnly: false,
            requiredPermissions: [],
            disable: false
        };

        this.help = {
            name: "ping",
            description: "Shows the ping of the bot to the Discord's server",
            example: "ping",
            usage: "ping"
        };
    }
    public run(client: BotClient, message: Message, args: string[], flags: string[], config: typeof BotConfig | null): any {
        const before = Date.now();
        message.channel.send("🏓 Pinging...").then((msg: Message | Message | any) => {
            const latency = Date.now() - before;
            const apiLatency = client.ws.ping.toFixed(0);
            const embed = new MessageEmbed()
                .setAuthor("🏓 PONG!", client.user!.displayAvatarURL())
                .setColor(searchHex(apiLatency))
                .addFields({name: "📶 Message Latency", value: `**\`${latency}\`** ms`, inline: true}, {name: "🌐 WebSocket Latency", value: `**\`${apiLatency}\`** ms`, inline: true})
                .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL())
                .setTimestamp();

            msg.edit(embed);
            msg.edit("");
        });
        return undefined;
    }
}
function searchHex(ms): string | number {
    const listColorHex = [
        [0, 20, "#0DFF00"],
        [21, 50, "#0BC700"],
        [51, 100, "#E5ED02"],
        [101, 150, "#FF8C00"],
        [150, 200, "#FF6A00"]
    ];

    const defaultColor = "#FF0D00";

    const min = listColorHex.map(e => e[0]);
    const max = listColorHex.map(e => e[1]);
    const hex = listColorHex.map(e => e[2]);
    let ret: string | number = "#000000";

    for (let i = 0; i < listColorHex.length; i++) {
        if (min[i] <= ms && ms <= max[i]) {
            ret = hex[i];
            break;
        }
        else {
            ret = defaultColor;
        }
    }
    return ret;
}
