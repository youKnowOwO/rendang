import { Structures } from "discord.js";
import { IDMChannel, IGuild } from "../typings";
import BotClient from "../handlers/BotClient";

Structures.extend("DMChannel", DJSDMChannel => {
    class DMChannel extends DJSDMChannel implements IDMChannel {
        public prefix: string;
        public client!: IDMChannel["client"];
        public send!: IDMChannel["send"];
        public guild: IGuild | undefined;
        constructor(client: BotClient, data: object) {
            super(client, data);
            this.prefix = this.guild ? this.guild.prefix : this.client.config.prefix;
        }
    }

    return DMChannel;
});
