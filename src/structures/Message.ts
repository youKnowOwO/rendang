/* eslint-disable no-extra-parens */
import { Structures, TextChannel } from "discord.js";
import BotClient from "../handlers/BotClient";
import IMessage from "../typings/Message";
import IGuild from "../typings/Guild";
import IGuildMember from "../typings/GuildMember";

Structures.extend("Message", DJSMessage => {
    class Message extends DJSMessage implements IMessage {
        public args: string[];
        public cmd?: string | any;
        public flag: string[];
        public guild!: IGuild | null;
        public member!: IGuildMember | null;
        public client!: BotClient;
        constructor(client: BotClient, data: object, channel: TextChannel) {
            super(client, data, channel);
            this.args = [];
            this.cmd = null;
            this.flag = [];
            if (this.content.startsWith(this.guild!.prefix) || this.content.startsWith(this.client.config.prefix)) {
                this.args = this.content.substring(this.guild!.prefix.length).trim().split(" ");
                const cmd = this.args.shift()!.toLowerCase();
                this.cmd = client.commands.has(cmd) ? cmd : null;
                while (this.args[0] && (this.args[0].startsWith("--") || this.args[0].startsWith("-"))) {
                    let flag;
                    if (this.args[0].startsWith("--")) {
                        flag = this.args.shift()!.slice(2);
                    } else { flag = this.args.shift()!.slice(1); }
                    this.flag.push(flag);
                }
            }
        }
    }

    return Message;
});
