import { Structures } from "discord.js";
import BotClient from "../handlers/BotClient";

Structures.extend("User", DJSUser => {
    class User extends DJSUser {
        public isDev?: boolean;
        constructor(client: BotClient, data: object) {
            super(client, data);
            this.isDev = client.config.devs.includes(this.id);
        }
    }

    return User;
});
