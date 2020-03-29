import { Structures } from "discord.js";
import { IGuild, ITextChannel } from "../typings";

Structures.extend("TextChannel", DJSTextChannel => {
    class TextChannel extends DJSTextChannel implements ITextChannel {
        public prefix: string;
        public guild!: ITextChannel["guild"];
        public client!: ITextChannel["client"];
        public send!: ITextChannel["send"];
        constructor(guild: IGuild, data: object) {
            super(guild, data);
            this.prefix = this.guild ? this.guild.prefix : this.client.config.prefix;
        }
    }

    return TextChannel;
});
