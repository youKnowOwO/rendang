/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommandComponent, IMessage } from "../typings";
import BotClient from "../handlers/BotClient";
import { MessageEmbed } from "discord.js";

export default class BaseCommand implements CommandComponent {
    public conf: CommandComponent["conf"];
    public help: CommandComponent["help"];
    constructor(public client: BotClient, readonly _config: CommandComponent["_config"], conf: CommandComponent["conf"], help: CommandComponent["help"]) {
        this.conf = {
            aliases: [],
            cooldown: 3,
            devOnly: false,
            guildOnly: false,
            requiredPermissions: [],
            disable: false,
            path: this._config.path
        };
        this.help = {
            name: "",
            description: "",
            category: this._config.category,
            usage: "",
            example: ""
        };
        Object.assign(this.conf, conf);
        Object.assign(this.help, help);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public run(message: IMessage): any {}

    public reload(): CommandComponent | void {
        delete require.cache[require.resolve(`${this.conf.path}`)];
        const newCMD = new (require(`${this.conf.path}`).default)();
        // eslint-disable-next-line @typescript-eslint/unbound-method
        this.client.commands.get(this.help.name)!.run = newCMD.run;
        this.client.commands.get(this.help.name)!.help = newCMD.help;
        this.client.commands.get(this.help.name)!.conf = newCMD.conf;
        this.client.log.info(`${this.help.name} command reloaded.`);
        return this.client.commands.get(this.help.name);
    }
    public invalidArgs(msg: IMessage, reason: string): Promise<any> {
        const usage = this.help.usage ? `${this.help.usage.replace(new RegExp("{prefix}", "g"), `**${msg.guild ? msg.guild.config.prefix : msg.client.config.prefix}**`)}` : "No usage provided.";
        const example = this.help.example ? `${this.help.example.replace(new RegExp("{prefix}", "g"), `**${msg.guild ? msg.guild.config.prefix : msg.client.config.prefix}**`)}` : "No example provided.";
        const embed = new MessageEmbed()
            .setAuthor(`It's not how you use ${this.help.name}`, `${this.client.config.staticServer}/images/596234507531845634.png`)
            .setColor("#FF0000")
            .setThumbnail(this.client.user!.displayAvatarURL())
            .addFields({
                name: "<:info:596219360209797161> Reason:",
                value: `**${reason}**`
            }, {
                name: "<:true:596220121429573653> Correct Usage :",
                value: usage
            }, {
                name: "📃 Example :",
                value: example
            })
            .setTimestamp()
            .setFooter(`Get more info about this command using ${msg.guild ? msg.guild.config.prefix : msg.client.config.prefix}help ${this.help.name}`, `${this.client.config.staticServer}/images/390511462361202688.png`);

        return msg.channel.send(embed);
    }
}
