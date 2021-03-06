/* eslint-disable no-unsafe-finally */
import BotClient from "./BotClient";
import { CommandComponent, IGuild, IGuildMember, IMessage, HelpMeta } from "../typings";
import { Collection, Snowflake, BitFieldResolvable, PermissionString, MessageEmbed } from "discord.js";

export default class CommandsHandler {
    readonly commands: Collection<string, CommandComponent> = new Collection();
    readonly aliases: Collection<string, string> = new Collection();
    readonly categories: Collection<string, Collection<string, CommandComponent>> = new Collection();
    readonly helpMeta: Collection<string, HelpMeta> = new Collection();
    readonly cooldowns: Collection<string, Collection<Snowflake, number>> = new Collection();
    constructor(private client: BotClient) {}

    public handle(message: IMessage): any {
        const command: CommandComponent | void = this.commands.get(message.cmd) || this.commands.get(this.aliases.get(message.cmd)!);
        if (!command || command.conf.disable) return undefined;
        if (!this.cooldowns.has(command.help.name)) this.cooldowns.set(command.help.name, new Collection());
        const now = Date.now();
        const timestamps: Collection<Snowflake, number> = this.cooldowns.get(command.help.name)!;
        const cooldownAmount = (command.conf.cooldown || 3) * 1000;
        if (!timestamps.has(message.author.id)) {
            timestamps.set(message.author.id, now);
            if (message.author.isDev) timestamps.delete(message.author.id);
        } else {
            const expirationTime = timestamps.get(message.author.id)! + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                message.channel.send(`**${message.author.username}**, please wait **${timeLeft.toFixed(1)}** cooldown time.`).then((msg: IMessage) => {
                    msg.delete({ timeout: 3500 });
                });
                return undefined;
            }

            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }

        if (command.conf.requiredPermissions!.length !== 0 && message.channel.type !== "dm") {
            let requiredPermissions: BitFieldResolvable<PermissionString> | any = "";
            if (command.conf.requiredPermissions!.length === 1) requiredPermissions = command.conf.requiredPermissions![0];
            else requiredPermissions = command.conf.requiredPermissions;

            if (message.member!.id !== message.guild!.ownerID) {
                if (!message.member!.permissions.has("ADMINISTRATOR")) {
                    if (!message.member!.permissions.has(requiredPermissions)) return this.permissionError(this.client, message, message.guild!, message.member!, requiredPermissions, command.help.name);
                }
            }
            if (!message.guild!.members.resolve(this.client.user!.id)!.permissions.has(requiredPermissions, true)) return this.clientPermissionError(this.client, message, message.guild!, message.member!, requiredPermissions, command.help.name);
        }

        try {
            if (command.conf.guildOnly && message.channel.type === "dm") return undefined;
            if (command.conf.devOnly && !message.author.isDev) return undefined;
            return command.execute(message);
        } catch (e) {
            this.client.log.error("COMMAND_HANDLER_ERR: ", e);
        } finally {
            if (command.conf.devOnly && !message.author.isDev) return undefined;
            if (command.conf.guildOnly && message.channel.type === "dm") return undefined;
            this.client.log.info(`${message.author.tag} is using ${command.help.name} command on ${message.guild ? message.guild.name : "DM Channel"}`);
        }
    }

    private permissionError(client: BotClient, message: IMessage, guild: IGuild, member: IGuildMember, permission: string[], commandName: string): void {
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

    private clientPermissionError(client: BotClient, message: IMessage, guild: IGuild, member: IGuildMember, permission: string[], commandName: string): void {
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
