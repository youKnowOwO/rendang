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
            usage: "{prefix}prefix --show\n{prefix}prefix --set <newPrefix>\n{prefix}prefix --reset\n{prefix}prefix --allowDefault <boolean>",
            example: "{prefix}prefix --show\n{prefix}prefix --set >\n{prefix}prefix --reset\n{prefix}prefix --allowDefault true"
        };
    }

    public async run(message: IMessage): Promise<IMessage> {
        const lastPrefix = message.guild!.config.prefix;
        const newPrefix = message.args[0] ? message.args[0].toString().toLowerCase() : undefined;

        switch (message.flag[0]) {
            case "show":
                const embed = new MessageEmbed()
                    .setAuthor(message.guild!.name, this.client.util.getGuildIcon(message.guild!))
                    .setColor("#00FF00")
                    .setDescription(`My prefix for this server is \`${message.guild!.config.prefix}\``)
                    .setTimestamp()
                    .setFooter(`${message.author.username}@${message.guild!.name}`, this.client.util.getAvatar(message.author));
                message.channel.send(embed);
                break;
            case "set":
                if (!newPrefix) return this.invalidArgs(message, "Not enough arguments. (no newPrefix)");
                message.guild!.updateConfig({ prefix: newPrefix });
                const embed2 = new MessageEmbed()
                    .setAuthor(message.guild!.name, this.client.util.getGuildIcon(message.guild!))
                    .setColor("#00FF00")
                    .setDescription(`Successfully set the server prefix from \`${lastPrefix}\` to \`${newPrefix}\``)
                    .setTimestamp()
                    .setFooter(`${message.author.username}@${message.guild!.name}`, this.client.util.getAvatar(message.author));
                message.channel.send(embed2);
                break;
            case "reset":
                message.guild!.updateConfig({ prefix: this.client.config.prefix });
                const embed3 = new MessageEmbed()
                    .setAuthor(message.guild!.name, this.client.util.getGuildIcon(message.guild!))
                    .setColor("#00FF00")
                    .setDescription(`Successfully reset the server prefix to \`${this.client.config.prefix}\``)
                    .setTimestamp()
                    .setFooter(`${message.author.username}@${message.guild!.name}`, this.client.util.getAvatar(message.author));
                message.channel.send(embed3);
                break;
            case "allowDefault":
                if (!message.args[0]) return this.invalidArgs(message, "Not enough arguments. (no boolean)");
                if (message.guild!.config.prefix === message.client.config.prefix) return this.invalidArgs(message, "You should set a prefix before using this!");
                const embed4 = new MessageEmbed()
                    .setAuthor(message.guild!.name, this.client.util.getGuildIcon(message.guild!))
                    .setColor("#00FF00")
                    .setTimestamp()
                    .setFooter(`${message.author.username}@${message.guild!.name}`, this.client.util.getAvatar(message.author));
                if (message.args[0] === "true") {
                    message.guild!.updateConfig({ allowDefaultPrefix: true });
                    embed4.setDescription("Usage of default prefix is now allowed.");
                    return message.channel.send(embed4);
                } else if (message.args[0] === "false") {
                    message.guild!.updateConfig({ allowDefaultPrefix: false });
                    embed4.setDescription("Usage of default prefix is now disallowed.");
                    return message.channel.send(embed4);
                } else {
                    this.invalidArgs(message, "boolean must be true or false!");
                }
                break;

            default:
                this.invalidArgs(message, "Not enough arguments.");
                break;
        }
        return message;
    }
}
