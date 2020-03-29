import BotClient from "../handlers/BotClient";
import { IMessage, EventProp } from "../typings";
import { MessageEmbed } from "discord.js";

export default class MessageEvent implements EventProp {
    readonly name = "message";
    constructor(private client: BotClient) {}

    public run(message: IMessage): IMessage | void {
        if (message.author.bot) return undefined;

        try {
            this.client.commandsHandler.handle(message);
        } catch (e) {
            this.client.log.error("MESSAGE_EVENT_ERR: ", e);
        }

        if (message.mentions.users.has(message.client.user!.id)) {
            const embed = new MessageEmbed()
                .setAuthor(this.client.user!.username, this.client.util.getAvatar(this.client.user))
                .setColor("GREEN")
                .setDescription(`:wave: | Hello ${message.author.username}, my prefix for this server is \`${message.guild!.prefix}\``)
                .setTimestamp();
            message.channel.send(embed);
        }

        return message;
    }
}
