/* eslint-disable @typescript-eslint/no-unused-vars */
import BaseCommand from "../../structures/BaseCommand";
import BotClient from "../../handlers/BotClient";
import Message from "../../typings/Message";
import { MessageEmbed } from "discord.js";

export default class ReloadCommand extends BaseCommand {
    constructor(client: BotClient, category: string, path: string) {
        super(client, category, path);
        this.conf = {
            aliases: ["rl", "reloadcommand"],
            cooldown: 3,
            devOnly: true,
            requiredPermissions: [],
            disable: false
        };

        this.help = {
            name: "cmd!",
            description: "Only my developer can use this command",
            usage: "reload --all\n{prefix}reload --category <CategoryName>\n{prefix}reload --command <CommandName>",
            example: "reload --all\n{prefix}reload --category Core\n{prefix}reload --command ping"
        };
    }

    public async run(message: Message): Promise<Message> {
        if (!message.flag[0]) return this.client.util.argsMissing(message, "Not enough arguments.", this.help);

        if (message.flag[0] === "all") {
            const embed = new MessageEmbed()
                .setColor("#00FF00")
                .setDescription("Reloading...");
            const MSG = await message.channel.send(embed);
            this.client.helpMeta.forEach((category) => {
                const name = category.name;
                category.cmds.forEach(file => {
                    this.client.commands.get(file)!.reload();
                });
            });
            embed.setDescription("Reloaded.");
            MSG.edit(embed);
        }

        if (message.flag[0] === "category") {
            const categoryRaw = this.client.util.getFirstLetter(message.args[0]).toUpperCase();
            const category = `${categoryRaw}${message.args[0].slice(1).toLowerCase()}`;
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
            let command: string | undefined = message.args[0].toLowerCase();
            if (!command || !this.client.commands.has(command) && !this.client.aliases.has(command)) return this.client.util.argsMissing(message, "No such command called: " + command + ".", this.help);
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
