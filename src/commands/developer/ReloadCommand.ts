/* eslint-disable @typescript-eslint/no-unused-vars */
import BaseCommand from "../../structures/BaseCommand";
import BotClient from "../../handlers/BotClient";
import { IMessage } from "../../typings";
import { MessageEmbed } from "discord.js";

export default class ReloadCommand extends BaseCommand {
    constructor(client: BotClient, readonly category: string, readonly path: string) {
        super(client, category, path);
        this.conf = {
            aliases: ["rl", "reloadcommand"],
            cooldown: 3,
            devOnly: true,
            guildOnly: false,
            requiredPermissions: [],
            disable: false
        };

        this.help = {
            name: "reload",
            description: "Only my developer can use this command",
            usage: "reload --all\n{prefix}reload --category <CategoryName>\n{prefix}reload --command <CommandName>",
            example: "reload --all\n{prefix}reload --category Core\n{prefix}reload --command ping"
        };
    }

    public async run(message: IMessage): Promise<IMessage> {
        if (!message.flag[0]) return this.client.util.argsMissing(message, "Not enough arguments.", this.help);

        if (message.flag[0] === "all") {
            const embed = new MessageEmbed()
                .setColor("#00FF00")
                .setDescription("Reloading...");
            const MSG = await message.channel.send(embed);
            this.client.helpMeta.forEach((category) => {
                category.cmds.forEach((cmd) => {
                    this.client.commands.get(cmd)!.reload();
                });
            });
            embed.setDescription("Reloaded.");
            MSG.edit(embed);
        }

        if (message.flag[0] === "category") {
            if (!message.args[0]) return this.client.util.argsMissing(message, "No args was passed.", this.help);
            const category = message.args[0].toLowerCase();
            if (!this.client.categories.has(category)) return this.client.util.argsMissing(message, "No such category called: " + category + ".", this.help);
            const commands = this.client.categories.get(category)!.keyArray();
            const embed = new MessageEmbed()
                .setColor("#00FF00")
                .setDescription(`Reloading ${category} category...`);
            const MSG = await message.channel.send(embed);
            commands.forEach(cmd => {
                this.client.commands.get(cmd)!.reload();
            });
            embed.setDescription(`Category ${category} reloaded.`);
            MSG.edit(embed);
        }

        if (message.flag[0] === "command") {
            if (!message.args[0]) return this.client.util.argsMissing(message, "No args was passed.", this.help);
            let command: string | undefined = message.args[0].toLowerCase();
            if (this.client.commands.has(command) && this.client.aliases.has(command)) return this.client.util.argsMissing(message, "No such command called: " + command + ".", this.help);
            if (this.client.aliases.has(command)) command = this.client.aliases.get(command);
            const embed = new MessageEmbed()
                .setColor("#00FF00")
                .setDescription(`Reloading ${command} command...`);
            const MSG = await message.channel.send(embed);
            this.client.commands.get(command)!.reload();
            embed.setDescription(`${command} command reloaded.`);
            MSG.edit(embed);
        }
        return message;
    }
}
