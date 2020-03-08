import BotClient from "../../handlers/BotClient";
//import { CustomMessage } from "../../typings/Command";
import "./module.json";
import { MessageEmbed, Message } from "discord.js";
const run: Function = async (client: BotClient, message: Message, args: string[], config: object) => {
    const before = Date.now();
    message.channel.send("🏓 Pinging...").then((msg: Message | Message | any) => {
        const latency = Date.now() - before;
        const apiLatency = client.ws.ping.toFixed(0);

        const embed = new MessageEmbed()
            .setAuthor("🏓 PONG!", client.user!.displayAvatarURL())
            .setColor(client.config.embedColor)
            .addFields({name: "📶 Message Latency", value: `**\`${latency}\`** ms`, inline: true}, {name: "🌐 WebSocket Latency", value: `**\`${apiLatency}\`** ms`, inline: true})
            .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL())
            .setTimestamp();

        msg.edit(embed);
        msg.edit("");
    });
};

const conf = {
    aliases: [],
    cooldown: 3,
    devOnly: false,
    requiredPermissions: [],
    disable: false,
};

const help = {
    name: "ping",
    description: "Shows the ping of the bot",
    usage: "{prefix}ping",
    example: "{prefix}ping",
};

export { run, conf, help };