import BotClient from "./BotClient";
import Message from "../typings/Message";
import Guild from "../typings/Guild";
import { Collection, Snowflake, BitFieldResolvable, PermissionString, MessageEmbed } from "discord.js";
import CommandComponent from "../typings/Command";
import GuildMember from "../typings/GuildMember";

export default class CommandsHandler {
    private client: BotClient;
    constructor(client: BotClient) {
        this.client = client;
    }

    public handle(message: Message): CommandComponent | void {
        const commandFile: CommandComponent | void = this.client.commands.get(message.cmd) || this.client.commands.get(this.client.aliases.get(message.cmd));
        if (!commandFile || commandFile.conf.disable) { return undefined; }
        if (!this.client.cooldowns.has(commandFile.help.name)) {
            this.client.cooldowns.set(commandFile.help.name, new Collection());
        }
        const member: GuildMember = message.member;
        const now: number = Date.now();
        const timestamps: Collection<Snowflake, number> | undefined = this.client.cooldowns.get(commandFile.help.name);
        const cooldownAmount = (commandFile.conf.cooldown || 3) * 1000;
        if (!timestamps!.has(member.id)) {
            timestamps!.set(member.id, now);
            if (message.author.isDev) { timestamps!.delete(member.user.id); }
        } else {
            const expirationTime = timestamps!.get(member.id)! + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                message.channel.send(`**${member.user.username}**, please wait **${timeLeft.toFixed(1)}** cooldown time.`).then((msg: Message | any) => {
                    msg.delete(3400);
                });
                return undefined;
            }

            timestamps!.set(member.id, now);
            setTimeout(() => timestamps!.delete(member.id), cooldownAmount);
        }

        const command: CommandComponent = this.client.commands.get(message.cmd)! || this.client.commands.get(this.client.aliases.get(message.cmd));

        if (command.conf.requiredPermissions.length !== 0) {
            let requiredPermissions: BitFieldResolvable<PermissionString> | any = "";
            if (command.conf.requiredPermissions.length === 1) {
                requiredPermissions = command.conf.requiredPermissions[0];
            } else { requiredPermissions = command.conf.requiredPermissions; }
            if (!message.member.permissions.has(requiredPermissions)) {
                return this.permissionError(this.client, message, message.guild, message.member, requiredPermissions, command.help.name);
            }
            if (!message.guild.members.resolve(this.client.user!.id)!.permissions.has(requiredPermissions)) {
                return this.clientPermissionError(this.client, message, message.guild, message.member, requiredPermissions, command.help.name);
            }
        }

        // command handler
        try {
            if (command.conf.devOnly && !message.author.isDev) return undefined;
            command.run(message);
        } catch (e) {
            console.error(e);
        } finally {
            // eslint-disable-next-line no-unsafe-finally
            if (command.conf.devOnly && !message.author.isDev) return undefined;
            console.info(`${message.author.tag} is using ${command.help.name} command on ${message.guild.name}`);
        }
    }

    private permissionError(client: BotClient, message: Message, guild: Guild, member: GuildMember, permission: string[], commandName: string): void {
        const embed = new MessageEmbed()
            .setAuthor(`You don't have permission${typeof permission === "object" ? "s" : ""} to execute this command`, client.util.getAvatar(client.user))
            .setColor("#FF0000")
            .setThumbnail(client.util.getGuildIcon(guild))
            .addFields({
                name: "❓ **Why?**",
                value: `You're trying to run **${commandName}** command, but you don't have the required permission${typeof permission === "object" ? "s" : ""} to do that.`
            }, {
                name: `<:info:596219360209797161> **Required Permission${typeof permission === "object" ? "s" : ""}**`,
                value: typeof permission === "object" ? permission.map((p) => `\`${p}\``).join(", ") : permission
            })
            .setTimestamp()
            .setFooter(`${member.user.username}@${guild.name}`, client.util.getAvatar(member));
        message.channel.send(embed);
        return undefined;
    }

    private clientPermissionError(client: BotClient, message: Message, guild: Guild, member: GuildMember, permission: string[], commandName: string): void {
        const embed = new MessageEmbed()
            .setAuthor(`I don't have permission${typeof permission === "object" ? "s" : ""} to execute this command,`, client.util.getAvatar(client.user))
            .setColor("#FF0000")
            .setThumbnail(client.util.getGuildIcon(guild))
            .addFields({
                name: "❓ **Why?**",
                value: `You're trying to run **${commandName}** command, but I (the bot) don't have the required permission${typeof permission === "object" ? "s" : ""} to do that.`
            }, {
                name: `<:info:596219360209797161> **Required Permission${typeof permission === "object" ? "s" : ""}**`,
                value: typeof permission === "object" ? permission.map((p) => `\`${p}\``).join(", ") : permission
            })
            .setTimestamp()
            .setFooter(`${member.user.username}@${guild.name}`, client.util.getAvatar(member));
        message.channel.send(embed);
        return undefined;
    }
}
