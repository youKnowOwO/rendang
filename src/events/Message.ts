import BotClient from "../handlers/BotClient";
import Message from "../typings/Message";
import { MessageEmbed } from "discord.js";

export default class MessageEvent {
    private client: BotClient;
    public name: string;
    public run: Function;
    constructor(client: BotClient) {
        this.client = client;
        this.name = "message";

        this.run = (message: Message): Message | void => {
            if (message.author.bot || !message.guild) { return undefined; }

            try {
                client.commandsHandler.handle(message);
            } catch (e) {
                console.error(e);
            }

            if (message.mentions.users.has(message.client.user!.id)) {
                const embed = new MessageEmbed()
                    .setAuthor(`${client.user!.username}`, client.util.getAvatar(client.user))
                    .setColor("GREEN")
                    .setDescription(`:wave: | Hello ${message.author.username}, my prefix for this server is \`${message.guild.prefix}\``)
                    .setTimestamp();
                message.channel.send(embed);
            }

            return message;
        };
    }
}
