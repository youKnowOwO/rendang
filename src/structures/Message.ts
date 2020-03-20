/* eslint-disable no-extra-parens */
import { Structures, TextChannel } from "discord.js";
import BotClient from "../handlers/BotClient";
import Guild from "../typings/Guild";

Structures.extend("Message", DJSMessage => {
    class Message extends DJSMessage {
        public args: string[];
        public cmd: string | null;
        public flag: string[];
        constructor(client: BotClient, data: object, channel: TextChannel) {
            super(client, data, channel);
            this.args = [];
            this.cmd = null;
            this.flag = [];
            if (this.content.startsWith((this.guild as Guild).prefix) || this.content.startsWith((this.client as BotClient).config.prefix)) {
                this.args = this.content.substring((this.guild as Guild).prefix.length).trim().split(" ");
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
