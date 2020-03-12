import { Structures } from "discord.js";
import BotClient from "../BotClient";

export default (): Structures => {
    return Structures.extend("Guild", DJSGuild => {
        class Guild extends DJSGuild {
            public prefix: string;
            constructor(client: BotClient, data: object) {
                super(client, data);
                this.prefix = client.config.prefix;
            }
        }

        return Guild;
    });
};
