/* eslint-disable @typescript-eslint/no-unused-vars */
import BaseCommand from "../../structures/BaseCommand";
import BotClient from "../../handlers/BotClient";
import { IMessage, CommandComponent } from "../../typings";
import { MessageEmbed } from "discord.js";

export default class ReloadCommand extends BaseCommand {
    constructor(client: BotClient, readonly _config: CommandComponent["_config"]) {
        super(client, _config, {
            aliases: ["rl", "reloadcommand"],
            cooldown: 0,
            devOnly: true
        }, {
            name: "reload",
            description: "Only my developer can use this command",
            usage: "{prefix}reload --all\n{prefix}reload --category <CategoryName>\n{prefix}reload --command <CommandName>",
            example: "{prefix}reload --all\n{prefix}reload --category Core\n{prefix}reload --command ping"
        });
    }

    public async execute(message: IMessage): Promise<IMessage> {
        if (!message.flag[0]) return this.invalid(message, "Not enough arguments.");

        if (message.flag[0] === "all") {
            const embed = new MessageEmbed()
                .setColor("#00FF00")
                .setDescription("Reloading...");
            const MSG = await message.channel.send(embed);
            this.client.commandsHandler.helpMeta.forEach((category) => {
                category.cmds.forEach((cmd) => {
                    this.client.commandsHandler.commands.get(cmd)!.reload();
                });
            });
            embed.setDescription("Reloaded.");
            MSG.edit(embed);
        }

        if (message.flag[0] === "category") {
            if (!message.args[0]) return this.invalid(message, "No args was passed.");
            const category = message.args[0].toLowerCase();
            if (!this.client.commandsHandler.categories.has(category)) return this.invalid(message, "No such category called: " + category + ".");
            const commands = this.client.commandsHandler.categories.get(category)!.keyArray();
            const embed = new MessageEmbed()
                .setColor("#00FF00")
                .setDescription(`Reloading ${category} category...`);
            const MSG = await message.channel.send(embed);
            commands.forEach(cmd => {
                this.client.commandsHandler.commands.get(cmd)!.reload();
            });
            embed.setDescription(`Category ${category} reloaded.`);
            MSG.edit(embed);
        }

        if (message.flag[0] === "command") {
            if (!message.args[0]) return this.invalid(message, "No args was passed.");
            let command: string | undefined = message.args[0].toLowerCase();
            if (this.client.commandsHandler.commands.has(command) && this.client.commandsHandler.aliases.has(command)) return this.invalid(message, "No such command called: " + command + ".");
            if (this.client.commandsHandler.aliases.has(command)) command = this.client.commandsHandler.aliases.get(command);
            const embed = new MessageEmbed()
                .setColor("#00FF00")
                .setDescription(`Reloading ${command} command...`);
            const MSG = await message.channel.send(embed);
            this.client.commandsHandler.commands.get(command!)!.reload();
            embed.setDescription(`${command} command reloaded.`);
            MSG.edit(embed);
        }
        return message;
    }
}
