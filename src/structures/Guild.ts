import { Structures } from "discord.js";
import BotClient from "../handlers/BotClient";
import { IGuild } from "../typings";

Structures.extend("Guild", DJSGuild => {
    class Guild extends DJSGuild implements IGuild {
        public prefix!: string;
        readonly me!: IGuild["me"];
        readonly owner!: IGuild["owner"];
        public member!: IGuild["member"];
        public members!: IGuild["members"];
        readonly voice!: IGuild["voice"];
        public voiceStates!: IGuild["voiceStates"];
        public setOwner!: IGuild["setOwner"];
        public client!: BotClient;
        constructor(client: BotClient, data: object) {
            super(client, data);
            client.db.guild.findById(this.id).then(data => {
                if (data === null) new client.db.guild({_id: this.id, config: { prefix: client.config.prefix } }).save();
                this.prefix = data ? data.config.prefix : client.config.prefix;
            });
        }
        public async setPrefix(prefix: string): Promise<void> {
            const data = await this.client.db.guild.findById(this.id);
            data!.config.prefix = prefix;
            data!.save();
            this.prefix = prefix;
        }
    }

    return Guild;
});
