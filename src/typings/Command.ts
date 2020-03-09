import BotClient from "../handlers/BotClient";
import Message from "./Message";
import DiscordJS from "discord.js";
import BotConfig from "./BotConfig";

export default interface CommandComponent {
    run: (client: BotClient, message: Message, args: string[], flags: string[], config: typeof BotConfig | null) => any;
    category?: string;
    path?: string;
    reload?: () => CommandComponent | void;
    conf: {
        aliases: string[];
        cooldown: number;
        devOnly: boolean;
        requiredPermissions: DiscordJS.PermissionString[];
        disable: boolean;
    };
    help: {
        name: string | null;
        description: string | null;
        usage: string | null;
        example: string | null;
    };
}
