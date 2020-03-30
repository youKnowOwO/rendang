/* eslint-disable @typescript-eslint/ban-ts-ignore  */
/* eslint-disable no-extra-parens */
import { Structures, TextChannel } from "discord.js";
import BotClient from "../handlers/BotClient";
import { IMessage } from "../typings";

Structures.extend("Message", DJSMessage => {
    // @ts-ignore
    class Message extends DJSMessage implements IMessage {
        public args: string[] = [];
        public cmd: string | any = null;
        public flag: string[] = [];
        public guild!: IMessage["guild"] | null;
        public member!: IMessage["member"] | null;
        public client!: IMessage["client"];
        public author!: IMessage["author"];
        public TextChannel!: IMessage["channel"];
        constructor(client: BotClient, data: object, channel: TextChannel) {
            super(client, data, channel);
            const prefix = this.guild ? this.guild.config.prefix : this.client.config.prefix;
            if (this.content.startsWith(prefix as string) || (this.content.startsWith(this.client.config.prefix) && this.guild!.config.allowDefaultPrefix)) {
                this.args = this.content.substring(prefix!.length).trim().split(" ");
                const cmd = this.args.shift()!.toLowerCase();
                this.cmd = client.commands.has(cmd) ? cmd : null;
                while (this.args[0] && ((this.args[0].startsWith("--") && this.args[0].length != 2) || (this.args[0].startsWith("-") && this.args[0].length != 1))) {
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
