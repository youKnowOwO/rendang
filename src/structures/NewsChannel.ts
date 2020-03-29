import { Structures } from "discord.js";
import { IGuild, INewsChannel } from "../typings";

Structures.extend("NewsChannel", DJSNewsChannel => {
    class TextChannel extends DJSNewsChannel implements INewsChannel {
        public prefix: string;
        public guild!: INewsChannel["guild"];
        public client!: INewsChannel["client"];
        public send!: INewsChannel["send"];
        constructor(guild: IGuild, data: object) {
            super(guild, data);
            this.prefix = this.guild ? this.guild.prefix : this.client.config.prefix;
        }
    }

    return TextChannel;
});
