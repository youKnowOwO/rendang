import { Structures } from "discord.js";
import BotClient from "../handlers/BotClient";
import IGuild from "../typings/Guild";

Structures.extend("Guild", DJSGuild => {
    class Guild extends DJSGuild implements IGuild {
        public prefix: string;
        constructor(client: BotClient, data: object) {
            super(client, data);
            this.prefix = client.config.prefix;
        }
    }

    return Guild;
});
