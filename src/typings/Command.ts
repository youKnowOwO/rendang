import IMessage from "./Message";
import { PermissionString } from "discord.js";

export default interface CommandComponent {
    run: (message: IMessage) => any;
    category: string;
    path: string;
    reload: () => CommandComponent | void;
    conf: {
        aliases: string[];
        cooldown: number;
        devOnly: boolean;
        requiredPermissions: PermissionString[];
        disable: boolean;
    };
    help: {
        name: string | any;
        description: string | any;
        usage: string | any;
        example: string | any;
    };
}
