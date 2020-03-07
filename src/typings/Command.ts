export default interface CommandProp {
    run: Function;
    category: string | any;
    path: string | any;
    reload: Function;
    help: {
        name: string | any;
        description: string | any;
        usage: string | any;
        example: string | any;
    };
    conf: {
        aliases: string[];
        cooldown: any | number | bigint;
        devOnly: boolean;
        requiredPermissions: string[];
        disable: boolean;
    };
}
