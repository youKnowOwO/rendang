import BotClient from "./BotClient";
import { CommandComponent, IGuild, IGuildMember, IMessage } from "../typings";
import { Collection, Snowflake, BitFieldResolvable, PermissionString, MessageEmbed, Message } from "discord.js";

export default class CommandsHandler {
    constructor(private client: BotClient) {}

    public handle(message: IMessage): CommandComponent | void {
        const commandFile: CommandComponent | void = this.client.commands.get(message.cmd) || this.client.commands.get(this.client.aliases.get(message.cmd));
        if (!commandFile || commandFile.conf.disable) return undefined;
        if (!this.client.cooldowns.has(commandFile.help.name)) this.client.cooldowns.set(commandFile.help.name, new Collection());
        const now = Date.now();
        const timestamps: Collection<Snowflake, number> | undefined = this.client.cooldowns.get(commandFile.help.name);
        const cooldownAmount = (commandFile.conf.cooldown || 3) * 1000;
        if (!timestamps!.has(message.author.id)) {
            timestamps!.set(message.author.id, now);
            if (message.author.isDev) timestamps!.delete(message.author.id);
        } else {
            const expirationTime = timestamps!.get(message.author.id)! + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                message.channel.send(`**${message.author.username}**, please wait **${timeLeft.toFixed(1)}** cooldown time.`).then((msg: IMessage | Message) => {
                    msg.delete({ timeout: 3500 });
                });
                return undefined;
            }

            timestamps!.set(message.author.id, now);
            setTimeout(() => timestamps!.delete(message.author.id), cooldownAmount);
        }

        const command = this.client.commands.get(message.cmd)! || this.client.commands.get(this.client.aliases.get(message.cmd));

        if (command.conf.requiredPermissions.length !== 0 && message.channel.type !== "dm") {
            let requiredPermissions: BitFieldResolvable<PermissionString> | any = "";
            if (command.conf.requiredPermissions.length === 1) requiredPermissions = command.conf.requiredPermissions[0];
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
            command.run(message);
        } catch (e) {
            console.error(e);
        } finally {
            // eslint-disable-next-line no-unsafe-finally
            if (command.conf.devOnly && !message.author.isDev) return undefined;
            // eslint-disable-next-line no-unsafe-finally
            if (command.conf.guildOnly && message.channel.type === "dm") return undefined;
            console.info(`${message.author.tag} is using ${command.help.name} command on ${message.guild ? message.guild.name : "DM Channel"}`);
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
