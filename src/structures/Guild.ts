import { Structures } from "discord.js";
import BotClient from "../handlers/BotClient";
import { IGuild } from "../typings";

Structures.extend("Guild", DJSGuild => {
    class Guild extends DJSGuild implements IGuild {
        readonly prefix: string;
        readonly me!: IGuild["me"];
        readonly owner!: IGuild["owner"];
        public member!: IGuild["member"];
        public members!: IGuild["members"];
        readonly voice!: IGuild["voice"];
        public voiceStates!: IGuild["voiceStates"];
        public setOwner!: IGuild["setOwner"];
        constructor(client: BotClient, data: object) {
            super(client, data);
            this.prefix = client.config.prefix;
        }
    }

    return Guild;
});
