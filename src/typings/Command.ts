import Message from "./Message";
import DiscordJS from "discord.js";

export default interface CommandComponent {
    run: (message: Message) => any;
    category: string;
    path: string;
    reload: () => CommandComponent | void;
    conf: {
        aliases: string[];
        cooldown: number;
        devOnly: boolean;
        requiredPermissions: DiscordJS.PermissionString[];
        disable: boolean;
    };
    help: {
        name: string | any;
        description: string | any;
        usage: string | any;
        example: string | any;
    };
}
