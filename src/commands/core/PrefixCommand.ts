/* eslint-disable @typescript-eslint/no-unused-vars */
import BaseCommand from "../../structures/BaseCommand";
import BotClient from "../../handlers/BotClient";
import { IMessage } from "../../typings";
import { MessageEmbed } from "discord.js";

export default class Command extends BaseCommand {
    constructor(client: BotClient, readonly category: string, readonly path: string) {
        super(client, category, path);
        this.conf = {
            aliases: ["pref", "server-prefix"],
            cooldown: 10,
            devOnly: false,
            guildOnly: true,
            requiredPermissions: ["MANAGE_GUILD"],
            disable: false
        };

        this.help = {
            name: "prefix",
            description: "Show or change the server prefix",
            usage: "{prefix}prefix --show\n{prefix}prefix --set <newPrefix>\n{prefix}prefix --reset",
            example: "{prefix}prefix --show\n{prefix}prefix --set >\n{prefix}prefix --reset"
        };
    }

    public async run(message: IMessage): Promise<IMessage> {
        const lastPrefix = message.guild!.prefix;
        const newPrefix = message.args[0] ? message.args[0].toString().toLowerCase() : undefined;

        switch (message.flag[0]) {
            case "show":
                const embed = new MessageEmbed()
                    .setAuthor(message.guild!.name, this.client.util.getGuildIcon(message.guild!))
                    .setColor("#00FF00")
                    .setDescription(`My prefix for this server is **${message.guild!.prefix}**`)
                    .setTimestamp()
                    .setFooter(`${message.author.username}@${message.guild!.name}`, this.client.util.getAvatar(message.author));
                message.channel.send(embed);
                break;
            case "set":
                if (!newPrefix) return this.client.util.argsMissing(message, "Not enough arguments. (no newPrefix)", this.help);
                message.guild!.setPrefix(newPrefix);
                const embed2 = new MessageEmbed()
                    .setAuthor(message.guild!.name, this.client.util.getGuildIcon(message.guild!))
                    .setColor("#00FF00")
                    .setDescription(`Successfully changed the server prefix from **${lastPrefix}** to **${newPrefix}**`)
                    .setTimestamp()
                    .setFooter(`${message.author.username}@${message.guild!.name}`, this.client.util.getAvatar(message.author));
                message.channel.send(embed2);
                break;
        }
        return message;
    }
}
