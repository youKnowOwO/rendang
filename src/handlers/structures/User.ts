import { Structures } from "discord.js";
import BotClient from "../BotClient";

Structures.extend("User", DJSUser => {
    class User extends DJSUser {
        public isDev?: boolean;
        constructor(client: BotClient, data: object) {
            super(client, data);
            if (client.config.devs.includes(this.id)) this.isDev = true;
            else this.isDev = false;
        }
    }

    return User;
});
